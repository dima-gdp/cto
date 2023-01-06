// TODO: необходимо переделать на asyncSelect, с использованием метода api/forms getFieldTypes,
// который на данный момент отдает типы в неверном формате

const fieldTypes = [
  { name: 'Строка', value: 'string' },
  { name: 'Текст', value: 'text' },
  { name: 'Список', value: 'select' },
  { name: 'Список с мультивыбором', value: 'multiselect' },
  { name: 'Переключатели', value: 'radio' },
  { name: 'Дата', value: 'datatime' },
  { name: 'Флажки', value: 'checkbox' },
  { name: 'Телефон', value: 'phone' },
  { name: 'Файл', value: 'file' },
  { name: 'Местоположение', value: 'location' },
  { name: 'Страна', value: 'country' },
]

export default [
  {
    type: 'Input',
    key: 'id',
    position: 1,
    placeholder: 'Введите id поля',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'name',
    position: 2,
    mode: 'ilike',
    placeholder: 'Введите название поля',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: fieldTypes,
    key: 'type',
    position: 3,
    placeholder: 'Выберите тип поля',
    access: ['administrator', 'it', 'manager'],
  },
]

export { fieldTypes }
