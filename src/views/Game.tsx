import { useContext, useEffect, useState } from "react";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import Question from "./Game/Question";
import GameEditor from "./Game/GameEditor";
import TestCases from "./Game/TestCases";
import Output from "./Game/Output";
import GameHeader from "./Game/GameHeader";
import { LogData, TestCase, TestOutput } from "../interfaces/game";
import { GameStateContext } from "../contexts/GameState";

function Game() {
  const { connection } = useContext(GameStateContext);
  let [logHistory, setLogHistory] = useState<LogData[]>([]);

  let [taskIndex /*, setTaskIndex */] = useState<number>(0);
  let [testCases, setTestCases] = useState<TestCase[]>([]);
  let [testOutputs, setTestOutputs] = useState<TestOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

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
    if (connection !== null) {
      if (
        !connection
          .getEventListeners(WebSocketEvents.Message)
          .includes("getTask")
      ) {
        connection.addEventListener(
          WebSocketEvents.Message,
          "getTask",
          getTaskListener
        );
      }

      connection.send(
        JSON.stringify({
          d: { d: { task_index: taskIndex }, op: "Task" },
          op: "Request",
        })
      );
    }
  }, [taskIndex, connection]);

  return (
    <div className="ph-l-game">
      <GameHeader />

      <div className="ph-l-game__content">
        <Question question={question} />

        <GameEditor
          taskIndex={taskIndex}
          setTestOutputs={setTestOutputs}
          setLogHistory={setLogHistory}
        />
        <TestCases
          publicTestCases={testCases}
          testOutputs={testOutputs}
          setLogHistory={setLogHistory}
        />
        <Output logHistory={logHistory} />
      </div>
    </div>
  );
}

export default Game;
