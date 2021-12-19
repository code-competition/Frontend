import { useParams } from "react-router-dom";
import "../stylesheets/Lobby.css";

function Lobby() {
  const gameId = useParams().id;

  return (
    <section>
      <p style={{ color: "white" }}>{gameId}</p>
    </section>
  );
}
export default Lobby;
