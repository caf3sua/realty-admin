import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link, 
  Image, 
  Upload,
  Code,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Nhập nội dung bài viết ở đây...' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync initial value to editor once or when value differs
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    // Count words
    const text = value ? value.replace(/<[^>]*>/g, ' ').trim() : '';
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [value, isSourceMode]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && window.getSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const executeCommand = (command: string, val: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Nhập địa chỉ hình ảnh (URL):');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const triggerFileUpload = () => {
    saveSelection();
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const result = await api.uploadFile(file);
      
      // Restore cursor position
      restoreSelection();
      
      // Insert image tag
      executeCommand('insertImage', result.url);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Lỗi khi tải hình ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFormatting = () => {
    executeCommand('removeFormat');
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-indigo-650/15 focus-within:border-indigo-600 transition-all">
      {/* Hidden File Input for image uploader */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 select-none">
        {/* Toggle Mode */}
        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          title={isSourceMode ? 'Xem dạng soạn thảo' : 'Xem mã nguồn HTML'}
          className={`p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer`}
        >
          {isSourceMode ? <Eye className="w-4 h-4 text-indigo-600 font-bold" /> : <Code className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-slate-350 mx-1"></div>

        {!isSourceMode ? (
          <>
            {/* Formatting */}
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Chữ đậm"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Chữ nghiêng"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Gạch chân"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              title="Gạch ngang"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-350 mx-1"></div>

            {/* Headings */}
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<h1>')}
              title="Tiêu đề lớn (H1)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer font-bold"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<h2>')}
              title="Tiêu đề phụ (H2)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer font-bold"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-350 mx-1"></div>

            {/* Lists */}
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Danh sách dấu đầu dòng"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Danh sách số"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-350 mx-1"></div>

            {/* Alignment */}
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              title="Căn trái"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              title="Căn giữa"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              title="Căn phải"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-350 mx-1"></div>

            {/* Links and Images */}
            <button
              type="button"
              onClick={addLink}
              title="Chèn liên kết"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={addImageUrl}
              title="Chèn ảnh bằng URL"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={triggerFileUpload}
              disabled={isUploading}
              title="Tải ảnh lên và chèn"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer flex items-center gap-0.5"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Upload className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-slate-350 mx-1"></div>

            {/* Clean */}
            <button
              type="button"
              onClick={clearFormatting}
              title="Xóa định dạng"
              className="p-1.5 rounded hover:bg-slate-200 text-red-650 hover:text-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Chế độ sửa mã nguồn HTML</span>
        )}
      </div>

      {/* Editor Body */}
      <div className="relative min-h-[300px] flex flex-col flex-1">
        {isSourceMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nội dung mã nguồn HTML..."
            className="w-full flex-1 min-h-[300px] p-4 font-mono text-xs text-slate-700 focus:outline-none resize-y border-0 rounded-b-xl leading-relaxed"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="w-full flex-1 min-h-[300px] p-4 text-xs text-slate-700 focus:outline-none overflow-y-auto prose max-w-none prose-slate focus:bg-slate-50/20"
            style={{ minHeight: '300px' }}
          />
        )}
        
        {/* Placeholder helper for contentEditable */}
        {!isSourceMode && !value && (
          <div className="absolute top-4 left-4 text-xs text-slate-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-200/80 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>Định dạng: HTML5 Rich Text</span>
        <span>Số từ: {wordCount}</span>
      </div>
    </div>
  );
};
