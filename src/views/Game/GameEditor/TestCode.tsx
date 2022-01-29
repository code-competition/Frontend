import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { WebSocketEvents } from "../../../utils/improvedWebSocket";
import { EventListener } from "../../../utils/improvedWebSocket";
import ImprovedWebSocket from "../../../utils/improvedWebSocket";
import PlayerPlay from "../../../assets/icons/player-play.svg";
import IconButton, { IconKind } from "../../../components/IconButton";
import Button, { ButtonSize } from "../../../components/Button";
import AnimatedIcon, {
  AnimatedIconKind,
  AnimatedIconSize,
} from "../../../components/AnimatedIcons";

interface TestCodeProps {
  ws: ImprovedWebSocket | null;
  listener: EventListener<WebSocketEvents.Message>;
  listenerId: string;
  code: string;
  taskIndex: number;
  isTestFinished: boolean;
  setIsTestFinished: Dispatch<SetStateAction<boolean>>;
}

function TestCode({
  ws,
  listener,
  listenerId,
  code,
  taskIndex,
  setIsTestFinished,
  isTestFinished,
}: TestCodeProps) {
  const [icon, setIcon] = useState<ReactNode | string>(PlayerPlay);
  const [iconKind, setIconKind] = useState<IconKind>(IconKind.Image);

  const handleClick = () => {
    if (ws !== null && isTestFinished) {
      ws.send(
        JSON.stringify({
          d: {
            d: {
              code: code,
              task_index: taskIndex,
            },
            op: "Compile",
          },
          op: "Request",
        })
      );
    }

    setIcon(
      <AnimatedIcon
        kind={AnimatedIconKind.Spinner}
        size={AnimatedIconSize.Small}
      />
    );

    setIconKind(IconKind.ReactNode);
  };

  useEffect(() => {
    if (!isTestFinished) {
      setIcon(PlayerPlay);
      setIconKind(IconKind.Image);
      setIsTestFinished(true);
    }
  }, [isTestFinished]);

  useEffect(() => {
    if (
      ws !== null &&
      !ws.getEventListeners(WebSocketEvents.Message).includes(listenerId)
    ) {
      ws.addEventListener(WebSocketEvents.Message, listenerId, listener);
    }
  }, [ws]);

  return (
    <Button
      icon={icon}
      iconKind={iconKind}
      onClick={handleClick}
      btnsize={ButtonSize.Small}
    >
      Run
    </Button>
  );
}
export default TestCode;
