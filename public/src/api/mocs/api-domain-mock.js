export const mockApiDomainGetMany = {
  data: [
    {
      name: 'reg.100metrovka.com',
      authGroupId: 20,
      id: '49',
      event: {
        id: '1',
        active: true,
        defaultLanguage: 'ru',
        availableLanguages: ['ru', 'en'],
        meta: {
          languages: ['ru', 'en'],
        },
      },
    },
  ],
  meta: {
    totalCount: 1,
    pageCount: 1,
    currentPage: 1,
    perPage: 20,
  },
  status: 200,
}
