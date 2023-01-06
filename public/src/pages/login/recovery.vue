<template>
  <div class="content">
    <div class="recover auth">
      <div class="auth__header auth-header">
        <div class="auth-header__actions">
          <div class="header-back">
            <router-link
              class="header-back__content s-card s-card--no-padding"
              :to="localePath({ path: '/login' })"
            >
              <span class="header-back__back-icon">
                <DirectionLeftIcon />
              </span>
              <span class="header-back__text s-subtitle-secondary">
                {{ $tr('recover.backDist') }}
              </span>
            </router-link>
          </div>
          <AppHeaderActions />
        </div>
      </div>
      <div class="s-h3 auth__title">
        {{ $tr('recover.title') }}
      </div>
      <div class="auth__card s-card s-card--no-padding row">
        <div class="col-12 col-md-5 divider">
          <div class="auth__authform recoverForm">
            <Form
              ref="recoverForm"
              :model="recoverForm"
              :rules="ruleValidate"
              :hide-required-mark="true"
              class="authform__form"
              @submit.native.prevent
            >
              <FormItem label="Email" prop="email" class="authform__form-item">
                <Input
                  ref="emailInput"
                  v-model="recoverForm.email"
                  :placeholder="$tr('auth.email.placeholder')"
                  @keydown.enter.native.prevent="submitFrom('recoverForm')"
                />
              </FormItem>
            </Form>
            <div class="authform__submit">
              <Button type="warning" long :disabled="isLoading" @click="submitFrom('recoverForm')">
                {{ $tr('recover.submit') }}
              </Button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="auth__event-info-main">
            <AppEventInfo :show-date="false" :event="event" />
          </div>
          <div class="auth__event-info-contacts">
            <AppEventContactInfo :event="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppEventInfo from '@/components/base/app-event-info'
import AppEventContactInfo from '@/components/common/app-event-contact-info'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'
import { getExistingApiInstance } from '@/api'
import LangService from '@/domain/services/lang-service'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
    DirectionLeftIcon,
    AppHeaderActions,
  },
  data() {
    return {
      recoverForm: {
        email: this.$route.query.email,
      },
      ruleValidate: {
        email: [
          { required: true, message: this.$tr('auth.email.errorMessageLack'), trigger: 'blur' },
          { type: 'email', message: this.$tr('auth.email.errorMessageFormat'), trigger: 'blur' },
        ],
      },
      isLoading: false,
    }
  },

  computed: {
    ...mapState({
      event: (state) => state.event.data,
    }),
  },

  methods: {
    async submitFrom(form) {
      const isValid = await this.$refs[form].validate()
      isValid && (await this.recover())
    },
    async recover() {
      this.isLoading = true
      // todo: должно быть в use-функции
      const api = getExistingApiInstance()
      const payload = {
        email: this.recoverForm.email.toLowerCase(),
        eventId: this.event.id,
        authGroupId: this.$store.getters['domain/currentAuthGroupId'],
      }
      await api.user
        .requestPasswordRequest(payload)
        .then(() => {
          this.$gtm.trackEvent({ event: 'pass-reset' })
          this.recoverSuccess()
        })
        .catch((e) => {
          this.recoverError(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    recoverError(e) {
      this.$refs.emailInput.focus()
      console.error(e)
      this.$Message.error(this.$tr('recover.error'))
    },
    recoverSuccess() {
      LangService.toLocalePath({
        path: '/login/check-email',
        query: { email: this.recoverForm.email.toLowerCase() },
      })
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
