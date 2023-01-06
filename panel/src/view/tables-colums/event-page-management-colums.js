import { PAGE_TYPE_MAP } from '@/libs/constants'

export function eventPageManagementColums(role, eventId) {
  function textLink(role) {
    if (role === 'manager') {
      return 'Выдать доступ'
    } else {
      return 'Настройки страницы'
    }
  }
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
      title: 'Название',
      key: 'title',
      type: 'string',
      searchable: true,
      sortable: true,
      render: (h, params) => {
        if (params.row.title) {
          return h('span', `${params.row.title}`)
        } else {
          return null
        }
      },
    },
    {
      title: 'Активность',
      key: 'active',
      type: 'string',
      searchable: true,
      sortable: true,
      render: (h, params) => {
        if (params.row.active) {
          return h(
            'Tag',
            {
              props: {
                color: 'success',
              },
            },
            'Активна'
          )
        } else {
          return h(
            'Tag',
            {
              props: {
                color: 'warning',
              },
            },
            'Неактивна'
          )
        }
      },
    },
    {
      title: 'Доступность',
      key: 'limitedAccess',
      type: 'string',
      searchable: true,
      sortable: true,
      render: (h, params) => {
        if (params.row.limitedAccess) {
          return h(
            'Tag',
            {
              props: {
                color: 'warning',
              },
            },
            'ограничена'
          )
        } else {
          return h('Tag', {}, 'всем')
        }
      },
    },
    {
      title: 'Выдано доступов',
      key: 'accessCount',
      type: 'string',
      searchable: true,
      sortable: false,
      render: (h, params) => {
        if (PAGE_TYPE_MAP[params.row.type] === 'Базовая') {
          return h('span', 'всем')
        } else {
          return h('Tag', {}, params.row.accessCount)
        }
      },
    },
    {
      title: 'Тип',
      key: 'typeName',
      type: 'string',
      sortable: true,
      align: 'center',
      maxWidth: 200,
      render: (h, params) => {
        return h('Tag', {}, PAGE_TYPE_MAP[params.row.type])
      },
    },
    {
      title: '',
      key: 'active',
      type: 'string',
      sortable: false,
      align: 'center',
      maxWidth: 250,
      render: (h, params) => {
        if (PAGE_TYPE_MAP[params.row.type] === 'Базовая') {
          return h(
            'span',
            {
              style: {
                color: '#CACCCF',
              },
            },
            textLink(role)
          )
        } else if (role === 'manager' && !params.row.limitedAccess) {
          return h(
            'span',
            {
              style: {
                color: '#CACCCF',
              },
            },
            textLink(role)
          )
        } else {
          return h(
            'router-link',
            {
              props: {
                to: { path: `/events/edit/${eventId}/event-page-access/${params.row.id}` },
              },
            },
            textLink(role)
          )
        }
      },
    },
  ]
}
