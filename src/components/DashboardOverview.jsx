import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCertificates: 0,
    totalContacts: 0,
    totalVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [projectsRes, certificatesRes, contactsRes, visitsRes] = await Promise.all([
        axios.get(`${API_BASE}/projects`, { headers }),
        axios.get(`${API_BASE}/certificates`, { headers }),
        axios.get(`${API_BASE}/contacts`, { headers }),
        axios.get(`${API_BASE}/visit`, { headers }),
      ]);

      setStats({
        totalProjects: projectsRes.data.length,
        totalCertificates: certificatesRes.data.length,
        totalContacts: contactsRes.data.length,
        totalVisits: visitsRes.data.count || 0,
      });

      // Get last 5 contacts
      setRecentContacts(contactsRes.data.slice(-5).reverse());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="💼"
          color="bg-gradient-to-r from-cyan-500 to-blue-500"
        />
        <StatCard
          title="Certificates"
          value={stats.totalCertificates}
          icon="🏆"
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          title="Contact Messages"
          value={stats.totalContacts}
          icon="📧"
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Visits"
          value={stats.totalVisits}
          icon="👁️"
          color="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      {/* Recent Contacts */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Recent Contact Messages</h2>
        {recentContacts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No contact messages yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact._id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3">{contact.name}</td>
                    <td className="py-3 text-cyan-400">{contact.email}</td>
                    <td className="py-3">{contact.subject}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <p className="font-medium mb-1">➕ Add New Project</p>
            <p className="text-sm text-gray-400">Create a new project entry</p>
          </button>
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <p className="font-medium mb-1">🏆 Add Certificate</p>
            <p className="text-sm text-gray-400">Add a new certification</p>
          </button>
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <p className="font-medium mb-1">📊 View Analytics</p>
            <p className="text-sm text-gray-400">Detailed visitor statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
