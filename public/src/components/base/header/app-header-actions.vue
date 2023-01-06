<template>
  <div class="header-actions">
    <AppLangSwitcher :placement="placement" />
    <div v-if="$isLoggedIn" class="s-card s-card--no-padding" @click="logout">
      <div class="header-actions__item">
        <feather type="log-out" size="24" stroke="var(--s-black-color-80)" />
      </div>
    </div>
  </div>
</template>

<script>
import AppLangSwitcher from '@/components/base/app-lang-switcher'
import AuthService from '@/domain/services/auth-service'
import LangService from '@/domain/services/lang-service'

export default {
  components: {
    AppLangSwitcher,
  },
  inject: ['loadFullEvent'],
  props: {
    placement: {
      type: String,
      default: 'bottom-end',
    },
  },
  methods: {
    async logout() {
      const auth = new AuthService()
      auth.unsetAuthData()

      if (this.$store.getters['isActiveEventIsChild']) {
        const parentEventId = this.$store.getters['domain/parentEventId']

        this.$store.commit('SET_APP_IS_LOADING', true)
        try {
          await this.loadFullEvent(parentEventId)
        } catch (e) {
          console.error(e)
          await LangService.toLocalePath({ path: '/404' })
        } finally {
          this.$store.commit('SET_APP_IS_LOADING', false)
        }
      }

      await this.$toLocalePath({ path: '/login' })
    },
  },
}
</script>
<style lang="scss">
.header-actions {
  display: flex;
  align-items: flex-start;
  position: relative;

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--s-black-color-80);
    height: 40px;
    width: 40px;
    padding: 8px;
    cursor: pointer;
  }

  .s-card {
    margin-left: 16px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
