import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { proghourLight } from "../utils/editorThemes/proghourLight";

interface CodeEditorProps {
  onChange(value: string, viewUpdate: ViewUpdate): void;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  return (
    <div className="ph-c-editor">
      <div className="ph-c-editor__editing-area">
        <CodeMirror
          value='fn main() { println!("true"); }'
          extensions={[javascript({ jsx: true }), rust()]}
          theme={proghourLight}
          onChange={onChange}
        />
      </div>

      <div className="ph-c-divider ph-c-divider--horizontal ph-c-divider--default"></div>

      <div className="ph-c-editor__bar">
        <p className="ph-b-body ph-b-body--normal">Line: 4 Col: 1</p>
      </div>
    </div>
  );
}

export default CodeEditor;
