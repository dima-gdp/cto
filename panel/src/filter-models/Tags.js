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
    mode: 'ilike',
    position: 2,
    placeholder: 'Название тега',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'slug',
    mode: 'ilike',
    position: 3,
    placeholder: 'Tag',
    access: ['administrator', 'it', 'manager'],
  },
]
