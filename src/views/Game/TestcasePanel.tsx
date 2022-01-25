import { ReactNode } from "react";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import Testcase from "../../components/Testcase";
import { TestCase, TestOutput } from "../Game";

interface TestcaseProps {
  testCases: TestCase[];
  testOutputs: TestOutput[];
}

function TestcasePanel({ testCases, testOutputs }: TestcaseProps) {
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
          <Testcase
            name={testCase.id.toString()}
            key={testCase.id}
            stdin={testCase.stdin}
            expected={testCase.expected}
            got={
              testOutputs.filter(
                (output: TestOutput) => output.id === testCase.id
              )[0]?.got
            }
            sendToConsole={(r: ReactNode) => {}}
          />
        );
      })}
    </Panel>
  );
}

export default TestcasePanel;
