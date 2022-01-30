import { LogData } from "../views/Game/Output";

interface LogMessageProps extends LogData {}

function LogMessage({ type, data }: LogMessageProps) {
  return (
    <div className={`ph-c-log-message ph-c-log-message--${type}`}>{data}</div>
  );
}

export default LogMessage;
