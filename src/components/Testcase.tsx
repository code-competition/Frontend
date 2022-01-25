import { ReactNode } from "react";
import ChevronDown from "../assets/icons/chevron-down.svg";

interface TestcaseProps {
  name: string;
  stdin: string;
  expected: string;
  got: string;
  sendToConsole(item: ReactNode): void;
}

function Testcase({
  name,
  stdin,
  expected,
  got,
  sendToConsole,
}: TestcaseProps) {
  const handleClick = () => {
    let d = (
      <div>
        {stdin} {expected} {got}
      </div>
    );

    sendToConsole(d);
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

export default Testcase;
