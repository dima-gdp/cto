<template>
  <div :class="wrapperClass">
    <Card>
      <Button
        v-if="
          hasCreate &&
          (role === 'administrator' ||
            role === 'it' ||
            permissions.includes('downloadRegistration'))
        "
        type="primary"
        icon="md-add"
        class="ivu-card-body__btn-create"
        @click="createReport"
      >
        Создать отчет
      </Button>
      <Tables
        ref="tables"
        v-model="tableData"
        :searchable="searchable"
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :preserve-filter="preserveFilter"
        :columns="columns"
        :filter-config="filterConfig"
        @on-params-change="findByFilter"
        @on-route="toWorksheet"
        @on-delete="startDeleteWorksheet"
        @on-edit="toEditWorksheet"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Worksheets'
import { getRegistration, deleteEventRegistration } from '@/api/event'
import { getDate } from '@/libs/tools'

import { mapGetters } from 'vuex'
export default {
  name: 'Worksheets',
  components: {
    Tables,
  },
  props: {
    hasCreate: {
      type: Boolean,
      default: true,
    },
    wrapperClass: {
      type: String,
      default: '',
    },
    preserveFilter: {
      type: Object,
      default: () => ({
        filter: {},
        include: 'event',
      }),
    },
    searchable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      params: {
        filter: {},
        include: ['event', 'user'].join(','),
        fields: {
          user: ['email'].join(','),
          event: ['technicalName'].join(','),
        },
        sort: '-id',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      deleteModal: false,
      filterConfig,
    }
  },

  computed: {
    ...mapGetters({
      role: 'role',
      permissions: 'permissions',
    }),
    accessOptions() {
      if (this.role === 'administrator' || this.role === 'it') {
        return {
          title: '',
          options: [
            {
              name: 'Просмотр',
              action: 'on-route',
              access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
            },
            {
              name: 'Удаление',
              action: 'on-delete',
              style: {
                color: '#ed4014',
              },
              access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        }
      } else if (this.permissions.includes('updateEvent')) {
        return {
          title: '',
          options: [
            {
              name: 'Просмотр',
              action: 'on-route',
              access: ['manager', 'it', 'administrator', 'editor'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        }
      }

      return true
    },
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          maxWidth: 70,
        },
        {
          title: 'Email',
          key: 'user.email',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row) {
              return h('span', `${params.row.email}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Телефон',
          key: 'phone',
          searchable: false,
          sortable: true,
          render: (h, params) => {
            if (params.row) {
              return h('span', `${params.row.phone}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'ФИО',
          key: 'lastName',
          sortable: true,
          render: (h, params) => {
            if (params.row) {
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
          title: 'Название мероприятия',
          render: (h, params) => {
            const eventName = params.row.hasOwnProperty('event')
              ? params.row.event.technicalName
              : ''

            if (params.row.event) {
              return h('span', eventName)
            } else {
              return null
            }
          },
        },
        {
          title: 'Комментарий',
          key: 'comment',
          searchable: true,
          render: (h, { row }) => {
            const { comment } = row

            if (comment !== null) {
              return h('span', comment)
            } else {
              return null
            }
          },
        },
        {
          title: 'Дата регистрации',
          render: (h, params) => {
            return h('span', getDate(params.row.createdAt))
          },
        },
        this.accessOptions,
      ]
    },
  },
  methods: {
    async findByFilter(filter) {
      this.params = filter
      this.loading = true
      try {
        const { data, meta } = await getRegistration(this.params)
        this.tableData = data
        this.tableMeta = meta
      } catch (e) {
        throw new Error(e)
      } finally {
        this.loading = false
      }
    },
    toWorksheet({ id }) {
      this.$router.push({ path: `/worksheets/${id}` })
    },
    startDeleteWorksheet({ id }) {
      this.$Modal.confirm({
        title: 'Удаление анкеты',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить анкету: id${id}</p>`,
        onOk: () => {
          this.deleteRegistration(id)
        },
      })
    },
    async deleteRegistration(id) {
      try {
        await deleteEventRegistration(id)
        this.$Message.success('Анкета успешно удалена')
        await this.findByFilter(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        throw new Error(e)
      }
    },
    toEditWorksheet({ id }) {
      this.$router.push({ path: `/worksheets/edit/${id}` })
    },
    async createReport() {
      const reports = 'xlsx'
      const cpFilter = {
        filter: this.params.filter,
        download: reports,
      }
      try {
        await getRegistration(cpFilter)
        this.$Message.success('Вы успешно сформировали отчет')
      } catch (e) {
        this.$Message.error('Ошибка')
        throw new Error(e)
      }
    },
  },
}
</script>

<style></style>
