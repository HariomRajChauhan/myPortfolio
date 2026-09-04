import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
  });
  const [achievementInput, setAchievementInput] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/experience`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperiences(response.data);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        title: exp.title,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
        current: exp.current || false,
        description: exp.description || '',
        achievements: exp.achievements || [],
      });
    } else {
      setEditingExp(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExp(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setAchievementInput('');
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()]
      });
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (achievement) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(a => a !== achievement)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingExp) {
        await axios.put(`${API_BASE}/experience/${editingExp._id}`, formData, { headers });
      } else {
        await axios.post(`${API_BASE}/experience`, formData, { headers });
      }

      fetchExperiences();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE}/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExperiences();
    } catch (error) {
      console.error('Failed to delete experience:', error);
      alert('Failed to delete experience. Please try again.');
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
        <h2 className="text-2xl font-bold">Experience Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-lg font-medium transition-all"
        >
          ➕ Add New Experience
        </button>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                  <p className="text-lg text-cyan-400 mb-1">{exp.company}</p>
                  {exp.location && (
                    <p className="text-gray-400 text-sm mb-2">📍 {exp.location}</p>
                  )}
                  <p className="text-gray-400 text-sm mb-3">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'Start date not set'}
                    {' - '}
                    {exp.endDate 
                      ? new Date(exp.endDate).toLocaleDateString()
                      : exp.current 
                        ? 'Present' 
                        : 'End date not set'
                    }
                    {exp.current && ' (Current)'}
                  </p>
                  {exp.description && (
                    <p className="text-gray-400 text-sm mb-3 max-w-2xl">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(exp)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
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
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
              <h3 className="text-xl font-bold">
                {editingExp ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company/Organization *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Dharan, Nepal"
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
                    disabled={formData.current}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 ${formData.current ? 'opacity-50' : ''}`}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="current" className="ml-2 text-sm font-medium">Currently Working Here</label>
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

              <div>
                <label className="block text-sm font-medium mb-1">Key Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                    placeholder="Add an achievement"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index} className="bg-green-900 text-green-300 px-3 py-2 rounded-lg text-sm flex items-center justify-between">
                      <span>{achievement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(achievement)}
                        className="ml-2 hover:text-white"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
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
                  {editingExp ? 'Update Experience' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
