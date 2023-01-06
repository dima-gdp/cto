export default [
  {
    type: 'Input',
    key: 'id',
    position: 1,
    placeholder: 'ID',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'name',
    position: 2,
    mode: 'ilike',
    placeholder: 'Название',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'key',
    position: 3,
    mode: 'ilike',
    placeholder: 'Ключ',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: [
      { value: 'yandex', name: 'yandex' },
      { value: 'google', name: 'google' },
    ],
    key: 'type',
    position: 4,
    placeholder: 'Выберите тип метрики',
    access: ['administrator', 'it', 'manager'],
  },
]
