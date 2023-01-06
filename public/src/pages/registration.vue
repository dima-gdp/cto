<template>
  <div class="registration">
    <div class="auth__header auth-header">
      <div class="auth-header__actions">
        <div class='header-back'>
          <div class="header-back__content s-card s-card--no-padding" @click="goToBackDestination">
            <span class="header-back__back-icon">
              <DirectionLeftIcon />
            </span>
            <span class="header-back__text s-subtitle-secondary">
              {{ backDestinationText }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <h1 class="registration__title auth__title">
      {{ $tr('registration.title') }}
    </h1>
    <div class="s-card registration__registration-form">
      <AppForm :form-id="event.formLink.formId" @submit="handleRegFormSubmit">
        <template #submit="{ submit: formSubmit }">
          <Portal to="registration-submit">
            <Button
              type="primary"
              size="large"
              :disabled="isLoading"
              class="registration-footer__submit"
              @click="formSubmit"
            >
              {{ $tr('registration.submitBtn') }}
            </Button>
          </Portal>
        </template>
      </AppForm>
    </div>
    <div class="registration__registration-footer">
      <div class="row registration-footer">
        <div class="col-sm-12 col-lg-4 registration-footer__submit-wrapper">
          <PortalTarget name="registration-submit"></PortalTarget>
        </div>
        <div class="col-sm-12 col-lg-8">
          <AppContentItems class="registration-footer__content-items" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AppForm from '@/components/common/app-form'
import useForm from '@/domain/composables/use-form'
import AppContentItems from '@/components/common/app-content-items'
import LangService from '@/domain/services/lang-service'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'
import AuthService from '@/domain/services/auth-service'
import AppLoadService from '@/domain/services/app-load-service'
import useUser from '@/domain/composables/use-user'
// todo: разобраться с заходом по прямой ссылке во внутреннее мероприятие пользователя, зареганного на родительском
export default {
  components: {
    AppForm,
    AppContentItems,
    DirectionLeftIcon,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      event: (state) => state.event.data,
    }),

    backDestinationText() {
      if (this.$store.getters['isActiveEventIsChild']) {
        return this.$tr('registration.back.events')
      }
      return this.$tr('registration.back.login')
    },
  },

  methods: {
    async handleRegFormSubmit({ form }) {
      this.isLoading = true

      try {
        const { email: userEmail } = this.$store.state.auth.userData
        const { createRegistrationData } = useForm()

        await createRegistrationData({
          form,
          eventId: this.event.id,
          userId: this.$store.state.auth.userId,
        })

        this.$gtm.trackEvent({ event: 'reg-anketa' })

        const { getUser } = useUser()
        const user = await getUser(this.$store.state.auth.userId)
        this.$store.commit('auth/SET_USER_DATA', user)

        await LangService.toLocalePath({
          path: '/registration/success',
          query: { email: userEmail.toLowerCase() },
        })
      } catch (e) {
        this.$Message.error(this.$tr('registration.errors.create'))
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async goToBackDestination() {
      if (this.$store.getters['isActiveEventIsChild']) {
        this.$store.commit('SET_APP_IS_LOADING', true)
        try {
          await this.loadFullEvent(this.$store.getters['domain/parentEventId'])
          await LangService.toLocalePath({ path: '/events' })
        } catch (e) {
          await LangService.toLocalePath({ path: '/404' })
        } finally {
          this.$store.commit('SET_APP_IS_LOADING', false)
        }
      } else {
        const auth = new AuthService()
        auth.unsetAuthData()
        await LangService.toLocalePath({ path: '/login' })
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/registration-page.scss';
@import '~@/styles/pages/login.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
