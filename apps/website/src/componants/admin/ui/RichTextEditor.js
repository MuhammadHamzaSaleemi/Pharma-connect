'use client'
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
    LuBold, LuItalic, LuUnderline, LuStrikethrough, LuCode,
    LuHeading1, LuHeading2, LuHeading3, LuList, LuListOrdered, LuQuote, LuMinus,
    LuLink, LuUnlink, LuUndo2, LuRedo2,
} from "react-icons/lu";
import Button from "./Button";

const TOOLBAR_GROUPS = [
    [
        { title: 'Bold', icon: LuBold, run: (editor) => editor.chain().focus().toggleBold().run(), isActive: (editor) => editor.isActive('bold') },
        { title: 'Italic', icon: LuItalic, run: (editor) => editor.chain().focus().toggleItalic().run(), isActive: (editor) => editor.isActive('italic') },
        { title: 'Underline', icon: LuUnderline, run: (editor) => editor.chain().focus().toggleUnderline().run(), isActive: (editor) => editor.isActive('underline') },
        { title: 'Strikethrough', icon: LuStrikethrough, run: (editor) => editor.chain().focus().toggleStrike().run(), isActive: (editor) => editor.isActive('strike') },
        { title: 'Inline code', icon: LuCode, run: (editor) => editor.chain().focus().toggleCode().run(), isActive: (editor) => editor.isActive('code') },
    ],
    [
        { title: 'Heading 1', icon: LuHeading1, run: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (editor) => editor.isActive('heading', { level: 1 }) },
        { title: 'Heading 2', icon: LuHeading2, run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (editor) => editor.isActive('heading', { level: 2 }) },
        { title: 'Heading 3', icon: LuHeading3, run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (editor) => editor.isActive('heading', { level: 3 }) },
    ],
    [
        { title: 'Bullet list', icon: LuList, run: (editor) => editor.chain().focus().toggleBulletList().run(), isActive: (editor) => editor.isActive('bulletList') },
        { title: 'Numbered list', icon: LuListOrdered, run: (editor) => editor.chain().focus().toggleOrderedList().run(), isActive: (editor) => editor.isActive('orderedList') },
        { title: 'Quote', icon: LuQuote, run: (editor) => editor.chain().focus().toggleBlockquote().run(), isActive: (editor) => editor.isActive('blockquote') },
        { title: 'Horizontal rule', icon: LuMinus, run: (editor) => editor.chain().focus().setHorizontalRule().run(), isActive: () => false },
    ],
    [
        {
            title: 'Link',
            icon: LuLink,
            run: (editor) => {
                const previousUrl = editor.getAttributes('link').href;
                const url = window.prompt('URL', previousUrl || 'https://');
                if (url === null) return;
                if (url === '') {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                    return;
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            },
            isActive: (editor) => editor.isActive('link'),
        },
        { title: 'Remove link', icon: LuUnlink, run: (editor) => editor.chain().focus().unsetLink().run(), isActive: () => false },
    ],
    [
        { title: 'Undo', icon: LuUndo2, run: (editor) => editor.chain().focus().undo().run(), isActive: () => false },
        { title: 'Redo', icon: LuRedo2, run: (editor) => editor.chain().focus().redo().run(), isActive: () => false },
    ],
];

/**
 * Reusable rich text editor. Controlled via an HTML string.
 *
 * Props:
 *   value: string (HTML)
 *   onChange: (html: string) => void
 *   placeholder: string
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({ placeholder: placeholder || 'Write something...' }),
        ],
        content: value || '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[200px] w-full rounded-b-md border border-t-0 border-gray-300 px-3 py-2 text-sm focus:outline-none',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-gray-300 bg-gray-50 px-2 py-1.5">
                {TOOLBAR_GROUPS.map((group, groupIndex) => (
                    <React.Fragment key={group.map((action) => action.title).join('-')}>
                        {groupIndex > 0 && <span className="mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />}
                        {group.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={action.title}
                                    variant="ghost"
                                    size="icon"
                                    active={action.isActive(editor)}
                                    title={action.title}
                                    onClick={() => action.run(editor)}
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
