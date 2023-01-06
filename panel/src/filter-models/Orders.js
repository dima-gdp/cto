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
    key: 'user.lastName',
    position: 2,
    placeholder: 'Фамилия',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'user.firstName',
    position: 3,
    placeholder: 'Имя',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'user.middleName',
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
    type: 'Select',
    data: [
      { name: 'Создан', value: 'created' },
      { name: 'Отменен', value: 'canceled' },
    ],
    key: 'status',
    position: 6,
    placeholder: 'Статус заказа',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Select',
    data: [
      { name: 'Оплачен', value: '1' },
      { name: 'Не оплачен', value: '0' },
    ],
    key: 'paid',
    position: 7,
    placeholder: 'Статус оплаты',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'AsyncSelect',
    dataSource: getAllLegalEntities,
    valueKey: 'id',
    nameKey: 'name',
    key: 'event.legal-entity-id',
    position: 8,
    placeholder: 'Юр. лицо',
    multiple: false,
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
    key: 'event.id',
    position: 10,
    placeholder: 'Мероприятие',
    multiple: true,
    access: ['administrator'],
  },
]
