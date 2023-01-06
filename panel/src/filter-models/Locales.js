export default [
  {
    type: 'Input',
    key: 'key',
    position: 1,
    placeholder: 'Ключ',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'value',
    position: 2,
    placeholder: 'Значение',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
]
