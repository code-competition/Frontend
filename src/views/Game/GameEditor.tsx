import { Dispatch, SetStateAction, useState } from "react";
import CodeEditor from "../../components/CodeEditor";
import Panel, { PanelSize } from "../../components/Panel";
import { PublicTestProgress } from "../../interfaces/game";
import ImprovedWebSocket from "../../utils/improvedWebSocket";
import { TestOutput } from "../Game";
import { LogData, LogType } from "./GameConsole";
import TestCode from "./GameEditor/TestCode";

interface GameEditorProps {
  ws: ImprovedWebSocket | null;
  taskIndex: number;
  setTestOutputs: Dispatch<SetStateAction<TestOutput[]>>;
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function GameEditor({
  ws,
  taskIndex,
  setTestOutputs,
  setLogHistory,
}: GameEditorProps) {
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

      setLogHistory((prev) => [
        ...prev,
        {
          type: LogType.Error,
          data: <p className="ph-b-code ph-b-code--default">{data.d.stderr}</p>,
        },
      ]);
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

export default GameEditor;
