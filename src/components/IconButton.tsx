import { HTMLProps } from "react";
import { ButtonSize } from "./Button";

interface IconButtonProps {
  icon: string;
  alt?: string;
  btnsize?: ButtonSize;
  type?: "button" | "submit" | "reset";
}

export enum IconSize {
  Small = "small",
  Default = "default",
  Large = "large",
  ExtraLarge = "extraLarge",
}

function IconButton(props: IconButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${props.className} ph-c-icon-btn ph-c-icon-btn--${
        props.btnsize === undefined ? ButtonSize.Default : props.btnsize
      } ph-c-btn--primary`}
    >
      <img
        className={`${
          props.className
        } ph-c-icon-btn__image ph-c-icon-btn__image--${
          props.btnsize === undefined ? ButtonSize.Default : props.btnsize
        }`}
        src={props.icon}
        alt={props.btnsize === undefined ? "" : props.alt}
      />
    </button>
  );
}
export default IconButton;
