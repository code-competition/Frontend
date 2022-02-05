import { ReactNode } from "react";
import { LogType } from "../views/Game/Output";

export interface Task {
  taskIndex: number;
  taskId: string;
  question: string;
  testCases: TestCase[];
}

export interface TestCase {
  expected: string;
  stdin: string;
}

export interface PublicTestProgress {
  expected: string;
  stdout: string;
  succeeded: boolean;
  test_index: number;
}

export interface Player {
  isHost: boolean;
}

export interface User {
  id: string;
  name: string;
}

export interface UserEndTime {
  id: string;
  finished: number;
}

export interface GameState {
  startTime: number;
  endTimes: UserEndTime[];
}

export interface PublicTestCase {
  id: number;
  stdin: string;
  expected: string;
}

export interface TestOutput {
  id: number;
  got: string;
  isDone: boolean;
  hasFailed: boolean;
}

export interface LogData {
  type: LogType;
  data: ReactNode;
}
