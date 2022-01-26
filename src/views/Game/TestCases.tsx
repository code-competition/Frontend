import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import TestCase from "../../components/TestCase";
import { PublicTestCase, TestOutput } from "../Game";
import { LogData } from "./Output";

export interface TestCaseData {
  id: number;
  stdin: string;
  expected: string;
  got: string | null;
  isDone: boolean;
  hasFailed: boolean;
}

interface TestCasesProps {
  publicTestCases: PublicTestCase[];
  testOutputs: TestOutput[];
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function TestCases({
  publicTestCases,
  testOutputs,
  setLogHistory,
}: TestCasesProps) {
  let [testCases, setTestCases] = useState<TestCaseData[]>([]);
  let [testCaseNodes, setTestCaseNodes] = useState<ReactNode[]>([]);

  useEffect(() => {
    setTestCases(
      publicTestCases.map((testCase: PublicTestCase) => {
        return {
          id: testCase.id,
          stdin: testCase.stdin,
          expected: testCase.expected,
          got: null,
          isDone: false,
          hasFailed: false,
        };
      })
    );
  }, [publicTestCases]);

  useEffect(() => {
    setTestCases((prev) =>
      prev.map((testCase: TestCaseData) => {
        let currentTestOutput = testOutputs.filter(
          (output: TestOutput) => output.id === testCase.id
        )[0];
        return {
          id: testCase.id,
          stdin: testCase.stdin,
          expected: testCase.expected,
          got: currentTestOutput?.got,
          isDone: currentTestOutput?.isDone,
          hasFailed: currentTestOutput?.hasFailed,
        };
      })
    );
  }, [testOutputs]);

  useEffect(() => {
    setTestCaseNodes(
      testCases.map((testCase: TestCaseData) => {
        return (
          <TestCase
            key={testCase.id}
            name={testCase.id.toString()}
            stdin={testCase.stdin}
            expected={testCase.expected}
            got={testCase.got}
            isDone={testCase.isDone}
            hasFailed={testCase.hasFailed}
            setLogHistory={setLogHistory}
          />
        );
      })
    );
  }, [testCases]);

  return (
    <Panel
      className="ph-l-game__test-cases"
      kind={PanelKind.Basic}
      panelSize={PanelSize.Default}
      headerContent={
        <PanelHeader header="Test cases" panelSize={PanelSize.Default} />
      }
    >
      {testCaseNodes}
    </Panel>
  );
}

export default TestCases;
