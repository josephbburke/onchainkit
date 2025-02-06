import { HighScores } from "./HighScores";

export function Paused() {
  return (
    <div className="flex flex-col items-center justify-center bg-white/80 z-20">
      <h1 className="text-2xl mb-4 pt-20">Paused</h1>
      <HighScores />
    </div>
  )
}