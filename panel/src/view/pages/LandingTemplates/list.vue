<template>
  <div>
    <div class="event-actions">
      <Button
        v-if="isCreateBtnVisible"
        type="primary"
        class="event-actions__btn"
        @click="$router.push({ name: 'landing_create' })"
      >
        <Icon type="ios-add" />
        <span>Создать шаблон</span>
      </Button>
    </div>
    <Card>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="isLoading"
        :paging="tableMeta"
        :params="params"
        :columns="columns"
        @on-params-change="onParamsChange"
        @on-delete="onDeleteTemplate"
        @on-edit="toEditPage"
      />
      <Spin v-if="isLoading" fix />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import { mapGetters } from 'vuex'
import eventLandingTemplateAdapter from '@/services/event-landing-template-adapter'
import useLandingTemplate from '@/application/use-event-landing-template'
import { ROLES } from '@/domain/role'

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
      isLoading: false,
      tableData: [],
      tableMeta: {},
    }
  },

  computed: {
    ...mapGetters(['role']),

    columns() {
      return useLandingTemplate().getColumns()
    },

    isCreateBtnVisible() {
      return this.role === ROLES.admin
    },
  },

  methods: {
    async onParamsChange(filter) {
      try {
        this.isLoading = true
        await this.updateTable(filter)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async updateTable(filter) {
      const { data, meta } = await eventLandingTemplateAdapter().getTemplates({ ...filter })
      this.tableData = data
      this.tableMeta = meta
    },

    onDeleteTemplate({ id }) {
      try {
        this.$Modal.confirm({
          title: 'Удаление шаблона',
          okText: 'Удалить',
          content: `<p>Вы уверены что хотите удалить шаблон: id${id} ?</p>`,
          onOk: () => {
            this.deleteTemplate(id)
          },
        })
      } catch (e) {
        console.error(e)
      }
    },

    async deleteTemplate(id) {
      try {
        await eventLandingTemplateAdapter().deleteTemplate(id)
        this.$Message.success('Шаблон успешно удален')
        await this.onParamsChange(this.params)
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка')
        throw new Error(e)
      }
    },

    toEditPage({ id }) {
      this.$router.push({ name: 'landing_edit', params: { id } })
    },
  },
}
</script>

<style lang="less">
@import '_list';
</style>
