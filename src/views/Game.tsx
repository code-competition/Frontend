import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import Panel, { PanelKind, PanelSize } from "../components/Panel";
import PanelHeader from "../components/Panel/PanelHeader";
import { PublicTestProgress } from "../interfaces/game";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import TestCode from "./Game/TestCode";

interface GameProps {
  ws: ImprovedWebSocket | null;
  taskCount: number;
}

interface TestCase {
  id: number;
  stdin: string;
  expected: string;
}

interface TestOutput {
  id: number;
  got: string;
}

function Game({ ws, taskCount }: GameProps) {
  let [taskIndex /*, setTaskIndex */] = useState<number>(0);

  let [code, setCode] = useState<string>("");
  let [error, setError] = useState<string>("");

  let [testCases, setTestCases] = useState<TestCase[]>([]);
  let [testOutputs, setTestOutputs] = useState<TestOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

  const testResultListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      setTestOutputs(
        data.d.public_test_progress.map((test: PublicTestProgress) => ({
          id: test.test_index,
          got: test.stdout,
        }))
      );

      setError(data.d.stderr);
    }
  };

  const getTaskListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Task") {
      let task = data.d.task;
      setQuestion(task.question);
      setTestCases(
        task.public_test_cases.sort((testCase: TestCase) => testCase.id)
      );
    }
  };

  useEffect(() => {
    if (ws !== null) {
      if (!ws.getEventListeners(WebSocketEvents.Message).includes("getTask")) {
        ws.addEventListener(
          WebSocketEvents.Message,
          "getTask",
          getTaskListener
        );
      }

      ws.send(
        JSON.stringify({
          d: { d: { task_index: taskIndex }, op: "Task" },
          op: "Request",
        })
      );
    }
  }, [taskIndex, ws]);

  return (
    <div className="ph-l-game">
      <Panel
        className="ph-l-game__question"
        kind={PanelKind.Basic}
        panelSize={PanelSize.Default}
        headerContent={
          <PanelHeader header="Questions" panelSize={PanelSize.Default} />
        }
      >
        <p>{question}</p>
      </Panel>
      <Panel
        className="ph-l-game__editor"
        panelSize={PanelSize.Default}
        headerContent={
          <TestCode
            ws={ws}
            listener={testResultListener}
            listenerId={"testResult"}
            code={code}
            taskIndex={taskIndex}
          />
        }
      >
        <CodeEditor
          onChange={(value, viewUpdate) => {
            setCode(value);
          }}
        />
      </Panel>

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
            <div key={testCase.id}>
              <p>stdin: {testCase.stdin}</p>
              <p>Expected: {testCase.expected}</p>
              <p>
                Got:
                {
                  testOutputs.filter(
                    (output: TestOutput) => output.id === testCase.id
                  )[0]?.got
                }
              </p>
            </div>
          );
        })}
      </Panel>

      <Panel
        className="ph-l-game__console"
        kind={PanelKind.Basic}
        panelSize={PanelSize.Default}
        headerContent={
          <PanelHeader header="Console" panelSize={PanelSize.Default} />
        }
      >
        <p>{error}</p>
      </Panel>
    </div>
  );
}

export default Game;
