import { useEffect, useState } from 'react';
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

const AdminContentManager = ({ token, type }) => {
  const config = collectionConfig[type];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(config.empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
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
      await loadItems();
    } catch (error) {
      const data = error.response?.data;
      const fieldErrors = Array.isArray(data?.errors) && data.errors.length
        ? data.errors.map((item) => `${item.field}: ${item.message}`).join(' | ')
        : '';
      setNotice(fieldErrors || data?.message || 'Could not save this item.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm(config.normalizeForForm(item));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      await axios.delete(`${config.endpoint}/${id}`, { headers });
      if (editingId === id) {
        setEditingId(null);
        setForm(config.empty);
      }
      setNotice('Deleted successfully.');
      await loadItems();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Could not delete this item.');
    }
  };

  return (
    <section className="admin-content-manager">
      <div className="admin-content-heading">
        <div><p>Database editor</p><h2>{editingId ? `Edit ${config.label.slice(0, -1)}` : `Add ${config.label.slice(0, -1)}`}</h2></div>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(config.empty); }}>Cancel edit</button>}
      </div>
      <form onSubmit={submit} className="admin-editor-form">
        {config.fields.map((field) => (
          <label key={field.name} className={field.large || field.markdown || field.image ? 'admin-field admin-field-wide' : 'admin-field'}>
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
        <button className="admin-save-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update item' : `Publish ${config.label.slice(0, -1)}`}</button>
      </form>
      {notice && <p className="admin-notice">{notice}</p>}
      <div className="admin-items-list">
        <div className="admin-content-heading"><div><p>Synced with MongoDB</p><h2>Saved {config.label}</h2></div></div>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p>No {config.label.toLowerCase()} saved yet.</p> : items.map((item) => (
          <article key={item._id} className="admin-item-row">
            <div><h3>{config.itemTitle(item)}</h3><p>{config.itemMeta(item)}</p></div>
            <div><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" onClick={() => remove(item._id)}>Delete</button></div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminContentManager;
