import { LogData } from "../interfaces/game";

interface LogMessageProps extends LogData {}

function LogMessage({ type, data }: LogMessageProps) {
  return (
    <div className={`ph-c-log-message ph-c-log-message--${type}`}>{data}</div>
  );
}

export default LogMessage;
