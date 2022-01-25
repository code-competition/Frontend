import { Dispatch, SetStateAction } from "react";
import { LogData, LogType } from "../views/Game/GameConsole";

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
    let d = (
      <div>
        {stdin} {expected} {got}
      </div>
    );

    setLogHistory((prev) => [
      ...prev,
      {
        type: LogType.Result,
        data: d,
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
