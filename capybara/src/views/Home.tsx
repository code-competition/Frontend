import { useState } from "react";
import "../stylesheets/Home.css";

interface CreateGameResponse {
  game_id: String;
}

function Home() {
  const handleClick = () => {
    fetch(`http://${process.env.REACT_APP_DOMAIN}/create_game`, {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((d) => d.json())
      .then((f: CreateGameResponse) => console.log(f));
  };

  return (
    <section>
      <button onClick={handleClick}>Create game</button>
    </section>
  );
}

export default Home;
