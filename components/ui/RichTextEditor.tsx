'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    List, 
    ListOrdered, 
    Heading1, 
    Heading2, 
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Link as LinkIcon, 
    Unlink,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
}: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-2.5 rounded-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95",
            isActive 
                ? "bg-navy-950 text-gold-500 shadow-lg shadow-navy-950/20" 
                : "text-stone-400 hover:bg-stone-50 hover:text-navy-950"
        )}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#20b2aa] underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something amazing...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-stone max-w-none focus:outline-none min-h-[500px] p-10 lg:p-14 text-lg leading-relaxed text-navy-950 selection:bg-gold-500/20',
            },
        },
    });

    if (!editor) return null;

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="w-full bg-white rounded-[3.5rem] border border-stone-100 shadow-sm overflow-hidden group/editor focus-within:ring-4 focus-within:ring-gold-500/10 transition-all">
            {/* 🛠️ PREMIUM TOOLBAR */}
            <div className="bg-stone-50/80 backdrop-blur-md border-b border-stone-100 p-4 lg:p-5 flex flex-wrap items-center gap-1.5 sticky top-0 z-10 transition-colors">
                <div className="flex items-center gap-1 px-2 border-r border-stone-200/60 mr-1.5">
                    <ToolbarButton 
                        title="Heading 1"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                        isActive={editor.isActive('heading', { level: 1 })}
                    >
                        <Heading1 size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Heading 2"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Heading 3"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
                        isActive={editor.isActive('heading', { level: 3 })}
                    >
                        <Heading3 size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Heading 4"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
                        isActive={editor.isActive('heading', { level: 4 })}
                    >
                        <Heading4 size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Heading 5"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} 
                        isActive={editor.isActive('heading', { level: 5 })}
                    >
                        <Heading5 size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Heading 6"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} 
                        isActive={editor.isActive('heading', { level: 6 })}
                    >
                        <Heading6 size={18} />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-stone-200/60 mr-1.5">
                    <ToolbarButton 
                        title="Bold"
                        onClick={() => editor.chain().focus().toggleBold().run()} 
                        isActive={editor.isActive('bold')}
                    >
                        <Bold size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()} 
                        isActive={editor.isActive('italic')}
                    >
                        <Italic size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Underline"
                        onClick={() => editor.chain().focus().toggleUnderline().run()} 
                        isActive={editor.isActive('underline')}
                    >
                        <UnderlineIcon size={18} />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-stone-200/60 mr-1.5">
                    <ToolbarButton 
                        title="Bullet List"
                        onClick={() => editor.chain().focus().toggleBulletList().run()} 
                        isActive={editor.isActive('bulletList')}
                    >
                        <List size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Numbered List"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered size={18} />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-stone-200/60 mr-1.5">
                    <ToolbarButton 
                        title="Align Left"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()} 
                        isActive={editor.isActive({ textAlign: 'left' })}
                    >
                        <AlignLeft size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Align Center"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()} 
                        isActive={editor.isActive({ textAlign: 'center' })}
                    >
                        <AlignCenter size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Align Right"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()} 
                        isActive={editor.isActive({ textAlign: 'right' })}
                    >
                        <AlignRight size={18} />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-stone-200/60 mr-1.5">
                    <ToolbarButton 
                        title="Hyperlink"
                        onClick={addLink} 
                        isActive={editor.isActive('link')}
                    >
                        <LinkIcon size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Remove Link"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                    >
                        <Unlink size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Blockquote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                    >
                        <Quote size={18} />
                    </ToolbarButton>
                </div>

                <div className="ml-auto flex items-center gap-1">
                    <ToolbarButton 
                        title="Undo"
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo size={18} />
                    </ToolbarButton>
                    <ToolbarButton 
                        title="Redo"
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo size={18} />
                    </ToolbarButton>
                </div>
            </div>

            {/* 📝 EDITOR AREA */}
            <div className="bg-stone-50/30 group-focus-within/editor:bg-white transition-colors custom-editor-Styles">
                <EditorContent editor={editor} />
            </div>

            {/* ℹ️ STATUS BAR */}
            <div className="px-10 py-4 bg-white border-t border-stone-50 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-stone-300">
                <div className="flex items-center gap-4">
                    <span>Characters: {editor.getText().length}</span>
                    <span>Words: {editor.getText().split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time Sync Active</span>
                </div>
            </div>

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.05em; line-height: 1; }
                .ProseMirror h2 { font-size: 2rem; font-weight: 900; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: -0.03em; line-height: 1.1; }
                .ProseMirror h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: -0.02em; }
                .ProseMirror h4 { font-size: 1.25rem; font-weight: 900; margin-bottom: 0.75rem; text-transform: uppercase; }
                .ProseMirror h5 { font-size: 1.1rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; }
                .ProseMirror h6 { font-size: 1rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; }
                .ProseMirror ul { list-style-type: disc !important; padding-left: 1.5rem; margin-bottom: 1rem; }
                .ProseMirror ol { list-style-type: decimal !important; padding-left: 1.5rem; margin-bottom: 1rem; }
                .ProseMirror li { margin-bottom: 0.5rem; }
                .ProseMirror blockquote { border-left: 4px solid #f4c430; padding-left: 1.5rem; font-style: italic; color: #4b5563; margin: 2rem 0; }
                .ProseMirror a { color: #20b2aa; text-decoration: underline; font-weight: 700; transition: all 0.2s; }
                .ProseMirror a:hover { color: #f4c430; }
                .ProseMirror { min-height: 600px; outline: none !important; }
            `}</style>
        </div>
    );
}
