<template>
  <div>
    <div class="event-actions">
      <Button
        v-if="role === 'administrator' || role === 'it'"
        type="primary"
        class="event-actions__btn"
        @click="$router.push('/events/create')"
      >
        <Icon type="ios-add" />
        <span>Создать мероприятие</span>
      </Button>
    </div>
    <Card>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :filter-config="filterConfig"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-to-event="toEvent"
        @on-delete="startDeleteEvent"
        @on-edit="toEditEvent"
        @on-copy="copyEvent"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Events'
import { mapGetters } from 'vuex'
import { getEvents, createEvent, createEventOccasion, createEventCabinet } from '@/api/event'
import dayjs from 'dayjs'
import { getEventId } from '@/libs/util'

const EVENT_TYPE_NAMES = [
  { type: 'cabinet', name: 'Кабинет' },
  { type: 'occasion', name: 'Событие' },
]

export default {
  name: 'Events',
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
      events: null,
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
          // {
          //   name: 'Просмотр',
          //   action: 'on-to-event',
          //   access: ['manager', 'it', 'administrator']
          // },
          {
            name: 'Редактировать',
            action: 'on-edit',
            access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
          },
          {
            name: 'Создать копию',
            action: 'on-copy',
            access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
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
          title: 'Тех. название',
          key: 'technicalName',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.technicalName) {
              return h('span', `${params.row.technicalName}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Активность',
          key: 'active',
          type: 'string',
          sortable: true,
          align: 'center',
          maxWidth: 150,
          render: (h, params) => {
            if (params.row.hasOwnProperty('active')) {
              return h('Badge', {
                attrs: {
                  status: params.row.active ? 'success' : 'error',
                  text: `${params.row.active ? 'Активен' : 'Не активен'}`,
                },
              })
            } else {
              return null
            }
          },
        },
        {
          title: 'Тип',
          key: 'active',
          type: 'string',
          sortable: true,
          align: 'center',
          maxWidth: 150,
          render: (h, params) => {
            if (params.row.hasOwnProperty('active')) {
              const type = EVENT_TYPE_NAMES.find((t) => t.type === params.row.type)
              return h('Tag', {}, type?.name)
            } else {
              return null
            }
          },
        },
        this.accessOptions,
      ]
    },
  },
  methods: {
    async findByFilter(filter) {
      // todo: фильтр RadioDate(Radio) работает только с божьей помощью
      if (this.role === 'administrator' || this.role === 'it') {
        const newFilter = filter

        // проявление божьей помощи
        // const today = dayjs().unix()
        // if (filter.filter.length === 1 && Object.keys(filter.filter[0]).length === 0) {
        //   newFilter = { ...filter, filter: [{ endedAt: { gte: today } }] }
        // }

        this.params = newFilter
      } else {
        this.params = filter
        this.params.filter.id = getEventId()
      }

      this.loading = true
      try {
        this.events = await getEvents(this.params)

        this.tableData = [...this.events.data]
        this.tableMeta = { ...this.events.meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    startDeleteEvent({ id }) {
      this.$Modal.confirm({
        title: 'Удаление мероприятия',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить мероприятие: id${id} ?</p>`,
        onOk: () => {
          this.deleteEvent(id)
        },
      })
    },
    /**
     * @deprecated евент удалить нельзя
     * @param id
     * @returns {Promise<void>}
     */
    async deleteEvent(id) {
      try {
        await deleteEvent(id)
        this.$Message.success('Мероприятие успешно удалено')
        await this.findByFilter(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        throw new Error(e)
      }
    },
    toEvent({ id }) {
      this.$router.push({ path: `/events/${id}` })
    },
    toEditEvent({ id }) {
      this.$router.push({ path: `/events/edit/${id}` })
    },
    async copyEvent(event) {
      this.load = true
      const cpEvent = {
        ...event,
        technicalName: `Копия - ${event.technicalName}`,
      }

      try {
        const { data } = await createEvent(cpEvent)

        const eventId = data.id
        const eventType = data.type

        const dataEvent = {
          eventId: eventId,
          showAllTickets: true,
        }

        if (eventType === 'occasion') {
          await createEventOccasion(dataEvent)
        } else if (eventType === 'cabinet') {
          await createEventCabinet(dataEvent)
        } else {
          throw new Error('неверный тип мероприятия!')
        }

        await this.findByFilter(this.params)
        this.$Message.success('Мероприятие успешно скопировано!')
        this.load = false
      } catch (e) {
        this.$Message.error('Ошибка копирования!')
        this.load = false
        throw new Error(e)
      }
    },
  },
}
</script>

<style lang="less">
@import 'list.less';
</style>
