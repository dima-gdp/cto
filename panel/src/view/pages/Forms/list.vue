<template>
  <div>
    <div class="form-actions">
      <Button type="primary" class="form-actions__btn" @click="$router.push('/forms/create')">
        <Icon type="ios-add" />
        <span>Создать форму</span>
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
        @on-edit="handleEdit"
        @on-params-change="findByFilter"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Forms'
import dayjs from 'dayjs'

import { getForms } from '@/api/forms'

export default {
  name: 'Forms',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        include: 'user,event',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      forms: [],
      filterConfig: filterConfig,
    }
  },
  computed: {
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
          title: 'Название формы',
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
          title: 'Активность',
          align: 'center',
          maxWidth: 250,
          render: (h, params) => {
            const { active } = params.row
            const createBadge = (isActive) =>
              h('Badge', {
                attrs: {
                  status: isActive ? 'success' : 'error',
                  text: isActive ? 'Активен' : 'Не активен',
                },
              })

            if (params.row.hasOwnProperty('active')) {
              return createBadge(active)
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
      this.filterConfig.forEach((c) => {
        if (c.key === 'type') {
          c.default = ''
        }
      })

      this.params = filter

      if (this.params.filter) {
        this.params.filter.location = 'global'
      }

      this.loading = true

      try {
        const { data, meta } = await getForms(this.params)
        this.forms = data
        this.tableData = [...data]
        this.tableMeta = { ...meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    handleEdit(form) {
      const { id } = form
      if (id) {
        this.$router.push({ path: `/forms/edit/${id}` })
      }
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
