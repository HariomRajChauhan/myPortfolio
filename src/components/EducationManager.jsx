import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    expected: false,
    description: '',
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/education`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEducation(response.data);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (edu = null) => {
    if (edu) {
      setEditingEdu(edu);
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field || '',
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
        expected: edu.expected || false,
        description: edu.description || '',
      });
    } else {
      setEditingEdu(null);
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        expected: false,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEdu(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      expected: false,
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingEdu) {
        await axios.put(`${API_BASE}/education/${editingEdu._id}`, formData, { headers });
      } else {
        await axios.post(`${API_BASE}/education`, formData, { headers });
      }

      fetchEducation();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save education:', error);
      alert('Failed to save education. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE}/education/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEducation();
    } catch (error) {
      console.error('Failed to delete education:', error);
      alert('Failed to delete education. Please try again.');
    }
  };

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
        <h2 className="text-2xl font-bold">Education Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-lg font-medium transition-all"
        >
          ➕ Add New Education
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>
                  <p className="text-lg text-cyan-400 mb-1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : 'Start date not set'}
                    {' - '}
                    {edu.endDate 
                      ? new Date(edu.endDate).toLocaleDateString()
                      : edu.expected 
                        ? 'Expected' 
                        : 'Present'
                    }
                    {edu.expected && ' (Expected)'}
                  </p>
                  {edu.description && (
                    <p className="text-gray-400 text-sm max-w-2xl">{edu.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(edu)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingEdu ? 'Edit Education' : 'Add New Education'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Degree *</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., B.E., Bachelor of Engineering"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  placeholder="e.g., Computer Engineering"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="expected"
                  checked={formData.expected}
                  onChange={(e) => setFormData({ ...formData, expected: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="expected" className="ml-2 text-sm font-medium">Currently Studying (Expected)</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-lg transition-all"
                >
                  {editingEdu ? 'Update Education' : 'Create Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManager;
