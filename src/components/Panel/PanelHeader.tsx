import { PanelSize } from "../Panel";

interface PanelHeaderProps {
  header: string;
  subheader?: string;
  panelSize?: PanelSize;
}

function PanelHeader({
  header,
  subheader,
  panelSize = PanelSize.Big,
}: PanelHeaderProps) {
  return (
    <>
      <h2
        className={`ph-b-header ph-b-header--${panelSize} ph-c-panel__header--header-content`}
      >
        {header}
      </h2>
      {subheader ? (
        <p className="ph-b-subheader ph-b-subheader--big ph-c-panel__header--header-content">
          {subheader}
        </p>
      ) : null}
    </>
  );
}

export default PanelHeader;
