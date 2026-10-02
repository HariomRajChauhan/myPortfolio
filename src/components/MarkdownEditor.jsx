import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  const [activeTab, setActiveTab] = useState('write');

  return (
    <div className="markdown-editor">
      <div className="markdown-editor-tabs" role="tablist" aria-label="Markdown mode">
        <button
          type="button"
          role="tab"
          id="md-tab-write"
          aria-selected={activeTab === 'write'}
          aria-controls="md-panel-write"
          className={activeTab === 'write' ? 'active' : ''}
          onClick={() => setActiveTab('write')}
        >
          Write
        </button>
        <button
          type="button"
          role="tab"
          id="md-tab-preview"
          aria-selected={activeTab === 'preview'}
          aria-controls="md-panel-preview"
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'write' ? (
        <textarea
          role="tabpanel"
          id="md-panel-write"
          aria-labelledby="md-tab-write"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Write your content in markdown...'}
          rows={16}
          className="markdown-editor-textarea"
        />
      ) : (
        <div
          role="tabpanel"
          id="md-panel-preview"
          aria-labelledby="md-tab-preview"
          className="markdown-editor-preview blog-content"
        >
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
