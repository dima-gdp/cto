export default [
  {
    type: 'Radio',
    key: 'type',
    position: 1,
    data: [
      { name: 'Все', value: '', default: true },
      { name: 'Формы регистрации', value: 'registration', default: false },
      { name: 'Формы материалов', value: 'request', default: false },
    ],
    default: '',
    cols: 7,
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'name',
    position: 2,
    mode: 'ilike',
    placeholder: 'Введите название формы',
    access: ['administrator', 'it', 'manager'],
  },
]
