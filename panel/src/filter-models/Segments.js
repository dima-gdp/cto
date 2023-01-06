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
    position: 1,
    placeholder: 'Название',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: [
      { name: 'Колл центр', value: 'call_center' },
      { name: 'Маркетинг', value: 'marketing' },
      { name: 'Другое', value: 'other' },
    ],
    key: 'type',
    position: 2,
    placeholder: 'Тип',
    access: ['administrator', 'it', 'manager'],
  },
]
