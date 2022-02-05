import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
//Somin was here (låt stå)
import { GameState } from "../App";

export const GameStateContext = createContext<GameStateContextProviderValue>({
  gameState: {
    startTime: 0,
    endTimes: [],
  },
  setGameState: (): void => {
    console.log("Context is not setup properly");
  },
});

interface GameStateContextProviderValue {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export const GameStateContextProvider: FC = ({ children }) => {
  let [gameState, setGameState] = useState<GameState>({
    startTime: 0,
    endTimes: [],
  });

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
