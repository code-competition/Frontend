import { createContext, useContext } from "react";
//Somin was here (låt stå)
import { GameState } from "../App";

const GameStateContext = createContext<GameState>({});

export function ExampleContextProvider(props) {
  return (
    <GameStateContext.Provider value={{ startTime: 0, endTimes: [] }}>
      {props.children}
    </GameStateContext.Provider>
  );
}

export const useExampleContext = () => useContext<GameState>(GameStateContext);
