<template>
  <div>
    <Card>
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
import filterConfig from '@/filter-models/Reports'

import { getRepotsList, reportViewed } from '@/api/reports'
import { getDate } from '@/libs/tools'

import { mapActions } from 'vuex'
import config from '@/config/index'

export default {
  name: 'ReportsList',
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
      filterConfig,
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
          title: 'Наименование',
          key: 'reportName',
          type: 'string',
          searchable: true,
          sortable: true,
        },
        {
          title: 'Создан',
          key: 'createdAt',
          sortable: true,
          // sortType: 'desc',
          render: (h, params) => {
            return h('span', getDate(params.row.createdAt))
          },
        },
        {
          title: 'Статус',
          key: 'viewed',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            return h(
              'Tag',
              //{ class: params.row.viewed ? 'success-color': '' },
              {
                attrs: {
                  color: params.row.viewed ? 'green' : 'red',
                },
              },
              `${params.row.viewed ? 'Просмотрен' : 'Не просмотрен'}`
            )
          },
        },
        {
          title: 'Готовность',
          key: 'status',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            let result = ''

            switch (params.row.status) {
              case 'ENDED':
                result = 'Отчет готов'
                break
              case 'STARTED':
                result = 'Отчет готовится'
                break
              case 'CREATED':
                result = 'Отчет в очереди'
                break
              case 'FAILED':
                result = 'Ошибка'
                break
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
          title: 'Скачать',
          key: 'download',
          type: 'string',
          render: (h, params) => {
            if (params.row.status === 'ENDED') {
              return h(
                'a',
                {
                  attrs: {
                    class: 'ivu-btn ivu-btn-primary ivu-btn-circle',
                    href: params.row.reportPath,
                  },
                  on: {
                    click: (event, id = params.row.id) => {
                      this.reportViewed(id)
                    },
                  },
                },
                'Скачать'
              )
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
      this.params.filter.userId = this.$store.state.user.userId
      this.loading = true
      getRepotsList(this.params)
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
    handleSearch() {
      this.insideTableData = this.value.filter(
        (item) => item[this.searchKey].indexOf(this.searchValue) > -1
      )
    },
    toEdit({ id }) {
      this.$router.push({ path: `/users/edit/${id}` })
    },
    reportViewed(id) {
      this.loading = true
      reportViewed(id, { filter: { userId: this.$store.state.user.userId } })
        .then((res) => {
          this.loading = false
          this.findByFilter()
        })
        .catch((e) => {
          console.error(e)
          this.loading = false
        })
    },
  },
}
</script>
