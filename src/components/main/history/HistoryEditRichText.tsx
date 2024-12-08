import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditorMenuBar from "../blog/RichText/TextEditorMenuBar";
import { useEffect } from "react";
// import Underline from "@tiptap/extension-underline";

type TextEditorProps = {
  onChange: (about: string) => void;
  initialContent?: string; // Add this line
};

export default function HistoryEditRichText({
  onChange,
  initialContent,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // , Underline
    ],
    content: initialContent || "", // Truyền `initialContent` vào đây, nếu có
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Cập nhật giá trị khi nội dung thay đổi
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent); // Cập nhật nội dung editor khi `initialContent` thay đổi
    }
  }, [initialContent, editor]);

  return (
    <div>
      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
