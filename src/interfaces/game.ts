import { ReactNode } from "react";
import { LogType } from "../views/Game/Output";

/* GAME STATE */

export interface TaskData {
  currentTask: number;
  taskCount: number;
  tasks: Task[];
}

export interface UserFinished {
  user: User;
  time: number;
}

/* GAME OBJECTS */

export interface User {
  id: string;
  name: string;
  isHost: boolean;
}

export interface Task {
  index: number;
  id: string;
  question: string;
  testCases: TestCase[];
}

export interface TestCase {
  id: number;
  stdin: string;
  expected: string;
}

export interface TestOutput {
  id: number;
  stdin: string;
  expected: string;
  got: string | null;
  isDone: boolean;
  hasFailed: boolean;
}

export interface LogData {
  type: LogType;
  data: ReactNode;
}

/* SERVER RESPONSE */

export interface PublicTestProgress {
  expected: string;
  stdout: string;
  succeeded: boolean;
  test_index: number;
}
