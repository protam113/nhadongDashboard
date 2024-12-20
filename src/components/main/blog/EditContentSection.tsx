import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditorMenuBar from "./RichText/TextEditorMenuBar";
// import Underline from "@tiptap/extension-underline";

type TextEditorProps = {
  onChange: (content: string) => void;
  initialContent?: string;
};

export default function EditContentSection({
  onChange,
  initialContent,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Gửi nội dung mới qua hàm onChange
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
      },
    },
  });

  return (
    <div>
      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
