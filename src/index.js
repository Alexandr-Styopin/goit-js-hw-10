import { debounce } from 'debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
};

refs.searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function clearList() {
    refs.countryList.innerHTML = ''
}

function onSearchInput(e) {
    const searchValue = e.target.value.trim();

    if (searchValue === "") {
        clearList()
        return
    }
    
    fetchCountries(searchValue)
    .then(renderCard)
    .catch(err => {
        if (err) {
            clearList();
            Notiflix.Notify.failure("Oops, there is no country with that name");
        }
        console.log(err);
    });

};

const cardTemplate = ({
    name: {official},
    flags: {svg},
    capital,
    population,
    languages,}) =>
        `
        <li class="country-card">
            <div class="card-wrapper">
                <img 
                class="country-img"
                src="${svg}" 
                alt="${official}"
                width ="30px">
                <p class="country-name">${official}</p>
            </div>
          <ul class="country-info">
            <li class="country-item"><span class="item-text">Capitl:</span> ${capital}</li>
            <li class="country-item"><span class="item-text">Population:</span> ${population}</li>
            <li class="country-item"><span class="item-text">Languages:</span> ${Object.values(languages)}</li>
          </ul>
        </li>  
        `;

const previewTemlate = ({
    name: {official},
    flags: {svg},
    capital,
    population,
    languages, }) => 
        `
        <li class="country-preview">
                <img 
                    class="preview-img"
                    src="${svg}" 
                    alt="${official}"
                    width ="30px">   
                <p class="preview-name">${official}</p>
        </li>`;

function renderCard(countries) {

    if (countries.length >= 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        clearList();
        return;
    } 

    const countryEl = countries.map(country => {

       if (countries.length >= 2) {
            clearList();
            return previewTemlate(country);

        } else if (countries.length === 1) {
            clearList();
            return cardTemplate(country);
        };
    });
    
    refs.countryList.insertAdjacentHTML('beforeend', countryEl.join(''));
    
};

Notiflix.Notify.init({
    position:'center-top'
});