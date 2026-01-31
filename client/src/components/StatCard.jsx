import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', onClick }) => {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  };

  return (
    <div 
      className={`card transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105 hover:border-primary-300 dark:hover:border-primary-700' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2 space-x-1">
              {trend === 'up' ? (
                <FiTrendingUp className="text-green-500" size={16} />
              ) : (
                <FiTrendingDown className="text-red-500" size={16} />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} transition-transform ${onClick ? 'group-hover:scale-110' : ''}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
