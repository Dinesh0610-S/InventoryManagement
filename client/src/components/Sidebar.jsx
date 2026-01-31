import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiPackage,
  FiTag,
  FiTruck,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', icon: FiLayout, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
    { path: '/suppliers', icon: FiTruck, label: 'Suppliers' },
    { path: '/inventory', icon: FiFileText, label: 'Inventory Logs' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Inventory
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* User Info - Clickable to Profile */}
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="p-4 border-b border-gray-200 dark:border-gray-700 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            title="Click to view profile"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <FiUser className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" size={16} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-13 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view profile
            </p>
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
