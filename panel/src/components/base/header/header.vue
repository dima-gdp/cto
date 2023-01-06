<template>
  <div class="header header-container">
    <div class="header__logo">
      <img src="@/assets/images/mero-place-logo.svg" class="" alt="logo Mero place" />
    </div>
    <div class="header__profile">
      <div class="header__user-info">
        <div class="header__icon">
          <Icon type="ios-contact-outline" class="header__icon-user" />
        </div>
        <div class="header__user">{{ getFullName }}</div>
      </div>
      <Button class="header__button-exit" type="error" ghost @click="logout">Выйти</Button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFullName } from '@/domain/user'

export default {
  computed: {
    getFullName() {
      return getFullName(this.$store.state.user.userName, this.$store.state.user.lastName)
    },
  },

  methods: {
    ...mapActions(['handleLogOut']),
    async logout() {
      try {
        await this.handleLogOut()
        await this.$router.push({ path: '/login' })
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less">
@import './header.less';
</style>
