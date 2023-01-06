<template>
  <div class="event-page-access">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Управление доступами к страницам</span>
        </Divider>
      </i-col>
      <i-col v-if="$store.state.user.access !== 'manager'" class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="
            $router.push(
              `/events/edit/${$route.params.id}/event-page-management?event-id=${$route.params.id}`
            )
          "
        >
          Назад
        </Button>
      </i-col>
      <i-col v-else class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push(`/access/list`)"> Назад </Button>
      </i-col>
    </Row>
    <div class="event-page-access__settings event-page-access-settings">
      <Row :gutter="10">
        <i-col span="12">
          <Card v-if="eventPage && role !== 'manager'" style="padding-bottom: 4px">
            <Spin v-if="loading" size="large" fix></Spin>
            <h4 class="event-page-access-settings__title">Настройка</h4>
            <Form ref="formPage" :model="formPage" :rules="rulesPage">
              <FormItem label="Страница доступна всем">
                <i-switch v-model="switchAccess" />
              </FormItem>
              <FormItem v-if="eventPage.limitedAccess" label="Базы пользователей" prop="auth">
                <Select v-if="authGroups" v-model="formPage.auth" multiple filterable>
                  <Option v-for="item in authGroups" :key="item.id" :value="item.id">{{
                    item.name
                  }}</Option>
                </Select>
              </FormItem>
              <Button
                :disabled="!switchAccess && !formPage.auth.length"
                type="primary"
                @click="saveSettings"
                >Применить</Button
              >
            </Form>
          </Card>
        </i-col>
        <i-col span="12">
          <FormCreateAccess
            v-if="
              eventPage &&
              eventPage.limitedAccess &&
              eventPage.eventPageAuthGroups &&
              eventPage.eventPageAuthGroups.length
            "
            :event-page-id="eventPageId"
            :loading="loading"
            @create-access="findByFilter"
          />
        </i-col>
      </Row>
    </div>

    <Card>
      <Tables
        :value="tableData"
        :params="params"
        :paging="tableMeta"
        :columns="columns"
        :filter-config="filterConfig"
        :loading="tableIsLoading"
        searchable
        @on-params-change="findByFilter"
        @on-delete="handleDeleteEventPageAccess"
      />
    </Card>
  </div>
</template>
<script>
import * as EventPageApi from '@/api/event-page'

import { getAuthGroups } from '@/api/authGroups'
import FormCreateAccess from './FormCreateAccess'
import { PAGE_TYPE_MAP, PAGE_TYPES_ENUM } from '@/libs/constants'
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/EventPageAccess'
import { eventPageAccessColumns } from '@/view/tables-colums/event-page-access-columns'

export default {
  components: {
    FormCreateAccess,
    Tables,
  },
  data() {
    return {
      filterConfig,
      columns: eventPageAccessColumns(),
      params: {
        filter: {},
        include: 'event-page,user,created-by',
      },
      loading: false,
      tableIsLoading: false,
      tableData: [],
      tableMeta: {},
      formPage: {
        auth: [],
      },
      eventPage: null,
      authGroups: [],
      switchAccess: null,
      eventPageId: this.$route.params.eventPageId,
      eventId: this.$route.params.id,
      role: this.$store.state.user.access,
    }
  },
  computed: {
    rulesPage() {
      return {
        auth: [
          {
            required: !this.switchAccess,
            type: 'array',
            min: 1,
            message: 'Выберите базу пользователей',
            trigger: 'change',
          },
        ],
      }
    },
  },
  watch: {
    'formCreateAccess.email'() {
      this.$refs.formCreateAccess.resetFields()
    },
    switchAccess(value) {
      this.eventPage.limitedAccess = !value
    },
  },
  async created() {
    await this.getData()
    if (PAGE_TYPE_MAP[this.eventPage?.type] === PAGE_TYPES_ENUM.BASIC) {
      // todo: бекенд также не должен давать редактировать базовые страницы
      await this.$router.push({ path: '/error_404' })
    }
  },
  methods: {
    async getData() {
      this.formPage.auth = []
      this.authGroups = []
      await this.getAuthGroups()
      await this.getEventPage(this.eventPageId)
    },
    async findByFilter(params = this.params) {
      this.tableIsLoading = true
      this.params = params
      try {
        this.params.filter.eventPageId = this.eventPageId
        this.events = await EventPageApi.getEventPageAccess(this.params)

        this.tableData = [...this.events.data]
        this.tableMeta = { ...this.events.meta }
      } catch (e) {
        throw new Error(e)
      } finally {
        this.tableIsLoading = false
      }
    },
    async handleDeleteEventPageAccess({ id }) {
      this.$Modal.confirm({
        title: 'Удаление доступа',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить доступ: id ${id}</p>`,
        onOk: async () => {
          try {
            this.tableIsLoading = true
            await EventPageApi.deleteEventPagesAccess(id)
            this.$Message.success('Доступ успешно удален')
            await this.findByFilter(this.filter)
          } catch (e) {
            console.error(e)
          } finally {
            this.tableIsLoading = false
          }
        },
      })
    },
    async getEventPage(eventPageId) {
      const { data } = await EventPageApi.getEventPage(eventPageId, {
        include: 'event-page-auth-groups.auth-group',
      })
      this.eventPage = data
      this.switchAccess = !data.limitedAccess
      if (data.eventPageAuthGroups) {
        this.formPage.auth.push(...data.eventPageAuthGroups.map((item) => +item.authGroup.id))
      } else {
        this.eventPage.eventPageAuthGroups = []
      }
    },
    async getAuthGroups() {
      const { data } = await getAuthGroups({ 'per-page': 0 })
      this.authGroups.push(...data)
    },
    async updateEventPage() {
      try {
        await EventPageApi.updateEventPage(this.eventPageId, this.eventPage)
      } catch (e) {
        console.error(e)
      }
    },
    async createEventPageAuthGroup() {
      if (!Array.isArray(this.eventPage?.eventPageAuthGroups)) {
        // метод не может запрашиваться, пока не загружен evenPage со списком authGroups
        return
      }

      const promises = []

      this.formPage.auth.forEach((authGroupId) => {
        const oldAuthGroupIds = this.eventPage.eventPageAuthGroups.map((item) => item.authGroupId)

        if (!oldAuthGroupIds.includes(authGroupId)) {
          promises.push(
            EventPageApi.createEventPageAuthGroup({ eventPageId: this.eventPageId, authGroupId })
          )
        }
      })

      await Promise.all(promises)
    },
    async deleteEventPageAuthGroup() {
      if (!Array.isArray(this.eventPage?.eventPageAuthGroups)) {
        // метод не может запрашиваться, пока не загружен evenPage со списком authGroups
        return
      }
      this.eventPage.eventPageAuthGroups.map(async (item) => {
        if (!this.formPage.auth.includes(item.authGroupId)) {
          await EventPageApi.deleteEventPageAuthGroup(+item.id)
        }
      })
    },
    async saveSettings() {
      this.loading = true
      const methods = [
        await this.updateEventPage(),
        await this.createEventPageAuthGroup(),
        await this.deleteEventPageAuthGroup(),
      ]

      try {
        await Promise.all(methods)
        await this.getData()
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less">
@import './EventPageAccess.less';
</style>
