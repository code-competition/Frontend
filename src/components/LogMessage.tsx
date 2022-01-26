import { LogData } from "../views/Game/Output";

function LogMessage({ type, data }: LogData) {
  return (
    <div className={`ph-c-log-message ph-c-log-message--${type}`}>{data}</div>
  );
}

export default LogMessage;
