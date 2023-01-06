<template>
  <div>
    <div class="event-actions">
      <Button
        v-if="role === 'administrator' || role === 'it'"
        type="primary"
        class="event-actions__btn"
        @click="$router.push('/static-pages/create')"
      >
        <Icon type="ios-add" />
        <span>Создать страницу</span>
      </Button>
    </div>
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
        @on-delete="startDeletePage"
        @on-edit="toEditPage"
      />
      <Spin v-if="loading" fix />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { getManyStaticPage, deleteStaticPage } from '@/api/staticPages'
import filterConfig from '@/filter-models/StaticPage'
import { getEvents } from '@/api/event'
import { mapGetters } from 'vuex'

export default {
  name: 'Events',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        sort: '-id',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      deleteModal: false,
      events: [],
      filterConfig,
    }
  },
  computed: {
    ...mapGetters({
      role: 'role',
      permissions: 'permissions',
    }),
    accessOptions() {
      return {
        title: '',
        key: 'handle',
        options: [
          {
            name: 'Редактировать',
            action: 'on-edit',
            access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
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
      }
    },
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
          title: 'Мероприятие',
          key: 'eventId',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            if (params.row.eventId && this.events.length) {
              const event = this.events.find((e) => e.id === params.row.eventId)
              const technicalName = event?.technicalName
              return h('span', `${technicalName}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Название страницы',
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
          title: 'Язык',
          key: 'lang',
          type: 'string',
          sortable: true,
          render: (h, params) => {
            if (params.row.lang) {
              return h('span', `${params.row.lang}`)
            } else {
              return null
            }
          },
        },
        {
          ...this.accessOptions,
        },
      ]
    },
  },
  methods: {
    getEventsIds(events) {
      return events.map((el) => el.eventId).join(', ')
    },
    async getEvents(ids) {
      const params = {
        'per-page': 0,
        filter: { id: ids },
        fields: {
          event: ['id', 'technical-name'],
        },
      }
      const { data: eventsData } = await getEvents(params)

      this.events = eventsData
    },
    async findByFilter(filter) {
      this.loading = true
      const { data, meta } = await getManyStaticPage({ ...filter })
      this.tableData = data
      this.tableMeta = meta
      const ids = this.getEventsIds(data)
      if (ids) {
        await this.getEvents(ids)
      }
      this.loading = false
    },
    startDeletePage({ id }) {
      this.$Modal.confirm({
        title: 'Удаление страницы',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить страницу: id${id} ?</p>`,
        onOk: () => {
          this.deletePage(id)
        },
      })
    },
    async deletePage(id) {
      try {
        await deleteStaticPage(id)

        this.$Message.success('Страница успешно удалена')
        await this.findByFilter(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        throw new Error(e)
      }
    },
    toEditPage(page) {
      this.$router.push({ path: `/static-pages/edit/${page.id}` })
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
