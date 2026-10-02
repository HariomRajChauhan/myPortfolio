import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'projects', label: 'Projects', icon: '💼' },
  { id: 'certificates', label: 'Certificates', icon: '🏆' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'experience', label: 'Experience', icon: '💪' },
  { id: 'videos', label: 'Videos', icon: '🎬' },
  { id: 'contacts', label: 'Contact Messages', icon: '📧' },
];

const AdminSidebar = ({ activeTab, setActiveTab, adminName, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (id) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin sections"
        className={`fixed top-0 left-0 z-50 flex h-[100dvh] w-[17rem] max-w-[85vw] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-gray-700 bg-gray-800 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:max-w-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-700 p-4 sm:p-6">
          <div className="min-w-0">
            <Link
              to="/"
              onClick={onClose}
              className="block truncate text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent sm:text-xl"
            >
              Hariom Chauhan
            </Link>
            <p className="mt-1 text-xs text-gray-400">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-700 hover:text-white lg:hidden"
          >
            <span aria-hidden="true" className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg leading-none" aria-hidden="true">{item.icon}</span>
                  <span className="min-w-0 truncate font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{adminName}</p>
              <p className="truncate text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;