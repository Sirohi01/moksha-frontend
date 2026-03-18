'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, FileText, Image as ImageIcon, Link, Hash } from 'lucide-react';

interface ContentEditorProps {
  content?: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
}

export default function ContentEditor({ 
  content = '', 
  onChange, 
  onSave, 
  placeholder = 'Start writing your content...' 
}: ContentEditorProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useEffect(() => {
    // Calculate word count and reading time
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 200)); // 200 words per minute
  }, [editorContent]);

  const handleContentChange = (value: string) => {
    setEditorContent(value);
    onChange(value);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    const newContent = 
      editorContent.substring(0, start) + 
      before + selectedText + after + 
      editorContent.substring(end);
    
    handleContentChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatButtons = [
    { icon: <FileText className="w-4 h-4" />, label: 'Heading', action: () => insertText('## ', '') },
    { icon: <strong>B</strong>, label: 'Bold', action: () => insertText('**', '**') },
    { icon: <em>I</em>, label: 'Italic', action: () => insertText('*', '*') },
    { icon: <Link className="w-4 h-4" />, label: 'Link', action: () => insertText('[', '](url)') },
    { icon: <ImageIcon className="w-4 h-4" />, label: 'Image', action: () => insertText('![alt text](', ')') },
    { icon: <Hash className="w-4 h-4" />, label: 'List', action: () => insertText('- ', '') },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {wordCount} words • {readingTime} min read
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded transition-colors ${
                isPreview 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Toggle Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {onSave && (
              <button
                onClick={onSave}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-96">
        {isPreview ? (
          <div className="p-4 prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: editorContent
                  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
                  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
                  .replace(/^- (.*$)/gim, '<li>$1</li>')
                  .replace(/\n/g, '<br>')
              }} 
            />
          </div>
        ) : (
          <textarea
            id="content-editor"
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-4 border-none outline-none resize-none font-mono text-sm"
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-300 p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Supports Markdown formatting
          </div>
          <div className="flex items-center space-x-4">
            <span>Characters: {editorContent.length}</span>
            <span>Lines: {editorContent.split('\n').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}