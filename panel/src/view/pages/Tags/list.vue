<template>
  <div>
    <div v-if="createAccess" class="tags-actions">
      <Button type="primary" class="event-actions__btn" @click="$router.push('/tags/create')">
        <Icon type="ios-add" />
        <span>Создать новый тег</span>
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
        @on-edit="toEditTag"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Tags'

import { getTags } from '@/api/tags'
import { mapGetters } from 'vuex'

import dayjs from 'dayjs'

export default {
  name: 'Events',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        sort: '-data_count',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      tags: null,
      filterConfig: filterConfig,
    }
  },
  computed: {
    ...mapGetters(['role']),
    createAccess() {
      return this.role === 'administrator'
    },
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          sortable: 'custom',
          maxWidth: 70,
          render: (h, params) => {
            const { id } = params.row

            if (id) {
              return h('span', id)
            } else {
              return null
            }
          },
        },
        {
          title: 'Название тега',
          render: (h, params) => {
            const { name } = params.row

            if (name) {
              return h('span', name)
            } else {
              return null
            }
          },
        },
        {
          title: 'Tag',
          render: (h, params) => {
            const { slug } = params.row

            if (slug) {
              return h('span', slug)
            } else {
              return null
            }
          },
        },
        {
          title: 'Кол-во данных',
          key: 'data_count',
          sortable: 'custom',
          maxWidth: 200,
          render: (h, params) => {
            const { dataCount } = params.row

            if (dataCount) {
              return h('span', dataCount)
            } else {
              return null
            }
          },
        },
        {
          title: 'Кол-во использований',
          key: 'uses_count',
          sortable: 'custom',
          maxWidth: 200,
          render: (h, params) => {
            const { usesCount } = params.row

            if (usesCount) {
              return h('span', usesCount)
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
              access: ['administrator'],
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
        const { data, meta } = await getTags(this.params)

        this.tableData = [...data]
        this.tableMeta = { ...meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    toEvent({ id }) {
      this.$router.push({ path: `/tags/${id}` })
    },
    toEditTag({ id }) {
      this.$router.push({ path: `/tags/edit/${id}` })
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
