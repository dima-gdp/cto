<template>
  <div class="registration" @keypress.enter="handleUserCreate">
    <div class="auth__header auth-header">
      <div class="auth-header__actions">
        <div class='header-back'>
          <router-link
            class="header-back__content s-card s-card--no-padding"
            :to="localePath({ path: '/login' })"
          >
            <span class="header-back__back-icon">
              <DirectionLeftIcon />
            </span>
            <span class="header-back__text s-subtitle-secondary">
              {{ $tr('registration.auth') }}
            </span>
          </router-link>

        </div>
      </div>
    </div>
    <h1 class="registration__title auth__title">
      {{ $tr('registration.title') }}
    </h1>
    <div class="s-card registration__registration-form registration-form">
      <AppRegistrationUserForm v-model="userModel" />
    </div>
    <div class="registration__registration-footer registration-footer">
      <div class="row">
        <div class="col-12 text-right">
          <Button
            :disabled="isLoading"
            type="primary"
            size="large"
            class="registration-footer__submit"
            @click="handleUserCreate"
          >
            {{ $tr('registration.next') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppRegistrationUserForm from '@/components/common/app-registration-user-form'
import AuthAuthStrategy from '@/domain/services/login-service/strategies/auth-auth-strategy'
import UserService from '@/domain/services/user-service'
import LangService from '@/domain/services/lang-service'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'

export default {
  components: {
    AppRegistrationUserForm,
    DirectionLeftIcon,
  },
  data() {
    return {
      userModel: {
        email: this.$route.query.email,
        password: '',
        passwordRepeat: '',
      },
      isLoading: false,
      isDataSent: false,
    }
  },

  computed: {
    ...mapState({
      eventData: (state) => state.event.data,
    }),
  },
  methods: {
    async handleUserCreate() {
      const isUserFormValid = this.userModel.isValid
      this.isLoading = true
      try {
        if (isUserFormValid && !this.isDataSent) {
          delete this.userModel.isValid

          await this.createUser()
          await this.authUser()
          this.isDataSent = true
          await LangService.toLocalePath({ path: `/registration` })
        }
      } catch (e) {
        this.$Message.error(e.message)
      } finally {
        this.isLoading = false
      }
    },
    async authUser() {
      const authAuthStrategy = new AuthAuthStrategy(this.eventData, this.userModel)
      try {
        await authAuthStrategy.execute()
      } catch (e) {
        this.$Message.error(e.message)
      }
    },
    async createUser() {
      const user = await UserService.createUser(this.userModel.email, this.userModel.password)
      this.$store.commit('auth/SET_USER_DATA', user)
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/registration-page.scss';
@import '~@/styles/pages/login.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
