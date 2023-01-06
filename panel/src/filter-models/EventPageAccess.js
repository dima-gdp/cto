export default [
  {
    type: 'Input',
    key: 'id',
    position: 1,
    placeholder: 'id',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'user.email',
    position: 1,
    placeholder: 'email',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
]
