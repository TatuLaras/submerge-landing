// ! Requirements
// Elements used
var searchFieldDOM = document.querySelector('#searchField');
var searchSuggestionListDOM = document.querySelector('#searchSuggestionList');
var searchFormDOM = document.querySelector('#searchForm');
var selectedLanguageNameDOM = document.querySelector('#selectedLanguageName');
var selectedLanguageDOM = document.querySelector('#selectedLanguage');

// ! ---

// List item HTML template
const applyListItemTemplate = (name, id, i) => {
    return `<li class='search-suggestion list-group-item bg-dark text-light border-secondary d-flex flex-row justify-content-start align-items-center' id='result-${i}' data-name='${name}' data-id='${id}' onclick="selectOption(document.querySelector('#result-${i}'))">
                    <img src='${'https://dogtime.com/assets/uploads/2011/03/puppy-development.jpg'}' height='25px' width='25px' class='d-none'>
                    <span class='fw-bold ms-1'>${name}</span>
                </li>`;
};

const hideList = () => {
    // Reset keyboard navigation
    activeId = -1;
    document.querySelectorAll('.search-suggestion').forEach((s) => s.classList.remove('active'));

    // Hide suggestion list
    searchSuggestionListDOM.classList.add('visually-hidden');
};

const selectOption = (elm) => {
    searchSuggestionListDOM.innerHTML = '';
    activeId = -1;

    // Select actions
    searchFieldDOM.value = '';
    selectedLanguageNameDOM.innerHTML = elm.getAttribute('data-name');
    selectedLanguageDOM.value = elm.getAttribute('data-id');
};

// Variables

// Currently selected list item id number
var activeId = -1;

// Last id for keyboard navigation
var lastId = 0;

// When search field value changes
searchFieldDOM.oninput = () => {
    // Reset keyboard navigation
    activeId = -1;

    // If nothing in field, don't bother
    if (searchFieldDOM.value.length == 0) return;

    // Fetch search results from DB
    fetch(`/api/search/languages/${searchFieldDOM.value}`)
        .then((response) => response.json())
        .then((data) => {
            // Reset suggestion list
            searchSuggestionListDOM.innerHTML = '';
            if (data[0].length > 0) {
                // Last id for keyboard navigation
                lastId = 0;
                // Fill suggestion list with search results
                data[0].forEach((l, i) => {
                    searchSuggestionListDOM.innerHTML += applyListItemTemplate(l.name, l.id, i);
                    lastId++;
                });
            }
        });
};

// Unhide list if it gains focus
searchFieldDOM.onfocus = () => {
    searchSuggestionListDOM.classList.remove('visually-hidden');
};

// Hide suggestion list when search field or the list loses focus
document.onclick = () => {
    if (!searchFormDOM.contains(document.activeElement)) {
        hideList();
    }
};

// Keyboard navigation, up and down arrow + enter
document.onkeydown = (e) => {
    if (searchSuggestionListDOM.classList.contains('visually-hidden')) return;

    // Which key was pressed
    switch (e.key) {
        case 'ArrowUp':
            if (activeId <= 0) return;
            activeId--;
            break;

        case 'ArrowDown':
            if (activeId >= lastId - 1) return;
            activeId++;
            break;

        case 'Enter':
            selectOption(document.querySelector(`#result-${activeId}`));
            return;
    }

    // Remove active styling class from all list elements so only one will be highlighted
    document.querySelectorAll('.search-suggestion').forEach((s) => s.classList.remove('active'));

    if (activeId >= 0) {
        document.querySelector(`#result-${activeId}`).classList.add('active');
    }
};
