import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";

interface QuestionProps {
  question: string;
}

function Question({ question }: QuestionProps) {
  return (
    <Panel
      className="ph-l-game__question"
      kind={PanelKind.Basic}
      panelSize={PanelSize.Default}
      headerContent={
        <PanelHeader header="Questions" panelSize={PanelSize.Default} />
      }
    >
      <p>{question}</p>
    </Panel>
  );
}

export default Question;
