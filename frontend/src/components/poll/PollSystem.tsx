import { Contribution } from "@/domains/Contribution";
import useMetaMask from "@/hooks/web3/useMetaMask";
import { Alert, Button, Group, Space, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Container } from "@nivo/core";
import { IconAlertCircle, IconPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { AddYourContribution } from "./AddYourContribution";
import { CandidateCard } from "./CandidateCard";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { Links } from "@/constants/Links";
import { useLocale } from "@/i18n/useLocale";

interface Props {
  candidates: Contribution[];
  alreadyVoted: boolean;
  contributorReward: number;
  vote: (points: number[][], comments: string[]) => void;
  candidateToPoll: (contributionText: string, evidences: string[], roles: string[]) => void;
  perspectives: string[];
  isAdmin: boolean;
  tokenSymbol: string;
  settle: () => void;
}
export const PollSystem = (props: Props) => {
  const { t } = useLocale();
  const { Notification, AlreadyVoteMessage } = t.Poll.PollSystem;
  const router = useRouter();
  const historyPath = Links.getCommonPath(router) + "/history";
  const { address } = useMetaMask();
  const [pointObject, setPointObject] = useState<{ [key: string]: number[] }>({});
  const [commentObject, setCommentObject] = useState<{ [key: string]: string }>({});
  const [distributionObject, setDistributionObject] = useState<{ [key: string]: number }>({});
  //smarller than md
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  useEffect(() => {
    loadLocalStorage();
  }, []);

  useEffect(() => {
    //集計処理
    const points = props.candidates.map((candidate) => {
      const points = pointObject[candidate.contributor];
      if (!points) return 0;
      return points.reduce((a, b) => a + b, 0);
    });
    const total = points.reduce((a, b) => a + b, 0);
    const distribution = points.map((point) => {
      if (total === 0) return 0;
      return (point / total) * props.contributorReward;
    });
    const distributionObject = props.candidates.reduce((obj, candidate, index) => {
      obj[candidate.contributor] = Math.round(distribution[index]);
      return obj;
    }, {} as { [key: string]: number });
    setDistributionObject(distributionObject);
  }, [pointObject]);

  const saveLocalStorage = () => {
    localStorage.setItem("points", JSON.stringify(pointObject));
    localStorage.setItem("comments", JSON.stringify(commentObject));
    window.location.reload();
  };

  const loadLocalStorage = () => {
    const points = localStorage.getItem("points");
    const comments = localStorage.getItem("comments");
    if (points && comments) {
      setPointObject(JSON.parse(points));
      setCommentObject(JSON.parse(comments));
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("points");
    localStorage.removeItem("comments");
  };

  const _vote = async () => {
    const defaultPoints = props.perspectives.map(() => 0);
    const points = props.candidates.map((c) => pointObject[c.contributor] || defaultPoints);
    const comments = props.candidates.map((c) => commentObject[c.contributor] || "");
    await props.vote(points, comments);
    clearLocalStorage();
    showNotification({
      id: "candidate",
      title: Notification.Title,
      message: Notification.Message,
      autoClose: 4000,
      loading: true,
      onClose: () => {
        router.push(historyPath);
      },
    });
  };

  const renderItems = () => {
    return props.candidates.map((candidate) => {
      const point = pointObject[candidate.contributor] || [];
      const comment = commentObject[candidate.contributor] || "";
      const distribution = distributionObject[candidate.contributor] || 0;
      const isYou = candidate.contributor === address;
      return (
        <div key={candidate.contributor}>
          <CandidateCard
            candidate={candidate}
            perspectives={props.perspectives}
            point={point}
            comment={comment}
            tokenSymbol={props.tokenSymbol}
            distribution={distribution}
            disabled={isYou}
            onChangePoint={(point) => {
              setPointObject({ ...pointObject, [candidate.contributor]: point });
            }}
            onChangeComment={(comment) => {
              setCommentObject({ ...commentObject, [candidate.contributor]: comment });
            }}
          />
        </div>
      );
    });
  };

  const renderSaveButton = () => {
    if (props.candidates.length === 0) return null;
    return (
      <div style={{ position: "fixed", bottom: 0, right: 0, left: matches ? 0 : 250 }}>
        <Container>
          <Group position="center" my="xl">
            <Button size="lg" color="gray" radius="md" onClick={saveLocalStorage}>
              {t.Button.SaveDraft}
            </Button>
            <Button size="lg" radius="md" onClick={_vote} variant="gradient" gradient={{ from: "blue", to: "grape" }}>
              {t.Button.SubmitToBlockchain}
            </Button>
            {props.isAdmin ? (
              <Group position="center" my="xl">
                <Button size="lg" color="red" radius="md" onClick={props.settle}>
                  {t.Button.SettlePoll}
                </Button>
              </Group>
            ) : (
              <div />
            )}
          </Group>
        </Container>
      </div>
    );
  };

  return (
    <div>
      <AddYourContribution voted={props.alreadyVoted} candidateToPoll={props.candidateToPoll} />
      {props.alreadyVoted ? (
        <Alert mb="md" icon={<IconAlertCircle size={16} />} color="red">
          {AlreadyVoteMessage}
        </Alert>
      ) : (
        <div />
      )}
      {renderItems()}
      <Space h={100} />
      {renderSaveButton()}
    </div>
  );
};
