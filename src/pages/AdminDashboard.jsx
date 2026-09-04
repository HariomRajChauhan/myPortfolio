import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [visitStats, setVisitStats] = useState({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'contacts':
          const contactsRes = await axios.get('/api/admin/contacts', config);
          setContacts(contactsRes.data);
          break;
        case 'projects':
          const projectsRes = await axios.get('/api/admin/projects', config);
          setProjects(projectsRes.data);
          break;
        case 'certificates':
          const certsRes = await axios.get('/api/admin/certificates', config);
          setCertificates(certsRes.data);
          break;
        case 'analytics':
          const visitRes = await axios.get('/api/admin/analytics', config);
          setVisitStats(visitRes.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    
    try {
      await axios.delete(`/api/admin/contacts/${id}`, config);
      setMessage({ type: 'success', text: 'Contact deleted successfully' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete contact' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(`/api/admin/projects/${id}`, config);
      setMessage({ type: 'success', text: 'Project deleted successfully' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await axios.delete(`/api/admin/certificates/${id}`, config);
      setMessage({ type: 'success', text: 'Certificate deleted successfully' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete certificate' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const tabs = [
    { id: 'contacts', label: 'Contact Messages', count: contacts.length },
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'certificates', label: 'Certificates', count: certificates.length },
    { id: 'analytics', label: 'Analytics', count: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                {tabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                View Site
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : 'bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500 text-green-400'
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p>No contact messages yet</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                          <p className="text-cyan-400 text-sm">{contact.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack?.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Featured: {project.featured ? 'Yes' : 'No'}</span>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div key={cert._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                      <button
                        onClick={() => handleDeleteCertificate(cert._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-cyan-400 text-sm mb-2">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm mb-3">{new Date(cert.date).toLocaleDateString()}</p>
                    {cert.credentialURL && (
                      <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        View Credential →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Total Visits</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {visitStats.total}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Visits Today</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      {visitStats.today}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-cyan-400">{projects.length}</p>
                      <p className="text-gray-500 text-sm">Projects</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">{certificates.length}</p>
                      <p className="text-gray-500 text-sm">Certificates</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-pink-400">{contacts.length}</p>
                      <p className="text-gray-500 text-sm">Messages</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{Math.round(visitStats.total / Math.max(visitStats.today, 1))}x</p>
                      <p className="text-gray-500 text-sm">Avg Daily</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
