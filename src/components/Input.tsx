import { HTMLProps } from "react";

export enum InputKind {
  Default = "default",
  Success = "success",
  Error = "error",
}

interface InputProps {
  hasLabel?: boolean;
  kind?: InputKind;
}

function Input(props: InputProps & HTMLProps<HTMLInputElement>) {
  return (
    <div className={`ph-c-input ${props.className}`}>
      {props.hasLabel === undefined || props.hasLabel ? (
        <>
          <label
            className="ph-c-input__label ph-b-body ph-b-body--small"
            htmlFor={props.name}
          >
            {props.name}
          </label>
          <input {...props} className={`ph-c-input__textbox`} id={props.name} />
        </>
      ) : (
        <input
          {...props}
          className={`ph-c-input__textbox`}
          id={props.name}
          name={props.name}
        />
      )}
    </div>
  );
}

export default Input;
