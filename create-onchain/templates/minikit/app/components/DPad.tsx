import { GameState, MoveState } from "./Sammy";

type DPadProps = {
  gameState: number;
  onDirectionChange: (direction: number) => void;
  handleMobileGameState: () => void;
};

export const DPad = ({ gameState, onDirectionChange, handleMobileGameState }: DPadProps) => {
  return (
    <div className="flex">
      <div className="grid grid-cols-3 gap-1">
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-t-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.UP)}
        />
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-l-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.LEFT)}
        />
        <button 
          className="h-12 w-12 bg-black/20 hover:bg-black/30 active:bg-black/40"
          onClick={handleMobileGameState}
        >
          {gameState === GameState.RUNNING ? '⏸️' : '▶️'}
        </button>
        <button 
          className="h-12 w-12 bg-black/20 rounded-r-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.RIGHT)}
        />
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-b-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.DOWN)}
        />
        <div className="h-12 w-12" />
      </div>
    </div>
  );
};
