import { fromISOToString } from '@/libs/util'

export function eventPageAccessColumns() {
  return [
    {
      title: 'ID',
      key: 'id',
      type: 'integer',
      searchable: true,
      sortable: true,
      sortType: 'desc',
      maxWidth: 70,
    },
    {
      title: 'E-mail',
      key: 'email',
      type: 'string',
      searchable: true,
      sortable: true,
      render: (h, params) => {
        if (params.row.user?.email) {
          return h('span', `${params.row.user.email}`)
        } else {
          return null
        }
      },
    },
    {
      title: 'База пользователей',
      key: 'users',
      type: 'string',
      sortable: true,
      align: 'center',
      maxWidth: 200,
      render: (h, params) => {
        return h('span', {}, params.row.user.authGroupId)
      },
    },
    {
      title: 'Дата выдачи',
      key: 'createdAt',
      type: 'string',
      sortable: true,
      align: 'center',
      maxWidth: 250,
      render: (h, params) => {
        return h('span', fromISOToString(params.row.createdAt))
      },
    },
    {
      title: 'Кто выдал',
      key: 'creator',
      type: 'string',
      sortable: true,
      align: 'center',
      maxWidth: 250,
      render: (h, params) => {
        return h('span', {}, `${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`)
      },
    },
    {
      title: '',
      slot: 'actions',
      align: 'center',
      maxWidth: 70,
      options: [
        {
          name: 'Удаление',
          action: 'on-delete',
          style: {
            color: '#ed4014',
          },
          access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
        },
      ],
    },
  ]
}
