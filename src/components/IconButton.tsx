import { HTMLProps, ReactNode } from "react";
import { ButtonSize } from "./Button";

interface IconButtonProps {
  icon: ReactNode | string;
  alt?: string;
  btnsize?: ButtonSize;
  type?: "button" | "submit" | "reset";
  kind?: IconKind;
}

export enum IconSize {
  Small = "small",
  Default = "default",
  Large = "large",
  ExtraLarge = "extraLarge",
}

export enum IconKind {
  ReactNode = "reactNode",
  Image = "image",
}

function IconButton({
  kind = IconKind.Image,
  ...props
}: IconButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${props.className} ph-c-icon-btn ph-c-icon-btn--${
        props.btnsize === undefined ? ButtonSize.Default : props.btnsize
      } ph-c-btn--primary`}
    >
      {kind === IconKind.Image ? (
        <img
          className={`${
            props.className
          } ph-c-icon-btn__image ph-c-icon-btn__image--${
            props.btnsize === undefined ? ButtonSize.Default : props.btnsize
          }`}
          src={props.icon as string}
          alt={props.btnsize === undefined ? "" : props.alt}
        />
      ) : (
        props.icon
      )}
    </button>
  );
}
export default IconButton;
