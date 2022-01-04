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
  text_index: number;
}
