import { HTMLProps, ReactNode } from "react";
import { IconKind } from "./IconButton";

export enum ButtonSize {
  Small = "small",
  Default = "default",
  Big = "big",
}

export enum IconPlacement {
  Left = "left",
  Right = "right",
}

export enum ButtonKind {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Positive = "positive",
  Negative = "negative",
  NegativeSecondary = "negative-secondary",
}

interface ButtonProps {
  icon?: ReactNode | string;
  iconPlacement?: IconPlacement;
  iconKind?: IconKind;
  iconAlt?: string;
  btnsize?: ButtonSize;
  type?: "button" | "submit" | "reset";
  kind?: ButtonKind | undefined;
}

function Button({
  btnsize = ButtonSize.Default,
  kind = ButtonKind.Primary,
  iconPlacement = IconPlacement.Left,
  icon,
  iconAlt = "",
  iconKind = IconKind.Image,
  ...props
}: ButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${props.className} ph-c-btn ph-c-btn--${btnsize} ph-c-btn--${kind} ph-c-btn--icon-${iconPlacement}`}
    >
      {props.children}
      {icon !== undefined ? (
        iconKind === IconKind.Image ? (
          <img
            className={`${props.className} ph-c-icon-btn__image ph-c-icon-btn__image--${btnsize}`}
            src={icon as string}
            alt={iconAlt}
          />
        ) : (
          icon
        )
      ) : null}
    </button>
  );
}
export default Button;
