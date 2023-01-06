<template>
  <div>
    <Card>
      <Button type="primary" icon="md-add" class="ivu-card-body__btn-create" to="/imports/create">
        Создать импорт
      </Button>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { getImportList } from '@/api/imports'
import { getDate } from '@/libs/tools'
export default {
  name: 'ImportsList',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        include: 'user',
        filter: {},
        sort: '-id',
      },
      tableData: [],
      tableMeta: {},
      loading: true,
    }
  },
  computed: {
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          type: 'integer',
          sortable: true,
          searchable: true,
          width: 65,
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          sortable: true,
          width: 150,
          render: (h, params) => {
            return h('span', getDate(params.row.createdAt))
          },
        },
        {
          title: 'Файл импорта',
          key: 'file',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            return h(
              'a',
              {
                attrs: {
                  class: 'ivu-btn ivu-btn-primary ivu-btn-circle',
                  href: `${params.row.file.baseUrl}${params.row.file.path}`,
                },
              },
              `${params.row.importName}`
            )
          },
        },
        {
          title: 'Статус',
          key: 'email',
          type: 'string',
          sortable: true,
          width: 200,
          render: (h, params) => {
            let result = ''
            switch (params.row.status) {
              case 'ENDED':
                result = 'Импорт готов'
                break
              case 'STARTED':
                result = 'Импорт готовится'
                break
              case 'CREATED':
                result = 'Импорт в очереди'
                break
              case 'FAILED':
                result = 'Ошибка импорта'
                break
              default:
                result = 'Неизвестный статус'
            }

            return h(
              'Tag',
              {
                attrs: {
                  color: `${params.row.status === 'ENDED' ? 'green' : 'red'}`,
                },
              },
              `${result}`
            )
          },
        },
        {
          title: 'Комментарий',
          key: 'diagnostics',
          type: 'string',
          sortable: true,

          render: (h, params) => {
            if (params.row.diagnostics) {
              return h(
                'ul',
                {
                  attrs: {
                    class: 'import-detail__ul',
                  },
                },
                params.row.diagnostics.map((item) => {
                  return h('li', item)
                })
              )
            }
          },
        },
        {
          title: 'Импортировал',
          key: 'user',
          render: (h, params) => {
            if (params.row.user.lastName && params.row.user.firstName) {
              return h(
                'span',
                `${params.row.user.lastName} ${params.row.user.firstName} ${params.row.user.middleName}`
              )
            } else {
              return null
            }
          },
        },
      ]
    },
  },
  methods: {
    handleDelete({ id }) {
      this.$Modal.confirm({
        title: 'Удаление пользователя',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить пользователя: id${id}</p>`,
        onOk: () => {
          deleteUser(id)
            .then((res) => {
              this.$Message.success('Пользователь успешно удален')
              this.findByFilter(this.params)
            })
            .catch((e) => {
              console.error(e)
            })
        },
      })
    },
    handleEdit(params) {
      const id = params.row.id
      this.$router.push({ path: `/users/edit/${id}` })
    },
    findByFilter(filter) {
      this.params = filter
      this.loading = true
      getImportList(filter)
        .then((res) => {
          this.tableData = res.data
          this.tableMeta = res.meta
          this.loading = false
        })
        .catch((e) => {
          console.error(e)
          this.loading = false
        })
    },
  },
}
</script>
