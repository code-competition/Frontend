import { Dispatch, SetStateAction, useState } from "react";
import CodeEditor from "../../components/CodeEditor";
import Panel, { PanelSize } from "../../components/Panel";
import { LogData, PublicTestProgress, TestOutput } from "../../interfaces/game";
import ImprovedWebSocket from "../../utils/improvedWebSocket";
import { LogType } from "./Output";
import TestCode from "./GameEditor/TestCode";
import { v4 as uuidv4 } from "uuid";

interface GameEditorProps {
  taskIndex: number;
  setTestOutputs: Dispatch<SetStateAction<TestOutput[]>>;
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function GameEditor({
  taskIndex,
  setTestOutputs,
  setLogHistory,
}: GameEditorProps) {
  let [code, setCode] = useState<string>("");
  let [isTestFinished, setIsTestFinished] = useState<boolean>(true);

  const testResultListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      setIsTestFinished(false);
      setTestOutputs(
        data.d.public_test_progress.map((test: PublicTestProgress) => ({
          id: test.test_index,
          got: test.stdout,
          isDone: true,
          hasFailed: !test.succeeded,
        }))
      );

      if (data.d.stderr !== "") {
        setLogHistory((prev) => [
          ...prev,
          {
            type: LogType.Error,
            data: (
              <p key={uuidv4()} className="ph-b-code ph-b-code--default">
                {data.d.stderr}
              </p>
            ),
          },
        ]);
      }
    }
  };

  return (
    <Panel
      className="ph-l-game__editor"
      panelSize={PanelSize.Default}
      headerContent={
        <div className="ph-p-game__editor-header">
          <TestCode
            listener={testResultListener}
            listenerId={"testResult"}
            code={code}
            taskIndex={taskIndex}
            isTestFinished={isTestFinished}
            setIsTestFinished={setIsTestFinished}
          />
        </div>
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
