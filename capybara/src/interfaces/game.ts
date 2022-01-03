export interface Task {
  taskCount: number;
  currentTask: number;
  taskId: string;
  question: string;
  testCases: TestCase[];
}

export interface TestCase {
  expected: string /* boolean */;
  stdin: string;
}
