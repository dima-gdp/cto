cy.common = {
  parseMeta: (meta) => {
    // Узнаем какое кол-во элементов должно отобразиться на странице
    const perPage = meta['total-count'] > meta['per-page'] ? meta['per-page'] : meta['total-count']
    // Узнаем общее кол-во элементов
    const totalCount = meta['total-count']
    // Узнаем общее кол-во страниц
    const pageCount = meta['page-count']

    return {
      perPage,
      totalCount,
      pageCount,
    }
  },
}
