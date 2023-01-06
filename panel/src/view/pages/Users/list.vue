<template>
  <div>
    <Card>
      <Button type="primary" icon="md-add" class="ivu-card-body__btn-create" to="/users/create">
        Создать пользователя
      </Button>
      <Button type="primary" icon="md-add" class="ivu-card-body__btn-create" @click="createReport">
        Создать отчет
      </Button>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :filter-config="filterConfig"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-route="toEdit"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Users'

import { getUserList, deleteUser } from '@/api/user'
import { getDate } from '@/libs/tools'
export default {
  name: 'UserList',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        sort: '-id',
      },
      tableData: [],
      tableMeta: {},
      loading: true,
      filterConfig: filterConfig,
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
          title: 'ФИО',
          key: 'fullName',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.lastName && params.row.firstName) {
              return h(
                'span',
                `${params.row.lastName} ${params.row.firstName} ${params.row.middleName}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Email',
          key: 'email',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            return h(
              'span',
              { class: params.row.emailValidate ? 'success-color' : '' },
              params.row.email
            )
          },
        },
        {
          title: 'Телефон',
          key: 'phone',
          type: 'string',
          sortable: true,
        },
        {
          title: 'Дата регистрации',
          key: 'createdAt',
          sortable: true,
          render: (h, params) => {
            return h('span', getDate(params.row.createdAt))
          },
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Редактирование',
              action: 'on-route',
              access: ['manager', 'it', 'administrator'],
            },
            {
              name: 'Удаление',
              action: 'on-delete',
              style: {
                color: '#ed4014',
              },
              access: ['it', 'administrator'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
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
              throw new Error(e)
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
      getUserList(filter)
        .then((res) => {
          this.tableData = res.data
          this.tableMeta = res.meta
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          throw new Error(e)
        })
    },
    handleSearch() {
      this.insideTableData = this.value.filter(
        (item) => item[this.searchKey].indexOf(this.searchValue) > -1
      )
    },
    async createReport() {
      const reports = 'xlsx'
      const cpFilter = {
        filter: this.params.filter,
        download: reports,
      }

      try {
        await getUserList(cpFilter)
        this.$Message.success('Вы успешно сформировали отчет')
      } catch (e) {
        this.$Message.error('Ошибка')
        throw new Error(e)
      }
    },
    toEdit({ id }) {
      this.$router.push({ path: `/users/edit/${id}` })
    },
  },
}
</script>
