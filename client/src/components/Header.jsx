import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Header = ({ onMenuClick }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <FiMenu size={24} />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* Profile Button */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors relative group"
            aria-label="Profile"
            title={`${user?.name || 'User'} - View Profile`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <FiUser size={18} className="lg:hidden" />
            </div>
            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-gray-300 capitalize">{user?.role || 'User'}</div>
              <div className="text-gray-400 text-xs mt-1">Click to view profile</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
