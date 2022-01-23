import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  headerContent: ReactNode;
  panelSize?: PanelSize;
  className?: string;
}

export enum PanelSize {
  Big = "big",
  Small = "small",
}

function Panel({
  children,
  headerContent,
  className = "",
  panelSize = PanelSize.Big,
}: PanelProps) {
  return (
    <section className={`${className} ph-c-panel`}>
      <header
        className={`ph-c-panel__header ph-c-panel__header--${panelSize} `}
      >
        {headerContent}
      </header>

      <div className="ph-c-divider ph-c-divider--horizontal ph-c-divider--default"></div>

      <div className="ph-c-panel__content">{children}</div>
    </section>
  );
}

export default Panel;
