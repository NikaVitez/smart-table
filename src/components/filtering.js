import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.closest('.filter-wrapper');
            const input = parent?.querySelector('input');
            if (input) {
                input.value = '';
                state[input.name] = '';
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
         return data.filter(row => {
            return Object.keys(state).every(key => {
                const filterValue = state[key];

                if (!filterValue || filterValue === '') {
                    return true;
                }

                if (key === 'totalFrom' || key === 'totalTo') {
                const rowValue = parseFloat(row.total);
                const filterNum = parseFloat(filterValue);

                    if (isNaN(rowValue) || isNaN(filterNum)) {
                        return true;
                    }

                    if (key === 'totalFrom') {
                        return rowValue >= filterNum;
                    } else if (key === 'totalTo') {
                        return rowValue <= filterNum;
                    }
                }

                return compare(row, { [key]: filterValue });
            });
        });
    }
}