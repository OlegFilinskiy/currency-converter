const axios = require('axios');
require('bootstrap');

// Variables
const selectFrom = document.querySelector('#currencyFrom');
const selectTo = document.querySelector('#currencyTo');
const form = document.querySelector('.form');
const alert = document.querySelector('.alert-success');

// Get the exchange rate
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`http://www.apilayer.net/api/live?access_key=bd13c001188a317092bd4692ec4446f4&currencies=${toCurrency}&format=1`);
    const quotes = response.data.quotes;
    const rate = fromCurrency + toCurrency;
    const exchangeRate = quotes[rate];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and  ${toCurrency}`);
  }
};

// Get a list of countries
const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);

    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};
 // Convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

// Form an array of currencies for select
const getCurrency = async () => {
  try {
    const response = await axios.get('http://data.fixer.io/api/latest?access_key=fc7a503fc4c5b60087724b1ee0634d86&format=1');

    return response.data.rates;
  } catch (error) {
    throw new Error('Unable to get rates');
  }
};

// Get the list of currencies and render select
getCurrency()
  .then((obj) => {
    // This code for the multicurrency select
    // for (const i in obj) {
    //   const option = document.createElement('option');
    //   option.innerHTML = i;
    //   option.setAttribute('value', i);
    //   selectFrom.appendChild(option);
    // }

    for (const i in obj) {
      const option = document.createElement('option');
      option.innerHTML = i;
      option.setAttribute('value', i);
      selectTo.appendChild(option);
    }
  });

// This is the form handler
form.onsubmit = function (e) {
  e.preventDefault();

  const selectFrom = form.elements.currencyFrom.value;
  const selectTo = form.elements.currencyTo.value;
  const amount = form.elements.amount.value;

  // console.log('selectFrom', selectFrom);
  // console.log('selectTo', selectTo);
  // console.log('amount', amount);

  convertCurrency(selectFrom, selectTo, amount)
    .then((message) => {
      console.log( alert.style.display);
      alert.style.opacity = '1';
      alert.innerHTML = message;
    }).catch((error) => {
      console.log(error.message);
    });
};
