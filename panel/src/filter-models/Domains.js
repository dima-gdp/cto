import { getAuthGroups } from '@/api/authGroups'

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
    position: 2,
    placeholder: 'Введите домен',
    mode: 'ilike',
    access: ['administrator', 'it', 'manager'],
  },
  {
    type: 'AsyncSelect',
    dataSource: getAuthGroups,
    valueKey: 'id',
    nameKey: 'name',
    key: 'auth_group_id',
    position: 4,
    placeholder: 'База пользователей',
    multiple: false,
    access: ['administrator', 'it', 'manager'],
  },
]
