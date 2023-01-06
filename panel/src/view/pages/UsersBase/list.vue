<template>
  <div class="users-base-list">
    <div class="users-base-list-actions users-base-list__users-base-list-actions">
      <Button
        type="primary"
        class="users-base-list-actions__btn"
        @click="$router.push('/users/users_base/create')"
      >
        <Icon type="ios-add" />
        <span>Создать новую базу</span>
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
        :columns="columns"
        @on-params-change="findByFilter"
        @on-edit="onEdit"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { getAuthGroups } from '@/api/authGroups'

export default {
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
      tags: null,
      columns: [
        {
          title: 'ID',
          key: 'id',
          maxWidth: 70,
        },
        {
          title: 'Название',
          key: 'name',
        },
        {
          title: 'Описание',
          key: 'description',
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Редактировать',
              action: 'on-edit',
              access: ['manager', 'it', 'administrator', 'editor', 'manager', 'user'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        },
      ],
    }
  },
  methods: {
    async findByFilter(filter) {
      this.params = filter
      this.loading = true

      try {
        const { data, meta } = await getAuthGroups(this.params)

        this.tableData = [...data]
        this.tableMeta = { ...meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    onEdit({ id }) {
      if (id) {
        this.$router.push({ path: `/users/users_base/edit/${id}` })
      }
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
