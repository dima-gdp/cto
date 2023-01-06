<template>
  <div class="users-cards-list">
    <!--    <div class="users-base-list-actions users-base-list__users-base-list-actions">-->
    <!--      <Button-->
    <!--        type="primary"-->
    <!--        class="users-base-list-actions__btn"-->
    <!--        @click="$router.push('/users/users_base/create')"-->
    <!--      >-->
    <!--        <Icon type="ios-add" />-->
    <!--        <span>Создать сегмент</span>-->
    <!--      </Button>-->
    <!--    </div>-->
    <Card>
      <div>
        <Button
          type="primary"
          class="users-base-list-actions__btn"
          @click="$router.push({ path: '/themes/create' })"
        >
          <span>Создать тему</span>
        </Button>
      </div>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :columns="columns"
        :filter-config="filterConfig"
        @on-params-change="findByFilter"
        @on-edit="toEdit"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { getManyThemes } from '@/api/themes'
import { getDate } from '@/libs/tools'
import filterConfig from '@/filter-models/Themes'

export default {
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        include: [].join(','),
        filter: this.$route.query.cardId ? { id: this.$route.query.cardId } : {},
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      filterConfig,
    }
  },
  computed: {
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          maxWidth: 70,
        },
        {
          title: 'Название',
          key: 'name',
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
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Редактировать',
              action: 'on-edit',
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
        const { data, meta } = await getManyThemes(this.params)

        this.tableData = [...data]
        this.tableMeta = { ...meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    toEdit(row) {
      this.$router.push({ path: `/themes/edit/${row.id}` })
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
