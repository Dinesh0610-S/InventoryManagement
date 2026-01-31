/**
 * Format currency in Indian Rupees (₹)
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const numAmount = parseFloat(amount);
  
  if (showDecimals) {
    return `₹${numAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else {
    return `₹${Math.round(numAmount).toLocaleString('en-IN')}`;
  }
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string like "₹1,234.56"
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  const cleaned = currencyString.replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
};
