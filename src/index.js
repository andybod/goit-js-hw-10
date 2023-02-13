import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
input.addEventListener('input', debounce(getCountries, DEBOUNCE_DELAY));

function getCountries(e) {
  let inputValue = e.target.value.trim();

  if (inputValue.length === 0) {
    return;
  }
  fetchCountries(inputValue)
    .then(countries => markupSelectionCountries(countries))
    .catch(onError);
}

function markupSelectionCountries(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    getCountriesFlag(data);
  } else {
    getCountryInformation(data);
  }
}

function getCountriesFlag(countries) {
  const countryItem = countries
    .map(country => {
      return `<li class="country-item">
        <img src="${country.flags.svg}" alt="${country.name.official}" class="country-image" width="40" />
		  <span class="country-name">${country.name.official}</span>
      </li>`;
    })
    .join('');
  countryInfo.innerHTML = '';
  countryList.innerHTML = countryItem;
}

function getCountryInformation(countries) {
  let infoCountry = countries.map(country => {
    return `<div class="info-wrap">
        <img src="${country.flags.svg}" alt="${
      country.name.official
    }" class="info-logo" width="30" />
        <h2 class="info-title">${country.name.official}</h2>
      </div>
      <ul class="info-list">
        <li class="infi-item">
          <b>Capital:</b>${country.capital}
        </li>
        <li class="infi-item">
          <b>Population:</b>${country.population}
        </li>
        <li class="infi-item">
          <b>Languages:</b>${Object.values(country.languages)}
        </li>
      </ul>
		`;
  });
  countryList.innerHTML = '';
  countryInfo.innerHTML = infoCountry;
}
function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
