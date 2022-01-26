import { Dispatch, SetStateAction } from "react";
import { LogData, LogType } from "../views/Game/Output";

interface TestCaseProps {
  name: string;
  stdin: string;
  expected: string;
  got: string;
  setLogHistory: Dispatch<SetStateAction<LogData[]>>;
}

function TestCase({
  name,
  stdin,
  expected,
  got,
  setLogHistory,
}: TestCaseProps) {
  const handleClick = () => {
    let logOutput = (
      <ul className="ph-c-log-message__list">
        <li className="ph-b-code">
          <span className="ph-b-code ph-b-code--bold">Tested Input</span>{" "}
          {stdin}
        </li>
        <li className="ph-b-code">
          <span className="ph-b-code ph-b-code--bold">Expected</span> {expected}
        </li>
        <li className="ph-b-code">
          <span className="ph-b-code ph-b-code--bold">Got</span> {got}
        </li>
      </ul>
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
    <div className="ph-c-testcase">
      <h3 className="ph-b-header ph-b-header--small">{name}</h3>
      <button
        onClick={handleClick}
        className="ph-c-btn ph-c-btn--small ph-c-btn--tertiary"
      >
        Show results
      </button>
    </div>
  );
}

export default TestCase;
