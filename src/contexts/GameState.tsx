import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { TaskData, User, UserFinished } from "../interfaces/game";
import ImprovedWebSocket from "../utils/improvedWebSocket";
//Somin was here (låt stå)

let missingProvider = (): void => {
  console.log("Context is not setup properly, please add a provider");
};

export const GameStateContext = createContext<GameStateContextProviderValue>({
  isRunning: false,
  connection: null,
  you: null,
  users: [],
  start: 0,
  finishes: [],
  data: {
    currentTask: 0,
    taskCount: 0,
    tasks: [],
  },
  setIsRunning: missingProvider,
  setConnection: missingProvider,
  setYou: missingProvider,
  setUsers: missingProvider,
  setStart: missingProvider,
  setFinishes: missingProvider,
  resetGameState: missingProvider,
  setData: missingProvider,
});

interface GameStateContextProviderValue {
  isRunning: boolean;
  connection: ImprovedWebSocket | null;
  you: User | null;
  users: User[];
  start: number;
  finishes: UserFinished[];
  data: TaskData;
  resetGameState(): void;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  setConnection: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  setYou: Dispatch<SetStateAction<User | null>>;
  setUsers: Dispatch<SetStateAction<User[]>>;
  setStart: Dispatch<SetStateAction<number>>;
  setFinishes: Dispatch<SetStateAction<UserFinished[]>>;
  setData: Dispatch<SetStateAction<TaskData>>;
}

export const GameStateContextProvider: FC = ({ children }) => {
  let [isRunning, setIsRunning] = useState<boolean>(false);
  let [connection, setConnection] = useState<ImprovedWebSocket | null>(null);
  let [you, setYou] = useState<User | null>(null);
  let [users, setUsers] = useState<User[]>([]);
  let [start, setStart] = useState<number>(0);
  let [finishes, setFinishes] = useState<UserFinished[]>([]);
  let [data, setData] = useState<TaskData>({
    currentTask: 0,
    taskCount: 0,
    tasks: [],
  });

  function resetGameState() {
    setIsRunning(false);
    setConnection(null);
    setYou(null);
    setUsers([]);
    setStart(0);
    setFinishes([]);
    setData({
      currentTask: 0,
      taskCount: 0,
      tasks: [],
    });
  }

  return (
    <GameStateContext.Provider
      value={{
        isRunning,
        connection,
        you,
        users,
        start,
        finishes,
        data,
        resetGameState,
        setConnection,
        setYou,
        setIsRunning,
        setUsers,
        setStart,
        setFinishes,
        setData,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
