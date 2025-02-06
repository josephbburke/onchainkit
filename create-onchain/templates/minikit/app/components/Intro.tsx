import MiniKitLogo from "../svg/minikit";
import { HighScores } from "./HighScores";

export function Intro() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 pb-6">
      <MiniKitLogo width="100%" height="100%" />
      <HighScores />
    </div>
  )
}
