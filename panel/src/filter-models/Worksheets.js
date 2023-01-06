import { getAllLegalEntities } from '@/api/legalEntities'
import { getEvents } from '@/api/event'

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
    key: 'lastName',
    position: 2,
    placeholder: 'Фамилия',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'firstName',
    position: 3,
    placeholder: 'Имя',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'middleName',
    position: 4,
    placeholder: 'Отчество',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'user.email',
    position: 5,
    placeholder: 'Email',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'phone',
    position: 6,
    placeholder: 'Телефон',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'AsyncSelect',
    dataSource: getAllLegalEntities,
    valueKey: 'id',
    nameKey: 'name',
    key: 'event.legal-entity-id',
    position: 7,
    placeholder: 'Юр. лицо',
    multiple: false,
    access: ['administrator', 'it'],
  },
  {
    type: 'AsyncSelect',
    dataSource: (params) => {
      return getEvents({
        ...params,
        fields: {
          event: ['id', 'technical-name'],
        },
      })
    },
    valueKey: 'id',
    nameKey: 'technicalName',
    key: 'event_id',
    position: 8,
    placeholder: 'Мероприятие',
    multiple: true,
    access: ['administrator', 'it'],
  },
  {
    type: 'DateRange',
    key: 'created-at',
    position: 9,
    placeholder: 'Дата создания',
    mode: 'dateRange',
    placement: 'bottom-start',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'comment',
    position: 10,
    placeholder: 'Комментарий',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
]
