export const mockHeaderMenuFixture = [
  {
    title: 'Первый уровень!',
    url: '/fewfew',
    id: 1,
    type: 'url',
    children: [
      { title: 'Второй уровень Первый уровень Первый уровень', url: '#', id: 346, type: 'url' },
      { title: 'Второй уровень', url: '#', type: 'page', id: 2564 },
    ],
  },
  { title: 'Профиль', id: 3, url: '/event/1/profile', type: 'url' },
  { title: 'Google', url: 'https://www.google.com/', id: 4, type: 'page' },
  {
    title: 'Крайняя ссылка',
    url: '#',
    id: 100,
    type: 'page',
    children: [
      { title: 'Профиль', url: '/event/1/profile', id: 253, type: 'url' },
      { title: 'Google', url: 'https://www.google.com/', id: 2114, type: 'page' },
    ],
  },
]
