import { getAllLegalEntities } from '@/api/legalEntities'
import { getEvents } from '@/api/event'
import { requestCategories } from '@/view/pages/Events/edit/Requests/requestCategories'

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
    data: requestCategories,
    key: 'base-request.category',
    position: 6,
    placeholder: 'Категория материала',
    multiple: true,
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'Input',
    key: 'base-request.name',
    position: 7,
    placeholder: 'Название материала',
    mode: 'ilike',
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
  {
    type: 'DateRange',
    key: 'created-at',
    position: 10,
    placeholder: 'Дата создания',
    mode: 'dateRange',
    access: ['administrator', 'it', 'manager'],
    placement: 'bottom',
  },
]
