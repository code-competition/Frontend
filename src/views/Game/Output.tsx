import { ReactNode, useEffect, useState } from "react";
import LogMessage from "../../components/LogMessage";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import { v4 as uuidv4 } from "uuid";

export enum LogType {
  Error = "error",
  Message = "message",
  Result = "result",
}

export interface LogData {
  type: LogType;
  data: ReactNode;
}

interface OutputProps {
  logHistory: LogData[];
}

function Output({ logHistory }: OutputProps) {
  let [outputHistory, setOutputHistory] = useState<ReactNode[]>([]);

  useEffect(() => {
    setOutputHistory(
      logHistory.map((log: LogData) => (
        <LogMessage key={uuidv4()} type={log.type} data={log.data} />
      ))
    );
  }, [logHistory]);

  return (
    <Panel
      className="ph-l-game__output"
      kind={PanelKind.Basic}
      panelSize={PanelSize.Default}
      headerContent={
        <PanelHeader header="Output" panelSize={PanelSize.Default} />
      }
    >
      <div className="ph-p-game__output-history">{outputHistory}</div>
    </Panel>
  );
}

export default Output;
