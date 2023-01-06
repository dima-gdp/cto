<template>
  <div>
    <div class="event-actions">
      <Button type="primary" class="event-actions__btn" @click="$router.push('/domains/create')">
        <Icon type="ios-add" />
        <span>Создать домен</span>
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
        @on-delete="startDeleteCabinet"
        @on-edit="toEditCabinet"
        @on-open-link="openLink"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Domains'
import { getDomains, deleteDomain } from '@/api/domains'
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
          {
            name: 'Редактировать',
            action: 'on-edit',
            access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
          },
          {
            name: 'Перейти',
            action: 'on-open-link',
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
          title: 'Домен',
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
          title: 'База пользователей',
          key: 'authGroupId',
          type: 'number',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.authGroupId) {
              return h(
                'router-link',
                {
                  props: {
                    to: { path: `/users/users_base/edit/${params.row.authGroupId}` },
                  },
                },
                `${params.row.authGroupId}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Связанное мероприятие',
          key: 'eventId',
          type: 'number',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.eventId) {
              return h(
                'router-link',
                {
                  props: {
                    to: { path: `/events/edit/${params.row.eventId}` },
                  },
                },
                `${params.row.eventId}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Активность',
          key: 'active',
          type: 'string',
          // searchable: true,
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
        this.accessOptions,
      ]
    },
  },
  methods: {
    async findByFilter(filter) {
      const { data, meta } = await getDomains({ ...filter })

      this.tableData = data
      this.tableMeta = meta
    },
    startDeleteCabinet({ id }) {
      this.$Modal.confirm({
        title: 'Удаление домена',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить домент: id${id} ?</p>`,
        onOk: () => {
          this.deleteCabinet(id)
        },
      })
    },
    async deleteCabinet(id) {
      try {
        await deleteDomain(id)

        this.$Message.success('Домен успешно удален')
        await this.findByFilter(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        throw new Error(e)
      }
    },
    toEditCabinet(domain) {
      this.$router.push({ path: `/domains/edit/${domain.id}` })
    },
    openLink({ name }) {
      window.open('https://' + name)
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
