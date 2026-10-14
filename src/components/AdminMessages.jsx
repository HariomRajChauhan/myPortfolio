import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'read', label: 'Read' },
  { id: 'replied', label: 'Replied' },
];

const formatDate = (value) => new Date(value).toLocaleString(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

// Inbox for submissions from the public /contact form. Reads, filters, and
// updates the status of recruiter messages pulled from GET /api/contact.
const AdminMessages = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/contact', { headers });
      setMessages(response.data);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Could not load messages.');
      setNoticeType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = messages.find((message) => message._id === selectedId) || null;

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setNotice('');
    try {
      await axios.patch(`/api/contact/${id}/status`, { status }, { headers });
      setMessages((current) => current.map((message) => (
        message._id === id ? { ...message, status } : message
      )));
    } catch (error) {
      setNotice(error.response?.data?.message || 'Could not update this message.');
      setNoticeType('error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setBusyId(id);
    setNotice('');
    try {
      await axios.delete(`/api/contact/${id}`, { headers });
      setMessages((current) => current.filter((message) => message._id !== id));
      if (selectedId === id) setSelectedId(null);
      setNotice('Message deleted.');
      setNoticeType('success');
    } catch (error) {
      setNotice(error.response?.data?.message || 'Could not delete this message.');
      setNoticeType('error');
    } finally {
      setBusyId(null);
    }
  };

  // Opening a new message marks it as read so the unread count stays accurate.
  const open = (message) => {
    setSelectedId(message._id);
    if (message.status === 'new') updateStatus(message._id, 'read');
  };

  const counts = {
    all: messages.length,
    new: messages.filter((message) => message.status === 'new').length,
    read: messages.filter((message) => message.status === 'read').length,
    replied: messages.filter((message) => message.status === 'replied').length,
  };

  const visible = filter === 'all'
    ? messages
    : messages.filter((message) => message.status === filter);

  const noticeClass = noticeType === 'error'
    ? 'admin-notice admin-notice--error'
    : noticeType === 'success'
      ? 'admin-notice admin-notice--success'
      : 'admin-notice';

  return (
    <section className="admin-messages">
      <div className="admin-content-heading">
        <div>
          <p>Recruiter inbox</p>
          <h2>Contact messages</h2>
        </div>
        <div className="admin-message-heading-actions">
          {!loading && <span className="admin-count-badge">{counts.new} new</span>}
          <button type="button" className="admin-primary-action" onClick={load} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15" aria-hidden="true">
              <path d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="admin-message-filters" role="tablist" aria-label="Filter messages">
        {STATUS_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={filter === item.id ? 'is-active' : ''}
            onClick={() => setFilter(item.id)}
          >
            {item.label} ({counts[item.id]})
          </button>
        ))}
      </div>

      {notice && (
        <p className={noticeClass} role={noticeType === 'error' ? 'alert' : 'status'}>
          {notice}
        </p>
      )}

      {loading ? (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">Loading messages…</span>
          {[0, 1, 2].map((row) => (
            <div className="admin-item-skeleton" key={row}>
              <div className="w-1/3" />
              <div className="w-1/2 mt-2" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">
          <strong>No messages yet</strong>
          Submissions from the contact form will appear here.
        </div>
      ) : (
        <div className="admin-messages-layout">
          <div className="admin-message-list">
            <div className="admin-message-list-scroll">
              {visible.length === 0 ? (
                <p className="admin-message-list-empty">No {filter} messages.</p>
              ) : visible.map((message) => (
                <button
                  type="button"
                  key={message._id}
                  className={`admin-message-item${selectedId === message._id ? ' is-selected' : ''}${message.status === 'new' ? ' is-unread' : ''}`}
                  onClick={() => open(message)}
                >
                  <div className="admin-message-item-top">
                    <span className="admin-message-item-name">{message.name}</span>
                    {message.status === 'new'
                      ? <span className="admin-message-dot" aria-label="Unread" />
                      : <span className={`admin-status-badge is-${message.status}`}>{message.status}</span>}
                  </div>
                  <p className="admin-message-item-subject">{message.subject}</p>
                  <p className="admin-message-item-email">{message.email}</p>
                  <p className="admin-message-item-date">{formatDate(message.createdAt)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-message-detail">
            {selected ? (
              <>
                <div className="admin-message-detail-head">
                  <div className="min-w-0">
                    <h3 className="admin-message-detail-title">{selected.subject}</h3>
                    <div className="admin-message-meta">
                      <span>{selected.name}</span>
                      <span className="admin-message-email">&lt;{selected.email}&gt;</span>
                      <span>{formatDate(selected.createdAt)}</span>
                      <span className={`admin-status-badge is-${selected.status}`}>{selected.status}</span>
                    </div>
                  </div>
                  <div className="admin-message-actions">
                    {selected.status !== 'read' && (
                      <button type="button" disabled={busyId === selected._id} onClick={() => updateStatus(selected._id, 'read')}>
                        Mark read
                      </button>
                    )}
                    {selected.status !== 'replied' && (
                      <button type="button" disabled={busyId === selected._id} onClick={() => updateStatus(selected._id, 'replied')}>
                        Mark replied
                      </button>
                    )}
                    <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}>
                      Reply by email
                    </a>
                    <button type="button" disabled={busyId === selected._id} onClick={() => remove(selected._id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="admin-message-body">{selected.message}</div>
              </>
            ) : (
              <div className="admin-message-placeholder">
                <div>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>Select a message to read it.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminMessages;
