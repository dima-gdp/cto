<template>
  <div>
    <div class="form-fields-actions">
      <Button type="primary" class="form-actions__btn" @click="$router.push('/form-fields/create')">
        <Icon type="ios-add" />
        <span>Создать поле</span>
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
        @on-delete="handleDelete"
        @on-params-change="findByFilter"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig, { fieldTypes } from '@/filter-models/FormFields'

import { getFieldsList, deleteField } from '@/api/forms'

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
        sort: '-id',
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
          title: 'Название поля',
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
          title: 'Тип поля',
          render: (h, params) => {
            const { type } = params.row
            const typeStr = fieldTypes.find((t) => t.value === type).name
            if (typeStr) {
              return h('span', typeStr)
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
            {
              name: 'Удалить',
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
      ]
    },
  },
  methods: {
    async findByFilter(filter) {
      if (filter) {
        this.params = filter
      }
      this.loading = true

      try {
        if (this.params.filter) {
          this.params.filter.location = 'global'
        }

        const { data, meta } = await getFieldsList(this.params)

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
        this.$router.push({ path: `/form-fields/edit/${id}` })
      }
    },
    handleDelete({ id }) {
      this.$Modal.confirm({
        title: 'Удаление поля',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить поле: №${id}</p>`,
        onOk: () => {
          deleteField(id)
            .then(() => {
              this.$Message.success('Поле успешно удалено')
              this.findByFilter()
            })
            .catch((e) => {
              console.error(e)
            })
        },
      })
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
