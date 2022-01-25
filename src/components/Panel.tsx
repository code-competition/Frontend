import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  headerContent: ReactNode;
  panelSize?: PanelSize;
  kind?: PanelKind;
  className?: string;
}

export enum PanelSize {
  Big = "big",
  Default = "default",
}

export enum PanelKind {
  Default = "default",
  Basic = "basic",
  BasicReverse = "basic-reverse",
}

function Panel({
  children,
  headerContent,
  className = "",
  panelSize = PanelSize.Default,
  kind = PanelKind.Default,
}: PanelProps) {
  return (
    <section className={`${className} ph-c-panel`}>
      <header
        className={`ph-c-panel__header ph-c-panel__header--${panelSize} `}
      >
        {headerContent}
      </header>

      <div className="ph-c-divider ph-c-divider--horizontal ph-c-divider--default"></div>

      <div className={`ph-c-panel__content ph-c-panel__content--${kind}`}>
        {children}
      </div>
    </section>
  );
}

export default Panel;
