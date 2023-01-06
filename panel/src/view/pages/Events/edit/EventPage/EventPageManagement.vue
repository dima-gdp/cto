<template>
  <div class="event-page-management">
    <Row
      v-if="role !== 'manager'"
      type="flex"
      justify="center"
      align="middle"
      class-name="view-header"
    >
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Управление страницами</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push(`/events/edit/${eventId}`)">
          Назад
        </Button>
      </i-col>
    </Row>
    <Card>
      <Tables
        ref="tables"
        v-model="tableData"
        :params="params"
        :loading="loading"
        :paging="tableMeta"
        :columns="columns"
        searchable
        search-place="top"
        @on-params-change="findByFilter"
      />
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables-base'
import { getEventPages } from '@/api/event-page'
import { eventPageManagementColums } from '@/view/tables-colums/event-page-management-colums'

export default {
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      eventId: this.$route.params.id || this.$store.state.app.eventId,
      role: this.$store.state.user.access,
    }
  },
  computed: {
    columns() {
      return eventPageManagementColums(this.role, this.eventId)
    },
  },
  methods: {
    async findByFilter(filter) {
      this.params = filter
      this.loading = true
      // Проверка для менеджерской панели
      if (!this.params.filter['event-id']) {
        this.params.filter['event-id'] = this.eventId
      }

      try {
        this.events = await getEventPages(this.params)

        this.tableData = [...this.events.data]
        this.tableMeta = { ...this.events.meta }

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
  },
}
</script>
<style lang="less">
@import './EventPageManagement';
</style>
