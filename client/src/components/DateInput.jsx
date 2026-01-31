import { useState } from 'react';
import { getDateValidationError } from '../utils/dateValidation';

const DateInput = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  className = '', 
  placeholder = '',
  name = '',
  ...props 
}) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Validate the date
    const validationError = getDateValidationError(newValue);
    setError(validationError || '');
    
    // Call the parent onChange
    if (onChange) {
      onChange(e);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-500 dark:border-red-500' : ''} ${className}`}
        min="1900-01-01"
        max={`${currentYear + 10}-12-31`}
        {...props}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Please enter a valid date with 4-digit year (YYYY-MM-DD)
      </p>
    </div>
  );
};

export default DateInput;