# Описание фильтра

## Модель конфига

| Поле        | Описание                                                                         |
| ----------- | -------------------------------------------------------------------------------- |
| type        | Тип компонента, который будет рендериться.                                       |
| key         | Ключ который передается в get-парамерт запроса.                                  |
| position    | Порядок сортировки полей в данном фильтре.                                       |
| placeholder | Плейсхолдер для отображения.                                                     |
| mode        | Необязателен. Может принимать значения: `ilike, dateRange`.                      |
| searchable  | Только для tables_v2. Принимает `true` или ` false`. Влияет на отображение в фильтре.|
| className   | Может примимать `String` или `Array`. Задает кастомный класс/классы для фильтра. |
| placement   | Позиция select'a. См https://www.iviewui.com/docs/guide/install-en               |
| access      | Массив с доступными ролями.                                                      |
| dataSource  | Метод загрузки данные для `AsyncSelect`.                                         |
| data        | Данные для обычного `Select` в формате `{ name, value }`.                        |
| valueKey    | Ключ для `value` в `AsyncSelect`.                                                |
| nameKey     | Ключ для `name` в `AsyncSelect`.                                                 |

## Доступные компоненты

| Компонент   | Спицифичные поля                           |
| ----------- | ------------------------------------------ |
| Input       | `mode`                                     |
| Select      | `data, placement`                          |
| AsyncSelect | `dataSource, placement, valueKey, nameKey` |
| DateRange   | `mode, placement`                          |
