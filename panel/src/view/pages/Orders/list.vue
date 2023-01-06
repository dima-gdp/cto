<template>
  <div>
    <Card>
      <Button
        v-if="role === 'administrator' || role === 'it' || permissions.includes('downloadOrder')"
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
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :filter-config="filterConfig"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-route="toOrder"
        @on-delete="startDeleteOrder"
        @on-edit="toEditOrder"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Orders'
import { mapGetters } from 'vuex'
import { getOrders, deleteOrder, createOrdersReport } from '@/api/orders'
import { getDate } from '@/libs/tools'

export default {
  name: 'Orders',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        include: 'user,event',
        sort: '-id',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      deleteModal: false,
      orders: null,
      filterConfig: filterConfig,
    }
  },
  computed: {
    ...mapGetters(['role', 'permissions']),
    columns() {
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
          title: 'Статус',
          key: 'status',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            if (params.row.status) {
              return h('span', `${params.row.status === 'created' ? 'Создан' : 'Отменен'}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'ФИО',
          key: 'name',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.user) {
              return h(
                'span',
                `${params.row.user.lastName} ${params.row.user.firstName} ${params.row.user.middleName}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Название мероприятия',
          key: 'event.technicalName',
          type: 'string',
          searchable: true,
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
          title: 'Сумма',
          key: 'cost',
          type: 'string',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            if (params.row.cost) {
              return h('span', { class: 'table-orders__cost' }, `${params.row.cost}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Оплата',
          key: 'paid',
          type: 'string',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            if (params.row.hasOwnProperty('paid')) {
              return h(
                'Tag',
                {
                  attrs: {
                    color: params.row.paid ? 'green' : 'red',
                  },
                },
                `${params.row.paid ? 'Оплачен' : 'Не оплачен'}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          sortable: true,
          render: (h, params) => {
            if (params.row.hasOwnProperty('createdAt')) {
              return h('span', getDate(params.row.createdAt))
            } else {
              return null
            }
          },
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Просмотр',
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
      ].filter((col) => col.key !== 'event.technicalName' || this.role !== 'manager')
    },
  },
  methods: {
    async findByFilter(filter) {
      this.params = filter
      this.loading = true

      try {
        this.orders = await getOrders(this.params)

        this.tableData = [...this.orders.data]
        this.tableMeta = { ...this.orders.meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    startDeleteOrder({ id }) {
      this.$Modal.confirm({
        title: 'Удаление заказа',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить заказ: id${id} ?</p>`,
        onOk: () => {
          this.deleteOrder(id)
        },
      })
    },
    async deleteOrder(id) {
      try {
        await deleteOrder(id)
        this.$Message.success('Заказ успешно удален')
        await this.findByFilter(this.params)
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },
    toOrder({ id }) {
      this.$router.push({ path: `/orders/${id}` })
    },
    toEditOrder({ id }) {
      this.$router.push({ path: `/orders/edit/${id}` })
    },
    async createReport() {
      const reports = 'xlsx'
      const params = {
        filter: this.params.filter,
        download: reports,
      }
      try {
        await createOrdersReport(params)
        this.$Message.success('Вы успешно сформировали отчет')
      } catch (e) {
        this.$Message.error('Ошибка')
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less">
.table-orders {
  &__cost {
    font-weight: bold;
  }
}
</style>
