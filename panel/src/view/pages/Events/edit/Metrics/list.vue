<template>
  <div>
    <Row
      v-if="role !== $options.ROLES.manager"
      type="flex"
      justify="center"
      align="middle"
      class-name="view-header"
    >
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Внешние счетчики</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push(`/events/edit/${$route.params.id}`)">
          Назад
        </Button>
      </i-col>
    </Row>
    <div class="event-actions">
      <Button
        type="primary"
        class="event-actions__btn"
        @click="
          $router.push({
            path: `${$route.path}/create`,
          })
        "
      >
        <Icon type="ios-add" />
        <span>Создать метрику</span>
      </Button>
    </div>
    <Card>
      <Tables
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :filter-config="$options.filterConfig"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-delete="startDeleteMetric"
        @on-edit="toEditMetric"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { mapGetters } from 'vuex'
import { getMetricCounter, deleteMetricCounter } from '@/api/metricCounter'
import filterConfig from '@/filter-models/Metrics'
import { ROLES } from '@/domain/role'

export default {
  name: 'Events',
  components: {
    Tables,
  },
  filterConfig,
  ROLES,
  data() {
    return {
      params: {
        filter: {},
        sort: '-id',
      },
      tableData: [],
      tableMeta: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      role: 'role',
      permissions: 'permissions',
      eventId: 'getEventId',
    }),
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
          title: 'Метрика',
          key: 'name',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.name) {
              return h('span', `${params.row.name}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Ключ',
          key: 'key',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.key) {
              return h('span', `${params.row.key}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Тип',
          key: 'type',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.type) {
              return h('span', `${params.row.type}`)
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
              name: 'Редактировать',
              action: 'on-edit',
              access: ['manager', 'it', 'administrator'],
            },
            {
              name: 'Удаление',
              action: 'on-delete',
              style: {
                color: '#ed4014',
              },
              access: ['manager', 'it', 'administrator'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        },
      ]
    },
  },

  created() {
    const eventId = this.eventId || this.$route.params.id
    this.params.filter = { 'event-id': eventId }
  },

  methods: {
    async findByFilter(filter) {
      const { data, meta } = await getMetricCounter({ ...filter })

      this.tableData = data
      this.tableMeta = meta
    },

    startDeleteMetric({ id }) {
      this.$Modal.confirm({
        title: 'Удаление метрики',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить метрику: id${id} ?</p>`,
        onOk: () => {
          this.deleteMetric(id)
        },
      })
    },
    async deleteMetric(id) {
      try {
        await deleteMetricCounter(id)

        this.$Message.success('Метрика успешно удалена')
        await this.findByFilter(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        console.error(e)
      }
    },
    toEditMetric(metric) {
      this.$router.push(`${this.$route.path}/edit/${metric.id}`)
    },
  },
}
</script>

<style lang="less">
@import './metrics.less';
</style>
