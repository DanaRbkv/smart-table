import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
// const {data, ...indexes} = initData(sourceData);
const API = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  //let result = [...data]; // копируем для последующего изменения
  let query = {};
  // @todo: использование
  //    result = applySearching(result, state, action);
  //     result = applyFiltering(result, state, action);
  //     result = applySorting(result, state, action);
  //     result = applyPagination(result, state, action);
  query = applyPagination(query, state, action); // обновляем query
  const { total, items } = await API.getRecords(query);
  updatePagination(total, query);
  sampleTable.render(items);
}

// @todo: инициализация
const applySearching = initSearching("search");

// const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
//     searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
// });

const applySorting = initSorting([
  // передаём массив элементов, которые вызывают сортировку
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
)();

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await API.getIndexes();
}
//render();
init().then(render);
