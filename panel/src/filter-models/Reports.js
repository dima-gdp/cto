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
    key: 'report-name',
    mode: 'ilike',
    position: 1,
    placeholder: 'Наименование',
    access: ['administrator', 'it', 'manager'],
  },
]
