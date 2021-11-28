import { useState } from "react";
import "../stylesheets/GrassConcept.css";

enum ClickAction {
  Connect,
  SendMessage,
}

function GrassConcept() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSocketOpen, setIsSocketOpen] = useState<boolean>(false);

  const createSocket = (address: string): WebSocket => {
    let ws = new WebSocket(address);

    ws.onopen = () => {
      setIsSocketOpen(true);
      console.log(`Socket is open at: ${address}`);
    };

    return ws;
  };

  const handleClick = (action: ClickAction) => {
    switch (action) {
      case ClickAction.Connect:
        setSocket(createSocket("ws://localhost:5000"));
        break;

      case ClickAction.SendMessage:
        if (socket != null) {
          socket.send(message);
        }
        break;
    }
  };

  return (
    <div className="grass-concept">
      {isSocketOpen ? (
        <div>
          <input
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
          />
          <button onClick={() => handleClick(ClickAction.SendMessage)}>
            Send Message
          </button>
        </div>
      ) : (
        <button onClick={() => handleClick(ClickAction.Connect)}>
          Connect
        </button>
      )}
    </div>
  );
}

export default GrassConcept;
