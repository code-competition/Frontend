import Panel, { PanelKind, PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";

interface QuestionPanelProps {
  question: string;
}

function QuestionPanel({ question }: QuestionPanelProps) {
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

export default QuestionPanel;
