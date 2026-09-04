import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, adminName }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'certificates', label: 'Certificates', icon: '🏆' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💪' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'contacts', label: 'Contact Messages', icon: '📧' },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Hariom Chauhan
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{adminName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
