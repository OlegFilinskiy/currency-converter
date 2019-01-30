const axios = require('axios');
require('bootstrap');

// Variables
const selectFrom = document.querySelector('#currencyFrom');
const selectTo = document.querySelector('#currencyTo');
const form = document.querySelector('.form');
const alert = document.querySelector('.alert-success');

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`http://www.apilayer.net/api/live?access_key=bd13c001188a317092bd4692ec4446f4&currencies=${fromCurrency}&format=1`);

    const quotes = response.data.quotes;
    const rate = 'fromCurrency + toCurrency';
    const exchangeRate = quotes[rate];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and  ${toCurrency}`);
  }
};
const fromCurrency1 = "EUR";

const response = axios.get(`http://www.apilayer.net/api/live?access_key=bd13c001188a317092bd4692ec4446f4&currencies=${fromCurrency1}&format=1`);

console.dir(response);

console.log( getExchangeRate('USD', 'EUR', 100) );
// console.log(typeof  getExchangeRate('USD', 'EUR', 100));

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);

    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * Number(exchangeRate)).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. <br>
  You can spend these in the following countries: ${countries}`;
};

// convertCurrency('USD', 'HUV', 20)
//   .then((message) => {
//     console.log(message);
//   }).catch((error) => {
//     console.log(error.message);
//   });

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
    // for (const i in obj) {
    //   const option = document.createElement('option');
    //   option.innerHTML = i;
    //   option.setAttribute('value', i);
    //
    //   selectFrom.appendChild(option);
    // }

    for (const i in obj) {
      const option = document.createElement('option');
      option.innerHTML = i;
      option.setAttribute('value', i);

      selectTo.appendChild(option);
    }
  });


// window.onload = function () {
//
// };

form.onsubmit = function (e) {
  e.preventDefault();

  const selFrom = form.elements.currencyFrom.value;
  const selTo = form.elements.currencyTo.value;
  const amount = form.elements.amount.value;

  console.log('selFrom', selFrom);
  console.log('selTo', selTo);
  console.log('amount', amount);

  convertCurrency(selFrom, selTo, amount)
    .then((message) => {
      alert.innerHTML = message;
    }).catch((error) => {
      console.log(error.message);
    });
};
