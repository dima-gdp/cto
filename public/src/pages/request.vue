<template>
  <div v-if="request" class="request-page">
    <div class="request-page__request-head">
      <template v-if="!isLoading">
        <AppInfoBlock
          :limit="85"
          :description="request.description"
          class="request-page__info-block"
        >
          <template v-slot:alert>
            <Alert :type="mapStatusToAlertType" banner>
              {{ alert.text }}
            </Alert>
          </template>
          <template v-slot:text>
            <AppMarkdown :text="request.description"></AppMarkdown>
          </template>
        </AppInfoBlock>
        <div class="request-page--divider"></div>
        <div v-if="userRequests && userRequests.length" class="request-page__request sent-requests">
          <h3 class="sent-requests__title">
            {{ $tr(getRequestI18n('sentRequests')) }}
          </h3>
          <div class="row">
            <div
              v-for="item in userRequests"
              :key="item.requestId"
              class="col-xlg-4 col-lg-6 col-md-12 col-sm-12"
            >
              <AppCardRequest
                :data="item"
                :category="request.category"
                :date-expired="dateExpired"
                @del-request="deleteUserRequest"
              >
              </AppCardRequest>
            </div>
          </div>
        </div>
      </template>
      <Spin v-else fix></Spin>
    </div>
    <div class="request-page__request new-request">
      <template v-if="dateExpired">
        <Alert type="error" class="new-request__count-alert">
          <p class="s-body">
            {{ $tr(getRequestI18n('requestAlertSendDisabled')) }}
          </p>
        </Alert>
      </template>
      <template v-else-if="request.isSendingLimitReached">
        <Alert type="warning" class="new-request__count-alert">
          <p class="s-body">
            {{ $tr('request.requestAlertTotalLimit') }}
          </p>
        </Alert>
      </template>
      <template v-else-if="request.isUserSendingLimitReached">
        <Alert type="warning" class="new-request__count-alert">
          <p class="s-body">
            {{ $tr(getRequestI18n('requestAlertLimit')) }}
          </p>
        </Alert>
      </template>
      <div v-show="!isFormHidden" style="position: relative">
        <h3 class="new-request__title">
          {{ $tr(getRequestI18n('newRequestTitle')) }}
        </h3>
        <Alert v-if="request.userSendingLimit" type="success" class="new-request__count-alert">
          <p class="s-body">
            {{ $tr(getRequestI18n('requestAlertCount')) }}: {{ request.userSendingLimit }}
          </p>
          <span class="s-small-2">
            {{ $tr(getRequestI18n('requestAlertCountLimit')) }}:
            {{ request.userSendingLimit - userRequests.length }}
          </span>
        </Alert>
        <AppForm :form-id="request.formId" clear-form @submit="handleSubmitForm">
          <template #submit="{ submit: formSubmit }">
            <Portal to="profile-submit">
              <Button
                type="primary"
                size="large"
                :disabled="isLoading || requestStatus !== 'during'"
                class="registration-footer__submit"
                @click="formSubmit"
              >
                {{ $tr(getRequestI18n('sendBtn')) }}
              </Button>
            </Portal>
          </template>
        </AppForm>
        <div class="registration__registration-footer registration-footer">
          <div class="row">
            <div class="col-12 text-right">
              <PortalTarget name="profile-submit"></PortalTarget>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useRequest from '@/domain/composables/request/use-request'
import { fromISOToString, fromStringToISO, TIME_STATUSES } from '@/utils'
import { DateTime } from '@/plugins/luxon'
import AppForm from '@/components/common/app-form'
import AppInfoBlock from '@/components/common/app-info-block'
import AppMarkdown from '@/components/common/app-markdown'
import LangService from '@/domain/services/lang-service'
import HttpError from '@/domain/errors/http-error'
import AppCardRequest from '@/components/common/app-request-card'

