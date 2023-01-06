<template>
  <div class="auth success-page">
    <div class="auth__header auth-header">
      <div class="auth-header__actions auth-header__actions--no-back-button">
        <AppHeaderActions />
      </div>
    </div>
    <div class="s-h3 auth__title">
      {{ $tr('resetSuccess.title') }}
    </div>
    <div class="auth__card s-card s-card--no-padding row">
      <div class="col-12 col-md-5 divider">
        <div class="success">
          <div class="success__image-wrapper">
            <SuccessIcon />
          </div>
          <div class="success__text">
            {{ $tr('resetSuccess.text') }}
          </div>
          <div class="success-page__submit">
            <Button type="primary" long @click="submit">
              {{ $tr('resetSuccess.submit') }}
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
</template>

<script>
import { mapState } from 'vuex'
import AppEventInfo from '@/components/base/app-event-info'
import AppEventContactInfo from '@/components/common/app-event-contact-info'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import SuccessIcon from '@/components/themed-icons/success'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
    AppHeaderActions,
    SuccessIcon,
  },
  computed: {
    ...mapState({ event: (state) => state.event.data }),
  },

  methods: {
    submit() {
      this.$toLocalePath({ path: `/login` })
    },
  },
  head() {
    return { title: this.$tr('resetSuccess.title') }
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/components/success.scss';
</style>
