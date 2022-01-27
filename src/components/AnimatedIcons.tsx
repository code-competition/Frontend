export enum AnimatedIconKind {
  Spinner = "spinner",
}

export enum AnimatedIconSize {
  Small = "small",
  Default = "default",
  Large = "large",
}

interface AnimatedIconProps {
  kind: AnimatedIconKind;
  size?: AnimatedIconSize;
}

function AnimatedIcon({
  kind,
  size = AnimatedIconSize.Default,
}: AnimatedIconProps) {
  switch (kind) {
    case AnimatedIconKind.Spinner:
      return (
        <svg
          className={`ph-c-animated-icon--spinner ph-c-animated-icon--size-${size}`}
          viewBox="0 0 50 50"
        >
          <circle
            className="ph-c-animated-icon--spinner__path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>
      );
  }
}

export default AnimatedIcon;
