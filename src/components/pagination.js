import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
  pages.firstElementChild.remove(); // и удаляем его

  return (data, state, action) => {
    let pageCount;

    const applyPagination = (query, state, action) => {
      const limit = state.rowsPerPage;
      let page = state.page;

      // переносим код, который делали под @todo: #2.6
      if (action)
        switch (action.name) {
          case "prev":
            page = Math.max(1, page - 1);
            break; // переход на предыдущую страницу
          case "next":
            page = Math.min(pageCount, page + 1);
            break; // переход на следующую страницу
          case "first":
            page = 1;
            break; // переход на первую страницу
          case "last":
            page = pageCount;
            break; // переход на последнюю страницу
        }

      return Object.assign({}, query, {
        // добавим параметры к query, но не изменяем исходный объект
        limit,
        page,
      });
    };

    const updatePagination = (total, { page, limit }) => {
      pageCount = Math.ceil(total / limit);

      // переносим код, который делали под @todo: #2.4
      // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
      // @todo: #2.4 — получить список видимых страниц и вывести их
      const visiblePages = getPages(page, pageCount, 5);
      pages.replaceChildren(
        ...visiblePages.map((pageNumber) => {
          const el = pageTemplate.cloneNode(true);
          return createPage(el, pageNumber, pageNumber === page);
        }),
      );

      // // @todo: #2.5 — обновить статус пагинации
      fromRow.textContent = (page - 1) * limit + 1;
      toRow.textContent = Math.min(page * limit, total);
      totalRows.textContent = total;
    };

    return {
      updatePagination,
      applyPagination,
    };
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    // const rowsPerPage = state.rowsPerPage;
    // const pageCount = Math.ceil(data.length / rowsPerPage);
    // let page = state.page;

    // // @todo: #2.6 — обработать действия
    // if (action) switch (action.name) {
    //     case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
    //     case 'next': page = Math.min(pageCount, page + 1); break;    // переход на следующую страницу
    //     case 'first': page = 1; break;                                // переход на первую страницу
    //     case 'last': page = pageCount; break;                         // переход на последнюю страницу
    // }

    // // @todo: #2.4 — получить список видимых страниц и вывести их
    // const visiblePages = getPages(page, pageCount, 5);
    // pages.replaceChildren(...visiblePages.map(pageNumber => {
    //     const el = pageTemplate.cloneNode(true);
    //     return createPage(el, pageNumber, pageNumber === page);
    // }));

    // // @todo: #2.5 — обновить статус пагинации
    // fromRow.textContent = (page - 1) * rowsPerPage + 1;
    // toRow.textContent = Math.min((page * rowsPerPage), data.length);
    // totalRows.textContent = data.length;

    // // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    // const skip = (page - 1) * rowsPerPage;
    // return data.slice(skip, skip + rowsPerPage);
  };
};
