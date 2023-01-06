<template>
  <div class="success-page auth">
    <div class="auth__header auth-header">
      <div class="auth-header__actions auth-header__actions--no-back-button">
        <AppHeaderActions />
      </div>
    </div>
    <div class="s-h3 auth__title">
      {{ $tr('emailConfirm.title') }}
    </div>
    <div
      class="auth__card s-card s-card--no-padding row"
      style="position: relative; min-height: 400px"
    >
      <template v-if="!isLoading">
        <div class="col-12 col-md-5 divider">
          <div class="success">
            <div class="success__image-wrapper">
              <SuccessIcon />
            </div>
            <div class="success__text">
              {{ $tr('emailConfirm.text') }}
            </div>
            <div class="success-page__submit">
              <Button type="primary" long :to="localePath({ path: `/event/${event.id}/profile` })">
                {{ $tr('emailConfirm.submit') }}
              </Button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="auth__event-info-main">
            <AppEventInfo :alert="false" :event="event" />
          </div>
          <div class="auth__event-info-contacts">
            <AppEventContactInfo :event="event" />
          </div>
        </div>
      </template>
      <Spin v-else fix></Spin>
    </div>
  </div>
</template>

<script>
import AppEventInfo from '@/components/base/app-event-info'
import AppEventContactInfo from '@/components/common/app-event-contact-info'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import SuccessIcon from '@/components/themed-icons/success'
import { mapState } from 'vuex'
import { getExistingApiInstance } from '@/api'
import { STATUS_EMAIL_TOKEN_ENUM } from '@/utils/constants'
import useUser from '@/domain/composables/use-user'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
    AppHeaderActions,
    SuccessIcon,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapState({ event: (state) => state.event.data }),
  },
  async created() {
    await this.validateEmail()
  },
  methods: {
    async validateEmail() {
      const api = getExistingApiInstance()
      this.isLoading = true
      try {
        const { data } = await api.user.validateEmailToken({ token: this.$route.params.token })
        if (data.status === STATUS_EMAIL_TOKEN_ENUM.VALID) {
          const { getUser } = useUser()
          const user = await getUser(this.$store.state.auth.userId)
          this.$store.commit('auth/SET_USER_DATA', user)
        } else {
          // todo: состояние не отрисованно в интерфейсе
          console.error('Неверный токен подтверждения почты!')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/components/success.scss';
</style>
