// Exchange rates relative to 1 USD
const exchangeRates = {
  USD: 1.0,
  INR: 83.2,
  AED: 3.67,
  KES: 132.5,
  NGN: 1450.0,
  GBP: 0.79,
  EUR: 0.92,
  SAR: 3.75
};

// @desc    Convert procedure costs into foreign currencies
// @route   GET /api/currency/convert
// @access  Public
const convertCurrency = async (req, res, next) => {
  try {
    const { amountUSD, targetCurrency } = req.query;

    const usd = Number(amountUSD) || 1000;
    const currency = (targetCurrency || 'INR').toUpperCase();

    const rate = exchangeRates[currency] || exchangeRates.INR;
    const convertedAmount = (usd * rate).toFixed(2);

    res.status(200).json({
      success: true,
      baseAmountUSD: usd,
      targetCurrency: currency,
      exchangeRate: rate,
      convertedAmount: Number(convertedAmount),
      availableCurrencies: Object.keys(exchangeRates)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  convertCurrency
};
