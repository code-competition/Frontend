import { HTMLProps, ReactNode } from "react";

export enum ButtonSize {
  Small = "small",
  Default = "default",
  Big = "big",
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
  btnsize?: ButtonSize;
  type?: "button" | "submit" | "reset";
  kind?: ButtonKind | undefined;
}

function Home(props: ButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${props.className} ph-c-btn ph-c-btn--${
        props.btnsize === undefined ? ButtonSize.Default : props.btnsize
      } ph-c-btn--${
        props.kind === undefined ? ButtonKind.Primary : props.kind
      }`}
    >
      {props.children}
    </button>
  );
}
export default Home;
