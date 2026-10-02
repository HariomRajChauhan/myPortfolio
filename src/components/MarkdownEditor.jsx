import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  const [activeTab, setActiveTab] = useState('write');

  return (
    <div className="markdown-editor">
      <div className="markdown-editor-tabs">
        <button
          type="button"
          className={activeTab === 'write' ? 'active' : ''}
          onClick={() => setActiveTab('write')}
        >
          Write
        </button>
        <button
          type="button"
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Write your content in markdown...'}
          rows={16}
          className="markdown-editor-textarea"
        />
      ) : (
        <div className="markdown-editor-preview">
          {value ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="markdown-editor-empty">Nothing to preview yet. Switch to Write to add content.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
