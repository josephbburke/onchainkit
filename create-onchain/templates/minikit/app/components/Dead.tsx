import { useAccount } from "wagmi";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getTopScores, addScore, MAX_SCORES } from "@/lib/scores-client";
import { useMiniKit, useNotification } from "@coinbase/onchainkit";
import { Transaction, TransactionButton, TransactionResponse, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";
import { encodeAbiParameters, TransactionReceipt } from "viem";

const SCHEMA_UID = "0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe";
const EAS_CONTRACT = "0x4200000000000000000000000000000000000021";
const easABI = [
  {
    name: "attest",
    type: "function" as const,
    stateMutability: "payable" as const,
    inputs: [
      {
        name: "request",
        type: "tuple",
        components: [
          { name: "schema", type: "bytes32" },
          { name: "data", type: "tuple", 
            components: [
              { name: "recipient", type: "address" },
              { name: "expirationTime", type: "uint64" },
              { name: "revocable", type: "bool" },
              { name: "refUID", type: "bytes32" },
              { name: "data", type: "bytes" },
              { name: "value", type: "uint256" }
            ]
          }
        ]
      }
    ],
    outputs: [{ name: "", type: "bytes32" }]
  }
];

const checkIsHighScore = async (currentScore: number) => {
  const scores = await getTopScores();

  // if less than MAX_SCORES scores or current score is higher than lowest score
  if ((scores?.length ?? 0) < MAX_SCORES || currentScore > (scores?.[scores.length - 1]?.score ?? 0)) {
    return true;
  }
  return false;
};

type DeadProps = {
  score: number;
  level: number;
  onGoToIntro: () => void;
  isWin: boolean;
};

export function Dead({score, level, onGoToIntro, isWin}: DeadProps) {
  const { context } = useMiniKit();
  const sendNotification = useNotification();

  const [isHighScore, setIsHighScore] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const checkHighScore = async () => {
      const isHighScore = await checkIsHighScore(score);
      setIsHighScore(isHighScore);
    }
    checkHighScore();
  }, [score]);

  const handleAttestationSuccess = async (response: TransactionResponse) => {
    if (!address) {
      return null;
    }

    await addScore({
      address,
      score,
      attestationUid: response.transactionReceipts[0].logs[0].data,
      transactionHash: response.transactionReceipts[0].transactionHash
    });

    if (context?.client.notificationDetails) {
      await sendNotification({
        title: 'Congratulations!',
        body: `You scored a new high score of ${score} on minikit snake!`,
      })
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
      {isWin ? (
        <h1 className="text-2xl mb-4">You Won!</h1>
      ) : (
        <h1 className="text-2xl mb-4">Game Over</h1>
      )}
      <p className="text-lg mb-4">Level: {level}</p>
      <p className="text-lg mb-4">Score: {score}</p>
      <p className="text-lg mb-4">Play again?</p>
      {isHighScore && (
        <>
          <p className="text-lg mb-4">High Score!</p>
          <Transaction
            calls={[{
              address: EAS_CONTRACT,
              abi: easABI,
              functionName: 'attest',
              args: [{
                schema: SCHEMA_UID,
                data: {
                  recipient: '0x0000000000000000000000000000000000000000',
                  expirationTime: 0,
                  revocable: false,
                  refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  data: encodeAbiParameters(
                    [{ type: 'string' }],
                    [`${address} scored ${score} on minikit snake`]
                  ),
                  value: 0
                }
              }]
            }]}
            onSuccess={handleAttestationSuccess}
            onError={(error) => console.error("Attestation failed:", error)}
          >
            <TransactionButton 
              text="Sign Attestation to Save your High Score" 
              className="mx-auto w-[60%]"
              successOverride={{
                text: "View High Scores",
                onClick: onGoToIntro
              }}
            />
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        </>
      )}
    </div>
  )
}