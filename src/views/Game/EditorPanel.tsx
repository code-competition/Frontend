import { Dispatch, SetStateAction, useState } from "react";
import CodeEditor from "../../components/CodeEditor";
import Panel, { PanelSize } from "../../components/Panel";
import { PublicTestProgress } from "../../interfaces/game";
import ImprovedWebSocket from "../../utils/improvedWebSocket";
import { TestOutput } from "../Game";
import TestCode from "./TestCode";

interface EditorPanelProps {
  ws: ImprovedWebSocket | null;
  taskIndex: number;
  setTestOutputs: Dispatch<SetStateAction<TestOutput[]>>;
  setError: Dispatch<SetStateAction<string>>;
}

function EditorPanel({
  ws,
  taskIndex,
  setTestOutputs,
  setError,
}: EditorPanelProps) {
  let [code, setCode] = useState<string>("");

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
  return (
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
  );
}

export default EditorPanel;
