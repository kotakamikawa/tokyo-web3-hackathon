import { ContributionCard } from "@/components/contribution/ContributionCard";
import { PollSystem } from "@/components/poll/PollSystem";
import { useDaoExistCheck } from "@/hooks/dao/useDaoExistCheck";
import { useDaoLoad } from "@/hooks/dao/useDaoLoad";
import useDaoToken from "@/hooks/dao/useDaoToken";
import usePoll from "@/hooks/dao/usePoll";
import useMetaMask from "@/hooks/web3/useMetaMask";
import { getLeftTime } from "@/utils/calculateLeftTime";
import { Center, Container, Text, Title } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Poll = () => {
    useDaoExistCheck()
    useDaoLoad()
    const router = useRouter()
    const { daoId, projectId } = router.query
    const { candidateToPoll } =
        usePoll({ daoId: daoId as string, projectId: projectId as string });

    const _candidateToPoll = async (
        contributionText: string,
        evidences: string[],
        roles: string[]
    ) => {
        if (!candidateToPoll) return;
        await candidateToPoll(contributionText, evidences, roles);
    };


    return (
        <Container>
            <ContributionCard candidateToPoll={_candidateToPoll} />
        </Container>
    );
};
export default Poll;