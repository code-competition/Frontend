import { Dispatch, ReactNode, SetStateAction } from "react";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import TestCase from "../../components/TestCase";
import { TestCaseData, TestOutput } from "../Game";
import { LogData } from "./GameConsole";

interface TestCasesProps {
  testCases: TestCaseData[];
  testOutputs: TestOutput[];
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function TestCases({ testCases, testOutputs, setLogHistory }: TestCasesProps) {
  return (
    <Panel
      className="ph-l-game__testcases"
      kind={PanelKind.Basic}
      panelSize={PanelSize.Default}
      headerContent={
        <PanelHeader header="Test cases" panelSize={PanelSize.Default} />
      }
    >
      {testCases.map((testCase) => {
        return (
          <TestCase
            name={testCase.id.toString()}
            key={testCase.id}
            stdin={testCase.stdin}
            expected={testCase.expected}
            got={
              testOutputs.filter(
                (output: TestOutput) => output.id === testCase.id
              )[0]?.got
            }
            setLogHistory={setLogHistory}
          />
        );
      })}
    </Panel>
  );
}

export default TestCases;
