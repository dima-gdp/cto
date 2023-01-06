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
    key: 'title',
    position: 2,
    mode: 'ilike',
    placeholder: 'Название страницы',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'event.technicalName',
    mode: 'ilike',
    position: 3,
    placeholder: 'Мероприятие',
    access: ['administrator', 'it', 'manager'],
  },
]
