<template>
  <div class="users-cards-list">
    <Card>
      <Row type="flex" align="middle">
        <i-col span="5">
          <Poptip
            trigger="hover"
            content="Сначала примените фильтр"
            :disabled="isFilterCreated"
            placement="bottom"
          >
            <Button
              type="primary"
              class="users-base-list-actions__btn"
              :disabled="!isFilterCreated"
              @click="toggleCreateSegment"
            >
              <span>Создать сегмент</span>
            </Button>
          </Poptip>
        </i-col>
        <i-col span="5">
          <div class="users-base-list-actions__show-filters">
            <span>Показать фильтрацию</span>
            <i-switch v-model="isFilterShown" />
          </div>
        </i-col>
      </Row>
      <TablesCards
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :columns="columns"
        :filter-config="filterConfig"
        :is-filter-shown="isFilterShown"
        @show-filters="isFilterShown = true"
        @on-sort-change="findByFilter"
        @on-page-change="findByFilter"
        @on-filter-change="findByFilter"
        @on-view="onView"
      />
    </Card>
    <Drawer
      v-model="isDrawerVisible"
      class="users-cards-drawer"
      title="Карточка клиента"
      width="80"
      :closable="true"
      @on-close="clearCardData"
    >
      <CardView :card-data="cardData" />
    </Drawer>
    <Drawer
      v-model="isCreateSegmentVisible"
      class="users-cards-segment-create"
      title="Создание сегмента"
      width="40"
      :closable="true"
    >
      <CreateSegment :filter="params.filter" @segment-created="toggleCreateSegment" />
    </Drawer>
  </div>
</template>

<script>
import TablesCards from '_c/tables/tables_v2.vue'
import CardView from './components/card-view'
import CreateSegment from './components/create-segment'
import { getUsersCards, getCardById } from '@/api/usersCards'
import { getDate } from '@/libs/tools'
import filterConfig from '@/filter-models/UsersCards'

export default {
  components: {
    TablesCards,
    CardView,
    CreateSegment,
  },
  data() {
    return {
      params: {
        include: [
          'users',
          'orders.event',
          'registrations.event',
          'auth-groups',
          'card-segments',
          'records',
          'activities.registration',
          'activities.order',
          'card-profile',
        ].join(','),
        page: 1,
        filter: [],
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      tags: null,
      isDrawerVisible: false,
      isCreateSegmentVisible: false,
      cardData: null,
      filterConfig,
      isFilterShown: false,
    }
  },
  computed: {
    isFilterCreated() {
      return (
        this.$route.params.visualStructure &&
        JSON.parse(this.$route.params.visualStructure).length > 0
      )
    },

    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          maxWidth: 70,
        },
        {
          title: 'Email',
          key: 'email',
        },
        {
          title: 'Количество анкет',
          key: 'registrations',
          render: (h, params) => {
            if (params.row.registrations) {
              return h('span', params.row.registrations.length)
            }
          },
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          render: (h, params) => {
            if (params.row.createdAt !== null) {
              return h('span', getDate(params.row.createdAt))
            }
          },
        },
        {
          title: 'Дата обновления',
          key: 'updatedAt',
          render: (h, params) => {
            if (params.row.updatedAt !== null) {
              return h('span', getDate(params.row.updatedAt))
            }
          },
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Просмотр',
              action: 'on-view',
              access: ['administrator', 'it'],
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
    async findByFilter(filter) {
      this.params = filter
      this.loading = true
      try {
        const { data, meta } = await getUsersCards({
          params: {
            include: this.params.include,
            page: this.params.page,
          },
          data: { data: { filter: this.params.filter } },
        })

        this.tableData = [...data]
        this.tableMeta = { ...meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    onView(row) {
      this.cardData = row
      this.isDrawerVisible = !this.isDrawerVisible
    },
    toggleCreateSegment() {
      this.isCreateSegmentVisible = !this.isCreateSegmentVisible
    },
    clearCardData() {
      this.cardData = null
    },
    async openCardById(id) {
      const params = { ...this.params }
      try {
        const { data } = await getCardById({ params, id })
        this.onView(data)
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
