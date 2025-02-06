
type AwaitingNextLevelProps = {
  score: number;
  level: number;
};

export function AwaitingNextLevel({score, level}: AwaitingNextLevelProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
      <h1 className="text-2xl mb-4">Level Complete!</h1>
      <p className="text-lg mb-4">Score: {score}</p>
      <p className="text-lg mb-4">Level: {level}</p>
    </div>
  )
}