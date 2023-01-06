<template>
  <div class="recover-success auth">
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
              {{ $tr('checkEmail.backDist') }}
            </span>
          </router-link>
        </div>
        <AppHeaderActions />
      </div>
    </div>
    <div class="s-h3 auth__title">
      {{ $tr('checkEmail.title') }}
    </div>
    <div class="auth__card s-card s-card--no-padding row">
      <div class="col-12 col-md-5 divider">
        <div class="success">
          <div class="success__image-wrapper">
            <SuccessIcon />
          </div>
          <div class="success__text">
            {{ $tr('checkEmail.firstSentence') }}
            <span class="success__email s-link">{{ email }}</span>
            {{ $tr('checkEmail.secondSentence') }}
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
import DirectionLeftIcon from '@/components/themed-icons/direction-left'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
    DirectionLeftIcon,
    AppHeaderActions,
    SuccessIcon,
  },
  data() {
    return {
      email: this.$route.query.email ? this.$route.query.email.toLowerCase() : '',
    }
  },
  computed: {
    ...mapState({ event: (state) => state.event.data }),
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/components/success.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
