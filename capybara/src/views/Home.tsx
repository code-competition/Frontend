import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Home.css";

interface CreateGameResponse {
  game_id: String;
}

function Home() {
  let navigate = useNavigate();
  let [gameId, setGameId] = useState<String>("");

  const handleClick = () => {
    fetch(`http://${process.env.REACT_APP_DOMAIN}/create_game`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8045",
      },
      credentials: "include",
    })
      .then((data) => data.json())
      .then((newGame: CreateGameResponse) => setGameId(newGame.game_id))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (gameId !== "") {
      navigate(`/lobby/${gameId}`);
      console.log("Navigated to lobby");
    }
  }, [gameId, navigate]);

  return (
    <section>
      <button onClick={handleClick}>Create game</button>
    </section>
  );
}
export default Home;
