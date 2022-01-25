import { ReactNode, useState } from "react";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";

export enum LogType {
  Error = "error",
  Message = "message",
  TestResult = "testResult",
}

export interface ConsoleLog {
  type: LogType;
  data: ReactNode;
}

interface ConsolePanelProps {
  error: string;
}

function ConsolePanel({ error }: ConsolePanelProps) {
  let [log, setLog] = useState<ConsoleLog[]>([]);

  return (
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
  );
}

export default ConsolePanel;
