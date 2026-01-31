import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res.success) {
        setUserDetails(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
      // Fallback to stored user data
      if (user) {
        setUserDetails(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Note: Update profile API endpoint would need to be added to backend
    // For now, we'll just show a message
    toast.success('Profile update feature coming soon!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userDetails?.name || user?.name || '',
      email: userDetails?.email || user?.email || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const displayUser = userDetails || user;
  const userInitial = displayUser?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiUser className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your account information</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiEdit2 size={18} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-4xl font-bold text-primary-600 dark:text-primary-400 border-4 border-primary-200 dark:border-primary-800">
              {userInitial}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </button>
                  <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
                    <FiX size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {displayUser?.name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {displayUser?.role ? displayUser.role.charAt(0).toUpperCase() + displayUser.role.slice(1) : 'User'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FiMail className="text-gray-600 dark:text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-gray-100">{displayUser?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FiShield className="text-gray-600 dark:text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                      <p className="text-gray-900 dark:text-gray-100 capitalize">
                        {displayUser?.role || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {displayUser?.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FiCalendar className="text-gray-600 dark:text-gray-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(displayUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FiUser className="text-gray-600 dark:text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {displayUser?._id?.substring(0, 8) || 'N/A'}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 rounded-full text-sm font-medium capitalize">
                {displayUser?.role || 'User'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">—</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full btn-secondary text-left p-3">
              <div className="font-medium">Change Password</div>
              <div className="text-sm opacity-75">Update your account password</div>
            </button>
            <button className="w-full btn-secondary text-left p-3">
              <div className="font-medium">Account Settings</div>
              <div className="text-sm opacity-75">Manage your preferences</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
