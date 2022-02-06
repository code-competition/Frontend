import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { WebSocketEvents } from "../../../utils/improvedWebSocket";
import { EventListener } from "../../../utils/improvedWebSocket";
import PlayerPlay from "../../../assets/icons/player-play.svg";
import { IconKind } from "../../../components/IconButton";
import Button, { ButtonSize } from "../../../components/Button";
import AnimatedIcon, {
  AnimatedIconKind,
  AnimatedIconSize,
} from "../../../components/AnimatedIcons";
import { GameStateContext } from "../../../contexts/GameState";

interface TestCodeProps {
  listener: EventListener<WebSocketEvents.Message>;
  listenerId: string;
  code: string;
  taskIndex: number;
  isTestFinished: boolean;
  setIsTestFinished: Dispatch<SetStateAction<boolean>>;
}

function TestCode({
  listener,
  listenerId,
  code,
  taskIndex,
  setIsTestFinished,
  isTestFinished,
}: TestCodeProps) {
  const { connection } = useContext(GameStateContext);

  const [icon, setIcon] = useState<ReactNode | string>(PlayerPlay);
  const [iconKind, setIconKind] = useState<IconKind>(IconKind.Image);

  const handleClick = () => {
    if (connection !== null && isTestFinished) {
      connection.send(
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
      connection !== null &&
      !connection
        .getEventListeners(WebSocketEvents.Message)
        .includes(listenerId)
    ) {
      connection.addEventListener(
        WebSocketEvents.Message,
        listenerId,
        listener
      );
    }
  }, [connection]);

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
