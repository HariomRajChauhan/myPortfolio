import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MarkdownEditor from './MarkdownEditor';
import ImageUploader from './ImageUploader';

const collectionConfig = {
  blogs: {
    label: 'Blog posts',
    endpoint: '/api/admin/blogs',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Slug', required: true, hint: 'lowercase-words-separated-by-hyphens' },
      { name: 'excerpt', label: 'Excerpt', required: true, textarea: true },
      { name: 'content', label: 'Content', required: true, markdown: true },
      { name: 'coverImage', label: 'Cover image', image: true },
      { name: 'tags', label: 'Tags', hint: 'Comma separated' },
      { name: 'published', label: 'Publish now', checkbox: true },
    ],
    empty: { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', published: false },
    itemTitle: (item) => item.title,
    itemMeta: (item) => `${item.published ? 'Published' : 'Draft'}${item.tags?.length ? ` · ${item.tags.join(', ')}` : ''}`,
    normalizeForForm: (item) => ({ ...item, tags: item.tags?.join(', ') || '' }),
    normalizeForApi: (item) => ({ ...item, tags: item.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }),
  },
  videos: {
    label: 'YouTube videos',
    endpoint: '/api/videos',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'youtubeUrl', label: 'YouTube video URL', required: true, type: 'url' },
      { name: 'description', label: 'Description', required: true, textarea: true, large: true },
      { name: 'thumbnailUrl', label: 'Custom thumbnail URL', type: 'url', hint: 'Optional: YouTube thumbnail is used automatically.' },
      { name: 'publishedAt', label: 'Publish date', type: 'date' },
    ],
    empty: { title: '', youtubeUrl: '', description: '', thumbnailUrl: '', publishedAt: '' },
    itemTitle: (item) => item.title,
    itemMeta: (item) => new Date(item.publishedAt).toLocaleDateString(),
    normalizeForForm: (item) => ({ ...item, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '' }),
    normalizeForApi: (item) => item,
  },
  projects: {
    label: 'Projects',
    endpoint: '/api/projects',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Short description', required: true, textarea: true },
      { name: 'objective', label: 'Objective', textarea: true },
      { name: 'techStack', label: 'Tech stack', hint: 'Comma separated' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'liveUrl', label: 'Live URL', type: 'url' },
      { name: 'imageUrl', label: 'Image URL or public path' },
      { name: 'featured', label: 'Featured project', checkbox: true },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
    empty: { title: '', description: '', objective: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', featured: false, order: 0 },
    itemTitle: (item) => item.title,
    itemMeta: (item) => item.featured ? 'Featured' : 'Project',
    normalizeForForm: (item) => ({ ...item, techStack: item.techStack?.join(', ') || '' }),
    normalizeForApi: (item) => ({ ...item, techStack: item.techStack.split(',').map((tech) => tech.trim()).filter(Boolean), order: Number(item.order || 0) }),
  },
  contributions: {
    label: 'Contributions',
    endpoint: '/api/admin/contributions',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'type', label: 'Type', required: true },
      { name: 'description', label: 'Description', required: true, textarea: true },
      { name: 'link', label: 'Related URL', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'published', label: 'Visible on site', checkbox: true },
    ],
    empty: { title: '', type: '', description: '', link: '', order: 0, published: true },
    itemTitle: (item) => item.title,
    itemMeta: (item) => item.type,
    normalizeForForm: (item) => item,
    normalizeForApi: (item) => ({ ...item, order: Number(item.order || 0) }),
  },
  community: {
    label: 'Community',
    endpoint: '/api/admin/community',
    fields: [
      { name: 'name', label: 'Organization or community', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'description', label: 'Description', required: true, textarea: true },
      { name: 'link', label: 'Related URL', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'published', label: 'Visible on site', checkbox: true },
    ],
    empty: { name: '', role: '', description: '', link: '', order: 0, published: true },
    itemTitle: (item) => item.name,
    itemMeta: (item) => item.role,
    normalizeForForm: (item) => item,
    normalizeForApi: (item) => ({ ...item, order: Number(item.order || 0) }),
  },
};

// Full class names are written out literally so Tailwind's scanner can see
// them; building the name from a variable would purge these rules.
const NOTICE_CLASSES = {
  info: 'admin-notice',
  success: 'admin-notice admin-notice--success',
  error: 'admin-notice admin-notice--error'
};