export default {
  components: {
    AppInfoBlock,
    AppMarkdown,
    AppForm,
    AppCardRequest,
  },
  data() {
    return {
      isLoading: false,
      request: null,
      requestForm: null,
      userRequests: [],
      requestId: null,
    }
  },

  computed: {
    alert() {
      return {
        text: this.requestText,
        type: this.mapStatusToAlertType,
      }
    },
    requestsRemaining() {
      if (!this.request.userSendingLimit) {
        // если ограничений нет, то загрузить можно сколько угодно
        return Number.MAX_SAFE_INTEGER
      }
      return this.request.userSendingLimit - this.userRequests.length
    },
    isFormHidden() {
      return (
        this.request.isUserSendingLimitReached ||
        this.requestsRemaining === 0 ||
        this.request.isSendingLimitReached ||
        this.dateExpired
      )
    },
    dateExpired() {
      return this.requestStatus === TIME_STATUSES.ENDED
    },
    requestStatus() {
      return this.request.timeStatus
    },
    requestText() {
      const dateRange = [
        this.fromISOToString(this.request.startedAt),
        this.fromISOToString(this.request.endedAt),
      ]

      if (this.requestStatus === TIME_STATUSES.IN_PROGRESS) {
        return this.$tr(this.getRequestI18n('requestStatus.inProgress'), [
          dateRange[0],
          dateRange[1],
        ])
      }
      if (this.requestStatus === TIME_STATUSES.WILL_START) {
        return this.$tr(this.getRequestI18n('requestStatus.willStart'), [dateRange[0]])
      }
      if (this.requestStatus === TIME_STATUSES.ENDED) {
        return this.$tr(this.getRequestI18n('requestStatus.ended'), [dateRange[1]])
      }
      return ''
    },
    mapStatusToAlertType() {
      if (this.requestStatus === TIME_STATUSES.IN_PROGRESS) {
        return 'success'
      }
      if (this.requestStatus === TIME_STATUSES.WILL_START) {
        return 'warning'
      }
      if (this.requestStatus === TIME_STATUSES.ENDED) {
        return 'error'
      }
      return 'info'
    },
  },
  watch: {
    '$route.params.requestId': {
      handler() {
        this.getData()
      },
      immediate: true,
    },
  },

  methods: {
    fromStringToISO,
    fromISOToString,
    DateTime,

    getRequestI18n(key) {
      return `request.${this.request.category}.` + key
    },
    async getData() {
      this.isLoading = true
      try {
        this.requestId = this.$route.params.requestId
        await this.fetchRequest()
        if (!this.request.formId) {
          await LangService.toLocalePath({ path: '/404' })
        }
        await this.fetchUserRequests()
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async handleSubmitForm({ form }) {
      await this.createRequest(form)
      await this.fetchUserRequests()
      await this.fetchRequest()
    },
    async createRequest(form) {
      try {
        await useRequest().createRequest({ form, requestId: this.request.id })
        window.scrollTo(0, 0)
        this.$Message.success(this.$tr(this.getRequestI18n('sendSuccessMessage')))
      } catch (e) {
        if (e instanceof HttpError) {
          this.$Message.error(e.message)
        } else {
          console.error(e)
        }
      }
    },
    async deleteUserRequest(id) {
      try {
        await useRequest().deleteUserRequests(id)
        await this.fetchUserRequests()
        await this.fetchRequest()
        this.$Message.success(this.$tr(this.getRequestI18n('deleteSuccess')))
      } catch (e) {
        console.error(e)
      }
    },
    async fetchRequest() {
      try {
        this.request = await useRequest().getRequest(this.requestId)
      } catch (e) {
        console.error(e)
      }
    },
    async fetchUserRequests() {
      try {
        const userRequests = await useRequest().getUserRequests(
          this.requestId,
          this.$store.state.auth.userId,
          this.request.category,
        )
        this.userRequests = userRequests.map((r) => ({
          ...r.request,
          requestId: r.id,
          createdAt: r.createdAt,
          status: r.status,
          comment: r.comment,
        }))
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/pages/request.scss';
</style>
