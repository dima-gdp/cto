<template>
  <div class="content">
    <div class="auth">
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
                {{ $tr('resetPassword.backDist') }}
              </span>
            </router-link>
          </div>
          <AppHeaderActions />
        </div>
      </div>
      <div class="s-h3 auth__title">
        {{ $tr('resetPassword.title') }}
      </div>
      <div class="auth__card s-card s-card--no-padding row">
        <div class="col-12 col-md-5 divider">
          <div class="auth__authform recoverForm">
            <Form
              ref="resetForm"
              :model="resetForm"
              :rules="ruleValidate"
              :hide-required-mark="true"
              class="authform__form"
              @submit.native.prevent
            >
              <FormItem
                :label="$tr('resetPassword.password.label')"
                prop="password"
                class="authform__form-item"
              >
                <Input
                  v-model="resetForm.password"
                  :placeholder="$tr('auth.password.placeholder')"
                  :type="typePass"
                  suffix="eye"
                  @suffixClick="isPassVisible = !isPassVisible"
                />
              </FormItem>
              <FormItem
                :label="$tr('resetPassword.passwordConfirm.label')"
                prop="passwordConfirm"
                class="authform__form-item"
              >
                <Input
                  v-model="resetForm.passwordConfirm"
                  :placeholder="$tr('auth.password.placeholder')"
                  :type="typePassConfirm"
                  suffix="eye"
                  @suffixClick="isPassConfirmVisible = !isPassConfirmVisible"
                  @keydown.enter.native.prevent="submitForm"
                />
              </FormItem>
            </Form>
            <div class="authform__submit">
              <Button :disabled="!isValid || isLoading" type="warning" long @click="submitForm">
                {{ $tr('resetPassword.submit') }}
              </Button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="auth__event-info-main">
            <AppEventInfo show-date="false" :event="event" />
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
import { getExistingApiInstance } from '@/api'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
    DirectionLeftIcon,
    AppHeaderActions,
  },
  data() {
    const equalPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$tr('resetPassword.passwordConfirm.ruleLack')))
      } else if (value !== this.resetForm.password) {
        callback(new Error(this.$tr('resetPassword.passwordConfirm.ruleDiff')))
      } else {
        callback()
      }
    }
    return {
      isPassVisible: false,
      isLoading: false,
      isPassConfirmVisible: false,
      errorPassword: false,
      locale: this.$route.query.lang,
      resetForm: {
        password: '',
        passwordConfirm: '',
      },
      ruleValidate: {
        password: [
          { required: true, message: this.$tr('auth.password.errorMessage'), trigger: 'blur' },
          { min: 6, message: this.$tr('auth.password.errorLength') },
        ],
        passwordConfirm: [{ validator: equalPassCheck, trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapState({ event: (state) => state.event.data }),

    typePass() {
      return this.isPassVisible ? 'text' : 'password'
    },
    typePassConfirm() {
      return this.isPassConfirmVisible ? 'text' : 'password'
    },
    isValid() {
      if (!this.isBothEdit) {
        return false
      } else {
        let val = false
        this.$refs.resetForm.validate((valid) => {
          val = valid
        })
        return val
      }
    },
    isBothEdit() {
      return this.resetForm.password !== '' && this.resetForm.passwordConfirm !== ''
    },
  },
  methods: {
    submitForm() {
      const api = getExistingApiInstance()
      const data = {
        password: this.resetForm.password,
        repeatPassword: this.resetForm.passwordConfirm,
        token: this.$route.params.slug,
        authGroupId: this.$store.getters['domain/currentAuthGroupId'],
      }
      this.isLoading = true
      api.user
        .changePassword(data)
        .then(() => {
          this.changePassSuccess()
        })
        .catch(() => this.changePassError())
        .finally(() => {
          this.isLoading = false
        })
    },
    changePassSuccess() {
      this.$toLocalePath({ path: '/login/reset-success' })
    },
    changePassError() {
      this.$Message.error(this.$tr('resetPassword.errorMessage'))
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
