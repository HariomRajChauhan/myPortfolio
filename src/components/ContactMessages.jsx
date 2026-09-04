import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const ContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data.reverse()); // Show newest first
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE}/contacts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, read: true });
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return !contact.read;
    if (filter === 'read') return contact.read;
    return true;
  });

  const unreadCount = contacts.filter(c => !c.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <p className="text-gray-400 text-sm mt-1">
            {unreadCount > 0 && `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Read ({contacts.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Sidebar */}
        <div className="lg:col-span-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold">All Messages</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No messages found
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
                    selectedContact?._id === contact._id
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  } ${!contact.read ? 'bg-gray-750 border-l-4 border-l-cyan-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium ${!contact.read ? 'text-white' : 'text-gray-300'}`}>
                      {contact.name}
                    </h4>
                    {!contact.read && (
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-cyan-400 text-sm mb-1">{contact.email}</p>
                  <p className="text-gray-400 text-sm line-clamp-1">{contact.subject}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {selectedContact ? (
            <>
              <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedContact.subject}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-cyan-400">From: {selectedContact.name}</span>
                    <span className="text-gray-400">&lt;{selectedContact.email}&gt;</span>
                    <span className="text-gray-500">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!selectedContact.read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContact._id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-xl font-medium mb-2">Select a message to read</p>
                <p className="text-sm">Click on any message from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
