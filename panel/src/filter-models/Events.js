export default [
  {
    type: 'Input',
    key: 'id',
    position: 2,
    placeholder: 'ID',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'technical-name',
    position: 3,
    placeholder: 'Техническое название',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: [
      { value: 'cabinet', name: 'Кабинет' },
      { value: 'occasion', name: 'Событие' },
    ],
    key: 'type',
    position: 3,
    placeholder: 'Выберите тип мероприятия',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: [
      { value: 'true', name: 'Активен' },
      { value: 'false', name: 'Не активен' },
    ],
    key: 'active',
    position: 4,
    placeholder: 'Активность',
    access: ['administrator', 'it', 'manager'],
  },
]
