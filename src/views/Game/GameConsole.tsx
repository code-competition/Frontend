import { ReactNode, useEffect, useState } from "react";
import LogMessage from "../../components/LogMessage";
import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";

export enum LogType {
  Error = "error",
  Message = "message",
  Result = "result",
}

export interface LogData {
  type: LogType;
  data: ReactNode;
}

interface GameConsoleProps {
  logHistory: LogData[];
}

function GameConsole({ logHistory }: GameConsoleProps) {
  let [consoleHistory, setConsoleHistory] = useState<ReactNode[]>([]);

  useEffect(() => {
    setConsoleHistory(
      logHistory.map((log: LogData) => (
        <LogMessage type={log.type} data={log.data} />
      ))
    );
  }, [logHistory]);

  return (
    <Panel
      className="ph-l-game__console"
      kind={PanelKind.BasicReverse}
      panelSize={PanelSize.Default}
      headerContent={
        <PanelHeader header="Console" panelSize={PanelSize.Default} />
      }
    >
      {consoleHistory}
    </Panel>
  );
}

export default GameConsole;
