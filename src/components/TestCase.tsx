import { Dispatch, SetStateAction } from "react";
import { LogData, LogType } from "../views/Game/Output";

interface TestCaseProps {
  name: string;
  stdin: string;
  expected: string;
  got: string | null;
  isDone: boolean;
  hasFailed: boolean;
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function TestCase({
  name,
  stdin,
  expected,
  got,
  isDone,
  hasFailed,
  setLogHistory,
}: TestCaseProps) {
  const handleClick = () => {
    let logOutput = (
      <div>
        <ul className="ph-c-log-message__list">
          <li className="ph-b-code">
            <span className="ph-b-code ph-b-code--bold">Name</span> {name}
          </li>
          <li className="ph-b-code">
            <span className="ph-b-code ph-b-code--bold">Input</span> {stdin}
          </li>
          <li className="ph-b-code">
            <span className="ph-b-code ph-b-code--bold">Expected</span>{" "}
            {expected}
          </li>
          <li className="ph-b-code">
            <span className="ph-b-code ph-b-code--bold">Got</span> {got}
          </li>
          <li className="ph-b-code">
            <span className="ph-b-code ph-b-code--bold">Status</span>{" "}
            {hasFailed ? "Fail" : "Success"}
          </li>
        </ul>
      </div>
    );

    setLogHistory((prev) => [
      ...prev,
      {
        type: LogType.Result,
        data: logOutput,
      },
    ]);
  };

  return (
    <div
      className={`ph-c-test-case ${
        isDone
          ? hasFailed
            ? "ph-c-test-case--error"
            : "ph-c-test-case--success"
          : ""
      }`}
    >
      <h3 className="ph-b-header ph-b-header--small">{name}</h3>
      {isDone ? (
        <button
          onClick={handleClick}
          className="ph-c-btn ph-c-btn--small ph-c-btn--tertiary"
        >
          Show result
        </button>
      ) : null}
    </div>
  );
}

export default TestCase;
