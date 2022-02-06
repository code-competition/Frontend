import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
//import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { editorLight } from "../utils/editorThemes/editorLight";

interface CodeEditorProps {
  onChange(value: string, viewUpdate: ViewUpdate): void;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  return (
    <div className="ph-c-editor">
      <div className="ph-c-editor__editing-area">
        <CodeMirror
          value={`fn main() { 

  // Your code goes here
            
}`}
          extensions={[rust()]}
          theme={editorLight}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
