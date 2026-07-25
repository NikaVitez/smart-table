import './fonts/ys-display/fonts.css'
import './style.css'
import {initPagination} from "./components/pagination.js";
import {data as sourceData} from "./data/dataset_1.js";
import {initSorting} from './components/sorting.js';
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initFiltering} from './components/filtering.js';
import {initTable} from "./components/table.js";
import { rules } from './lib/compare.js';
import { initSearching } from './components/searching.js';
// @todo: подключение


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySearching(result, state, action);

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
const applyPagination = initPagination(
    sampleTable.pagination.elements,             
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

const applySearching = initSearching('search', (data, state) => {
    const searchTerm = state.search || '';

    if(!searchTerm) {
        return data;
    }

    return data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
});

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
