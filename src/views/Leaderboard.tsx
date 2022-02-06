import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonSize, ButtonKind } from "../components/Button";
import Panel, { PanelKind, PanelSize } from "../components/Panel";
import PanelHeader from "../components/Panel/PanelHeader";
import { GameStateContext } from "../contexts/GameState";
import { UserFinished } from "../interfaces/game";

function Leaderboard() {
  let { start, finishes, users, resetGameState } = useContext(GameStateContext);
  let navigate = useNavigate();

  let [leaderboard, setLeaderboard] = useState<ReactNode[]>([]);
  let [isShowLeaderboard, setIsShowLeaderboard] = useState<boolean>(false);

  useEffect(() => {
    if (finishes.length === users.length + 1) {
      setLeaderboard(
        finishes.map((finished: UserFinished, index: number) => {
          return (
            <>
              <li
                className="ph-p-leaderboard-list__item"
                key={finished.user.id}
              >
                <p className="ph-b-header ph-b-header--big">{index + 1}</p>
                <div>
                  <p className="ph-b-header ph-b-header--small">
                    {finished.user.name}
                  </p>
                  <p className="ph-b-body ph-b-body--normal">
                    {(finished.time - start) / 1000} seconds
                  </p>
                </div>
              </li>
              <div
                key={finished.user.id + "divider"}
                className="ph-c-divider ph-c-divider--horizontal ph-c-divider--default"
              ></div>
            </>
          );
        })
      );

      setIsShowLeaderboard(true);
      resetGameState();
      navigate("/");
    }
  }, [users, finishes]);

  if (isShowLeaderboard) {
    return (
      <div className="ph-p-leaderboard">
        <Panel
          className="ph-p-leaderboard__panel"
          panelSize={PanelSize.Default}
          kind={PanelKind.Basic}
          headerContent={
            <div className="ph-p-leaderboard__header">
              <PanelHeader header="Leaderboard" panelSize={PanelSize.Default} />
              <Button
                btnsize={ButtonSize.Small}
                kind={ButtonKind.Negative}
                onClick={() => setIsShowLeaderboard(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="ph-p-leaderboard__modal">
            <ul className="ph-p-leaderboard-list">{leaderboard}</ul>
          </div>
        </Panel>
      </div>
    );
  } else {
    return <> </>;
  }
}

export default Leaderboard;
