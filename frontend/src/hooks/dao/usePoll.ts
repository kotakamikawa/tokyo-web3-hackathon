import { Candidate } from "@/domains/Candidate";
import { DAOHistory, Poll } from "@/types";
import { AssessmentStructOutput, DAOHistoryItemStructOutput } from "@/types/DAOHistory";
import { DetailPollItemStructOutput } from "@/types/Poll";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../../abi/Poll.sol/Poll.json";
import useMetaMask, {
    getContract,
    getContractWithSigner,
} from "../web3/useMetaMask";

export default () => {

    const [activePollId, setActivePollId] = useState<number | undefined>(undefined);
    const [pollDetail, setPollDetail] = useState<DetailPollItemStructOutput | undefined>(undefined);
    const { address } = useMetaMask();
    //TODO: ブロックチェーンから値を取る
    const [contributorReward, setContributorReward] = useState<number>(7000);
    const [voterReward, setVoterReward] = useState<number>(3000);
    const [isEligibleToVote, setIsEligibleToVote] = useState(true);

    //TODO: DAOごとにPollのアドレスが違うので動的に取得する
    const contractAddress = process.env
        .NEXT_PUBLIC_POLL_CONTRACT_ADDRESS as string;
    const contract = getContract(contractAddress, artifact.abi) as Poll;
    const contractWithSigner = getContractWithSigner(
        contractAddress,
        artifact.abi
    ) as Poll;

    useEffect(() => {
        contract.functions.currentMexPollId().then((res) => {
            setActivePollId(res[0].toNumber());
        });
    }, []);

    useEffect(() => {
        if (activePollId !== undefined) {
            load();
        }
    }, [activePollId]);


    const _loadPollDetail = async () => {
        if (activePollId) {
            const res = await contract.functions.getPollDetail(activePollId);
            setPollDetail(res[0]);
        } else {
            throw new Error("activePollId is undefined");

        }
    }

    const load = async () => {
        _loadPollDetail()
    }

    const _pollDetail = pollDetail ? {
        pollId: pollDetail.pollId.toNumber(),
        contributions: pollDetail.contributions.map((c) => {
            return {
                contributor: c.contributor,
                contributionText: c.contributionText,
                evidences: c.evidences,
                roles: c.roles,
            };
        }) as Candidate[],
        voters: pollDetail.voters,
        alreadyVoted: pollDetail.voters.includes(address),
        alreadyContributed: pollDetail.contributions.map((c) => c.contributor).includes(address),
        startTimeStamp: new Date(Number(pollDetail.startTimeStamp) * 1000),
        endTimeStamp: new Date(Number(pollDetail.endTimeStamp) * 1000),
        perspectives: pollDetail.perspectives
    } : undefined

    return {
        pollDetail: _pollDetail,
        load,
        contributorReward,
        voterReward,
        vote: contractWithSigner.functions.vote,
        settleCurrentPollAndCreateNewPoll: contractWithSigner.functions.settleCurrentPollAndCreateNewPoll,
        candidateToPoll: contractWithSigner.functions.candidateToCurrentPoll,
    };
};