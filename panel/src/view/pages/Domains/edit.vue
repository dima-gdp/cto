<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование домена</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/domains/list')">
          К списку доменов
        </Button>
      </i-col>
    </Row>
    <Card style="margin-bottom: 15px">
      <Form
        v-if="!isLoading"
        ref="domainForm"
        label-position="top"
        :model="formModel"
        :rules="formRules"
      >
        <FormItem label="Домен" prop="name">
          <Input v-model="formModel.name" placeholder="Введите название домена" />
        </FormItem>
        <FormItem label="База пользователей" prop="authGroupId">
          <Select
            v-model="formModel.authGroup.id"
            :loading="authGroupsLoading"
            remote
            filterable
            placeholder="Введите название базы пользователей"
            :remote-method="debounce(getAuthGroupList, 800)"
          >
            <Option v-for="group in authGroups" :key="group.id" :value="group.id">{{
              group.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Связанное мероприятие" prop="eventId">
          <Select
            v-model="formModel.event.id"
            :loading="eventsLoading"
            remote
            filterable
            placeholder="Введите техническое название мероприятия"
            :remote-method="debounce(getEventList, 800)"
          >
            <Option v-for="event in events" :key="event.id" :value="event.id">{{
              event.technicalName
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Активность" prop="active">
          <i-switch v-model="formModel.active" size="large">
            <span slot="open">Да</span>
            <span slot="close">Нет</span>
          </i-switch>
        </FormItem>
      </Form>
      <Spin v-else fix />
    </Card>
    <Card dis-hover>
      <Row :gutter="24">
        <i-col span="12">
          <Button long :disabled="isLoading" @click="save">
            Сохранить и остаться на странице
          </Button>
        </i-col>
        <i-col span="12">
          <Button long type="primary" :disabled="isLoading" @click="saveAndLeave">
            Сохранить и вернуться к списку доменов
          </Button>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getAuthGroups, getAuthGroup } from '@/api/authGroups'
import { validateDomainPayload } from '@/view/pages/Domains/domain-model'

import { getOneDomain, updateDomain } from '@/api/domains'

import { getEvents, getEvent } from '@/api/event'
import { debounce } from '@/libs/util'

/**
 *
 * @param rule
 * @param value
 * @param cb
 * чтобы обмануть кривое взаимодействие asyncValidator и iview Form
 */
function fakeRequiredRule(rule, value, cb) {
  cb()
}

export default {
  name: 'CreateDomain',
  data() {
    return {
      formModel: {
        name: '',
        authGroup: {
          name: '',
          id: null,
        },
        active: false,
        event: {
          technicalName: '',
          id: null,
        },
      },
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!', trigger: 'blur' }],
        eventId: [{ validator: fakeRequiredRule, trigger: 'blur', required: true }],
        authGroupId: [{ validator: fakeRequiredRule, trigger: 'blur', required: true }],
      },
      isLoading: false,
      authGroups: [],
      authGroupsLoading: false,
      events: [],
      eventsLoading: false,
    }
  },
  computed: {},
  async created() {
    await this.prepareForm()
  },
  methods: {
    debounce,

    async prepareForm() {
      this.isLoading = true
      this.formModel = await this.getDomainData()
      this.authGroups = [this.formModel.authGroup]
      this.events = [this.formModel.event]
      this.isLoading = false
    },

    async fetchDomain() {
      const { data: domain } = await getOneDomain(this.$route.params.id, {
        fields: {
          domain: ['active', 'auth-group-id', 'event-id', 'name'].join(','),
        },
      })

      return domain
    },

    async getDomainData() {
      const domain = await this.fetchDomain()

      const event = await this.fetchEvent(domain.eventId)
      const authGroup = await this.fetchAuthGroup(domain.authGroupId)

      return {
        name: domain.name,
        authGroup,
        active: domain.active,
        event,
      }
    },

    async fetchAuthGroup(authGroupId) {
      const { data: authGroup } = await getAuthGroup(authGroupId, {
        fields: {
          'auth-group': ['name'].join(','),
        },
      })

      return authGroup
    },

    async fetchEvent(eventId) {
      const { data: event } = await getEvent(eventId, {
        fields: {
          event: ['technical-name'].join(','),
        },
      })

      return event
    },

    async getAuthGroupList(query) {
      this.authGroupsLoading = true
      this.authGroups = await this.fetchAuthGroupList(query)
        .catch((e) => {
          throw e
        })
        .finally(() => {
          this.authGroupsLoading = false
        })
    },

    async fetchAuthGroupList(authName) {
      const { data: authGroups } = await getAuthGroups({
        fields: {
          'auth-group': ['name'].join(','),
        },
        filter: {
          name: {
            ilike: authName,
          },
        },
      })

      return authGroups
    },

    async getEventList(query) {
      this.eventsLoading = true
      this.authGroups = await this.fetchEventList(query)
        .catch((e) => {
          throw e
        })
        .finally(() => {
          this.eventsLoading = false
        })
    },

    async fetchEventList(technicalName) {
      const { data: events } = await getEvents({
        fields: {
          event: ['technical-name'].join(','),
        },
        filter: {
          'technical-name': {
            ilike: technicalName,
          },
        },
      })

      this.events = events
    },

    async sendData() {
      let isValid = false
      const payload = {
        name: this.formModel.name,
        authGroupId: +this.formModel.authGroup.id,
        eventId: +this.formModel.event.id,
        active: this.formModel.active,
      }
      try {
        isValid = validateDomainPayload(payload)
      } catch (e) {
        this.$Message.error(e.message)
      }

      if (isValid) {
        this.isLoading = true
        await updateDomain(this.$route.params.id, payload)
          .catch((e) => {
            throw e
          })
          .finally(() => (this.isLoading = false))
      }
    },

    async save() {
      await this.sendData()
      await this.prepareForm()
    },

    async saveAndLeave() {
      await this.sendData()
      await this.$router.push({ path: `/domains/list/` })
    },
  },
}
</script>

<style lang="less"></style>
