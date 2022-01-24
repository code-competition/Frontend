import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";

interface CodeEditorProps {
  onChange(value: string, viewUpdate: ViewUpdate): void;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  return (
    <div className="ph-c-editor">
      <CodeMirror
        value='fn main() { println!("true"); }'
        height="500px"
        extensions={[javascript({ jsx: true }), rust()]}
        onChange={onChange}
      />

      <div className="ph-c-divider ph-c-divider--horizontal ph-c-divider--default"></div>

      <div className="ph-c-editor__bar">
        <p className="ph-b-body ph-b-body--normal">Line: 4 Col: 1</p>
      </div>
    </div>
  );
}

export default CodeEditor;
