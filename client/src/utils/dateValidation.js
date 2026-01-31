// Date validation utilities

/**
 * Validates if a date string has a 4-digit year
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} - True if valid 4-digit year, false otherwise
 */
export const validateFourDigitYear = (dateString) => {
  if (!dateString) return true; // Allow empty dates
  
  const yearMatch = dateString.match(/^(\d{4})-\d{2}-\d{2}$/);
  if (!yearMatch) return false;
  
  const year = parseInt(yearMatch[1]);
  return year >= 1000 && year <= 9999;
};

/**
 * Validates if a year is within reasonable range
 * @param {number|string} year - Year to validate
 * @returns {boolean} - True if valid year range, false otherwise
 */
export const validateYearRange = (year) => {
  const yearNum = typeof year === 'string' ? parseInt(year) : year;
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear + 10;
};

/**
 * Formats date input to ensure 4-digit year
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date string or empty if invalid
 */
export const formatDateInput = (dateString) => {
  if (!dateString) return '';
  
  // If it's already in correct format, validate and return
  if (validateFourDigitYear(dateString)) {
    return dateString;
  }
  
  return '';
};

/**
 * Gets error message for invalid date
 * @param {string} dateString - Date string to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getDateValidationError = (dateString) => {
  if (!dateString) return null;
  
  if (!validateFourDigitYear(dateString)) {
    return 'Please enter a valid date with 4-digit year (YYYY-MM-DD)';
  }
  
  const year = parseInt(dateString.substring(0, 4));
  if (!validateYearRange(year)) {
    const currentYear = new Date().getFullYear();
    return `Year must be between 1900 and ${currentYear + 10}`;
  }
  
  return null;
};