"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Typography from "@tiptap/extension-typography";
import EditorToolbar from "./EditorToolbar";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Start writing your content...",
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      CodeBlock,
      Image.configure({ inline: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer dark:text-blue-400",
        },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      Subscript,
      Superscript,
      FontFamily,
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none p-6 min-h-[400px] outline-none focus:outline-none",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
      <EditorToolbar editor={editor} />
      <div className="voyagr-editor">
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .voyagr-editor .ProseMirror {
          min-height: 400px;
        }
        .voyagr-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .voyagr-editor .ProseMirror img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
        }
        .voyagr-editor .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .voyagr-editor .ProseMirror table td,
        .voyagr-editor .ProseMirror table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          min-width: 80px;
          vertical-align: top;
        }
        .voyagr-editor .ProseMirror table th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .dark .voyagr-editor .ProseMirror table td,
        .dark .voyagr-editor .ProseMirror table th {
          border-color: #4b5563;
        }
        .dark .voyagr-editor .ProseMirror table th {
          background-color: #1f2937;
        }
        .voyagr-editor .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        .dark .voyagr-editor .ProseMirror hr {
          border-top-color: #4b5563;
        }
        .voyagr-editor .ProseMirror pre {
          background-color: #1e1e1e;
          color: #d4d4d4;
          border-radius: 0.5rem;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }
        .voyagr-editor .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.15rem 0.4rem;
          font-size: 0.875em;
        }
        .dark .voyagr-editor .ProseMirror code {
          background-color: #374151;
        }
        .voyagr-editor .ProseMirror pre code {
          background: none;
          padding: 0;
          border-radius: 0;
        }
        .voyagr-editor .ProseMirror blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }
        .dark .voyagr-editor .ProseMirror blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }
        .voyagr-editor .ProseMirror mark {
          border-radius: 0.15rem;
          padding: 0.1rem 0.2rem;
        }
      `}</style>
    </div>
  );
}