const AdminContentManager = ({ token, type }) => {
  const config = collectionConfig[type];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(config.empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');
  const [composerOpen, setComposerOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const composerRef = useRef(null);
  const formRef = useRef(null);
  const headers = { Authorization: `Bearer ${token}` };

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(config.endpoint, { headers });
      setItems(response.data.videos || response.data);
    } catch (error) {
      setNotice(error.response?.data?.message || `Could not load ${config.label.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setForm(config.empty);
    setEditingId(null);
    setNotice('');
    setNoticeType('info');
    setPendingDelete(null);
    // The composer collapses back to its default state between sections
    setComposerOpen(false);
    loadItems();
  }, [type]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const payload = config.normalizeForApi(form);
      if (editingId) await axios.put(`${config.endpoint}/${editingId}`, payload, { headers });
      else await axios.post(config.endpoint, payload, { headers });
      setForm(config.empty);
      setEditingId(null);
      setNotice(`${editingId ? 'Updated' : 'Created'} successfully.`);
      setNoticeType('success');
      setComposerOpen(false);
      await loadItems();
    } catch (error) {
      const data = error.response?.data;
      const fieldErrors = Array.isArray(data?.errors) && data.errors.length
        ? data.errors.map((item) => `${item.field}: ${item.message}`).join(' | ')
        : '';
      setNotice(fieldErrors || data?.message || 'Could not save this item.');
      setNoticeType('error');
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setNotice('');
    setPendingDelete(null);
    setForm(config.normalizeForForm(item));
    setComposerOpen(true);
    // Bring the composer into view and hand focus to its first input so the
    // change of context is announced instead of silently scrolling.
    requestAnimationFrame(() => {
      formRef.current?.querySelector('input:not([type="checkbox"]), textarea')?.focus();
    });
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetComposer = () => {
    setEditingId(null);
    setPendingDelete(null);
    setForm(config.empty);
    setComposerOpen(false);
  };

  const remove = async (id) => {
    setPendingDelete(null);
    setNotice('');
    try {
      await axios.delete(`${config.endpoint}/${id}`, { headers });
      if (editingId === id) {
        setEditingId(null);
        setForm(config.empty);
        setComposerOpen(false);
      }
      setNotice('Deleted successfully.');
      setNoticeType('success');
      await loadItems();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Could not delete this item.');
      setNoticeType('error');
    }
  };

  const imageField = config.fields.find((field) => field.image);

  const resetNotice = () => {
    if (notice) setNotice('');
  };

  return (
    <section className="admin-content-manager">
      <div className="admin-content-heading">
        <div>
          <p>Database editor</p>
          <h2>{editingId ? `Edit ${config.label.slice(0, -1)}` : config.label}</h2>
        </div>
        {!composerOpen && (
          <button type="button" className="admin-primary-action" onClick={() => { resetNotice(); setComposerOpen(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="16" height="16" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add {config.label.slice(0, -1).toLowerCase()}
          </button>
        )}
      </div>

      {composerOpen && (
        <div className="admin-composer" ref={composerRef}>
          <div className="admin-composer-bar">
            <h3>{editingId ? `Edit ${config.label.slice(0, -1)}` : `New ${config.label.slice(0, -1)}`}</h3>
            <button type="button" onClick={resetComposer} aria-label="Close editor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <form onSubmit={submit} className="admin-editor-form" ref={formRef}>
            {config.fields.map((field) => (
              <label
                key={field.name}
                className={field.large || field.markdown || field.image ? 'admin-field admin-field-wide' : 'admin-field'}
              >
                <span>{field.label}{field.required && ' *'}</span>
                {field.checkbox ? (
                  <input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })} />
                ) : field.markdown ? (
                  <MarkdownEditor value={form[field.name] || ''} onChange={(value) => setForm({ ...form, [field.name]: value })} placeholder="Write your blog content in markdown..." />
                ) : field.image ? (
                  <ImageUploader value={form[field.name] || ''} onChange={(value) => setForm({ ...form, [field.name]: value })} label={field.hint} token={token} />
                ) : field.textarea ? (
                  <textarea required={field.required} rows={field.large ? 10 : 4} value={form[field.name] || ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />
                ) : (
                  <input required={field.required} type={field.type || 'text'} value={form[field.name] || ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />
                )}
                {field.hint && !field.image && <small>{field.hint}</small>}
              </label>
            ))}
            <button className="admin-save-button" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update item' : `Publish ${config.label.slice(0, -1)}`}
            </button>
          </form>
        </div>
      )}

      {notice && (
        <p
          className={NOTICE_CLASSES[noticeType] || NOTICE_CLASSES.info}
          role={noticeType === 'error' ? 'alert' : 'status'}
        >
          {notice}
        </p>
      )}

      <div className="admin-items-list">
        <div className="admin-content-heading">
          <div>
            <p>Synced with MongoDB</p>
            <h2>Saved {config.label}</h2>
          </div>
          {!loading && items.length > 0 && <p className="admin-count-badge">{items.length} total</p>}
        </div>

        {loading ? (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading {config.label.toLowerCase()}…</span>
            {[0, 1, 2].map((row) => (
              <div className="admin-item-skeleton" key={row}>
                <div className="w-1/3" />
                <div className="w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <strong>No {config.label.toLowerCase()} saved yet</strong>
            {composerOpen
              ? `Use the form above to publish your first ${config.label.slice(0, -1).toLowerCase()}.`
              : `Tap “Add ${config.label.slice(0, -1).toLowerCase()}” above to publish your first one.`}
          </div>
        ) : (
          items.map((item) => (
            <article key={item._id} className={`admin-item-row${editingId === item._id ? ' is-editing' : ''}`}>
              {imageField && item[imageField.name] && (
                <img className="admin-item-thumb" src={item[imageField.name]} alt="" loading="lazy" />
              )}
              <div className="admin-item-body">
                <h3>{config.itemTitle(item)}</h3>
                <p>{config.itemMeta(item)}</p>
              </div>
              <div className="admin-item-actions">
                {pendingDelete === item._id ? (
                  <>
                    <button type="button" className="admin-confirm-yes" onClick={() => remove(item._id)}>Confirm</button>
                    <button type="button" onClick={() => setPendingDelete(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => { resetNotice(); edit(item); }}>Edit</button>
                    <button type="button" onClick={() => { resetNotice(); setPendingDelete(item._id); }}>Delete</button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default AdminContentManager;
