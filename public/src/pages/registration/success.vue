<template>
  <div class="success-page auth">
    <div class="auth__header auth-header">
      <div class="auth-header__actions auth-header__actions--no-back-button">
        <AppHeaderActions />
      </div>
    </div>
    <div class="s-h3 auth__title">
      {{ $tr('registrationSuccess.title') }}
    </div>
    <div class="auth__card s-card s-card--no-padding row">
      <div class="col-12 col-md-5 divider">
        <div class="success">
          <div class="success__image-wrapper">
            <SuccessIcon />
          </div>
          <div class="success__text">
            {{ $tr('registrationSuccess.firstSentence') }}
            <span class="success__email s-link">{{ email }}</span
            >,
            {{ $tr('registrationSuccess.secondSentence') }}
          </div>
          <div class="success-page__submit">
            <Button type="primary" long @click="submit">
              {{ $tr('registrationSuccess.submit') }}
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppEventInfo from '@/components/base/app-event-info'
import AppEventContactInfo from '@/components/common/app-event-contact-info'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import SuccessIcon from '@/components/themed-icons/success'
import EventService from '@/domain/services/event-service'
import LangService from '@/domain/services/lang-service'

export default {
  components: {
    AppEventInfo,
    AppEventContactInfo,
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
  methods: {
    async submit() {
      const pages = this.$store.state.pages.data
      const startPagePath = EventService.defineStartPagePath(this.event, pages)
      await LangService.toLocalePath({ path: startPagePath })
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/login.scss';
@import '~@/styles/components/success.scss';
</style>
