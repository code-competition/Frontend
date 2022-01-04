import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";

interface CodeEditorProps {
  onChange(value: string, viewUpdate: ViewUpdate): void;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value='fn main() { println!("true"); }'
      height="500px"
      extensions={[javascript({ jsx: true }), rust()]}
      onChange={onChange}
    />
  );
}

export default CodeEditor;
