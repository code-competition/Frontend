import { PanelSize } from "../Panel";

interface PanelHeaderProps {
  header: string;
  subheader?: string;
  panelSize?: PanelSize;
}

function PanelHeader({ header, subheader }: PanelHeaderProps) {
  return (
    <>
      <h2
        className={`ph-b-header ph-b-header--default ph-c-panel__header--header-content`}
      >
        {header}
      </h2>
      {subheader ? (
        <p className="ph-b-subheader ph-b-subheader--default ph-c-panel__header--header-content">
          {subheader}
        </p>
      ) : null}
    </>
  );
}

export default PanelHeader;
