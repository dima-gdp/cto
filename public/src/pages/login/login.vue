<template>
  <div class="content">
    <div class="auth">
      <div class="auth__header auth-header">
        <div
          class="auth-header__actions"
          :class="externalLink ? '' : 'auth-header__actions--no-back-button'"
        >
          <div v-if="externalLink" class="header-back">
            <a class="header-back__content s-card s-card--no-padding" :href="externalLink">
              <span class="header-back__back-icon">
                <DirectionLeftIcon />
              </span>
              <span class="header-back__text s-subtitle-secondary">
                {{ $tr('auth.backDist') }}
              </span>
            </a>
          </div>
          <AppHeaderActions />
        </div>
      </div>
      <div class="s-h2 auth__title">
        {{ $tr('auth.title') }}
      </div>
      <div class="auth__card s-card s-card--no-padding s-card--no-margin row">
        <div class="col-12 col-md-5 divider">
          <div class="auth__authform authform">
            <Form ref="authForm" :hide-required-mark="true" class="authform__form">
              <FormItem
                label="Email"
                prop="email"
                class="authform__form-item"
                :error="emailErrorMessage"
              >
                <Input
                  ref="emailInput"
                  v-model="authForm.email"
                  type="email"
                  :placeholder="$tr('auth.email.placeholder')"
                  :suffix="formView.emailSuffix"
                  :disabled="formView.isEmailDisabled"
                  @suffixClick="backToEmailState"
                  @keydown.enter.native.prevent="execute"
                />
              </FormItem>
              <transition name="fade">
                <div v-show="formState === $options.FORM_STATES.ENTER_PASSWORD">
                  <FormItem
                    :label="$tr('auth.password.label')"
                    prop="password"
                    class="authform__form-item"
                    :error="passErrorMessage"
                  >
                    <Input
                      ref="passInput"
                      v-model="authForm.password"
                      :placeholder="$tr('auth.password.placeholder')"
                      :type="isPassVisible ? 'text' : 'password'"
                      suffix="eye"
                      @suffixClick="isPassVisible = !isPassVisible"
                      @keydown.enter.native.prevent="execute"
                    />
                  </FormItem>
                </div>
              </transition>
            </Form>
            <div
              v-if="formState === $options.FORM_STATES.ENTER_PASSWORD"
              class="authform__password-recovery s-link"
            >
              <router-link
                :to="localePath({ path: '/login/recovery', query: { email: authForm.email } })"
              >
                {{ $tr('auth.recoveryPassword') }}
              </router-link>
            </div>
            <div class="authform__submit">
              <Button :disabled="formView.isSubmitDisabled" type="primary" long @click="execute">
                {{ formView.submitButtonText }}
              </Button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="auth__event-info-main">
            <AppEventInfo :event="event" />
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
import useUser from '@/domain/composables/use-user'
import loginService from '@/domain/services/login-service/login-service'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'

const FORM_STATES = {
  ENTER_EMAIL: 'email',
  ENTER_PASSWORD: 'password',
}

export default {
  FORM_STATES,
  components: {
    AppEventInfo,
    AppEventContactInfo,
    DirectionLeftIcon,
    AppHeaderActions,
  },
  data() {
    return {
      formState: FORM_STATES.ENTER_EMAIL,
      isEmailValid: true,
      emailErrorMessage: '',
      isPassValid: true,
      isPassVisible: false,
      passErrorMessage: '',
      authForm: {
        email: '',
        password: '',
      },
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      event: (state) => state.event.data,
      authGroupId: (state) => state.domain.data.authGroupId,
    }),

    formView() {
      if (this.formState === FORM_STATES.ENTER_EMAIL) {
        return {
          emailSuffix: '',
          isEmailDisabled: false,
          isSubmitDisabled: !this.isEmailValid || this.authForm.email === '' || this.isLoading,
          submitButtonText: this.$tr('auth.submit'),
        }
      }
      return {
        emailSuffix: 'edit-3',
        isEmailDisabled: true,
        isSubmitDisabled: !this.isPassValid || this.authForm.password === '' || this.isLoading,
        submitButtonText: this.$tr('auth.submitEnter'),
      }
    },

    externalLink() {
      return this.event?.formLink?.externalUrl
    },
  },
  watch: {
    // todo: невозможность пользоваться iview+asyncValidator для данного кейса
    // написан простенький синхронный вариант, не подразумевающий добавлять разные тексты ошибок
    'authForm.email': function (val) {
      const isValid = loginService.validateEmail(val)
      this.isEmailValid = isValid
      if (!isValid) {
        this.emailErrorMessage =
          val === ''
            ? this.$tr('auth.email.errorMessageLack')
            : this.$tr('auth.email.errorMessageFormat')
      } else {
        this.emailErrorMessage = ''
      }
    },
    'authForm.password': function (val) {
      const isValid = loginService.validatePassword(val)
      this.isPassValid = isValid

      if (!isValid) {
        this.passErrorMessage =
          val === ''
            ? this.$tr('auth.password.errorMessage')
            : this.$tr('auth.password.errorLength')
      } else {
        this.passErrorMessage = ''
      }
    },
  },
  created() {},
  mounted() {
    this.$refs.emailInput.focus()
  },
  methods: {
    async backToEmailState() {
      this.authForm.email = ''
      await this.updateFormState(FORM_STATES.ENTER_EMAIL)
      this.$refs.emailInput.focus()
    },

    async execute() {
      if (this.formView.isSubmitDisabled) {
        return
      }
      this.isLoading = true
      if (this.formState === FORM_STATES.ENTER_EMAIL) {
        await this.handleEmailInput()
      } else if (this.formState === FORM_STATES.ENTER_PASSWORD) {
        await this.handlePasswordInput()
      }
      this.isLoading = false
    },

    async handleEmailInput() {
      const isUserExists = await this.isUserExist()
      if (!isUserExists) {
        await loginService
          .executeStrategy(loginService.USER_STRATEGY_NAMES.UNREGISTERED, this.event, this.authForm)
          .catch((e) => {
            this.$Message.error(e.message)
            console.error(e)
          })
      } else {
        await this.updateFormState(FORM_STATES.ENTER_PASSWORD)
        this.$refs.passInput.focus()
      }
    },

    async updateFormState(state) {
      this.formState = state
      await this.$nextTick() // там transition
    },

    async handlePasswordInput() {
      await loginService
        .executeStrategy(loginService.USER_STRATEGY_NAMES.FAMILIAR, this.event, this.authForm)
        .catch((e) => {
          this.$Message.error(e.message)
          this.authForm.password = ''
        })
    },

    async isUserExist() {
      this.isLoading = true
      const isExist = await useUser()
        .isEmailInAuthGroup(this.authForm.email, this.authGroupId)
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          this.isLoading = false
        })
      return isExist
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
