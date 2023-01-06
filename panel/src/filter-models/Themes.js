export default [
  {
    type: 'Input',
    key: 'name',
    position: 1,
    placeholder: 'Название темы',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
]
