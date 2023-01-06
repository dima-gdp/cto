<template>
  <div>
    <Card>
      <Button type="primary" icon="md-add" class="ivu-card-body__btn-create" to="/juridical/create">
        Создать юр. лицо
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
        @on-route="toEdit"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      />
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Juridical'

import { getAllLegalEntities, deleteLegalEntities } from '@/api/legalEntities'

export default {
  name: 'JuridicalList',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        sort: '-id',
      },
      tableData: [],
      tableMeta: {},
      loading: true,
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
          sortable: true,
          searchable: true,
          width: 65,
        },
        {
          title: 'Внутреннее название юр.лица',
          key: 'technicalName',
          type: 'string',
          searchable: true,
          sortable: true,
        },
        // {
        //   title: 'Провайдер оплаты',
        //   key: 'email',
        //   type: 'string',
        //   searchable: true,
        //   sortable: true,
        //   render: (h, params) => {
        //     return h(
        //       'span',
        //       { class: params.row.emailValidate ? 'success-color': '' },
        //       params.row.email)
        //   }
        // },
        // {
        //   title: 'Активность',
        //   key: 'phone',
        //   type: 'string',
        //   sortable: true
        // },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Редактирование',
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
      ]
    },
  },
  methods: {
    handleDelete({ id }) {
      this.$Modal.confirm({
        title: 'Удаление юр. лица',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить юр. лицо: id${id}</p>`,
        onOk: () => {
          deleteLegalEntities(id)
            .then((res) => {
              this.$Message.success('Юр. лицо успешно удалено')
              this.findByFilter(this.params)
            })
            .catch((e) => {
              console.error(e)
            })
        },
      })
    },
    findByFilter(filter) {
      this.params = filter
      this.loading = true
      getAllLegalEntities(filter)
        .then((res) => {
          this.tableData = res.data
          this.tableMeta = res.meta
          this.loading = false
        })
        .catch((e) => {
          console.error(e)
          this.loading = false
        })
    },
    toEdit({ id }) {
      this.$router.push({ path: `/juridical/edit/${id}` })
    },
    handleEdit(params) {
      const id = params.row.id
      this.$router.push({ path: `/juridical/edit/${id}` })
    },
  },
}
</script>
