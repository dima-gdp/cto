<template>
  <div id="theme">
    <AppHeader v-if="$isLoggedIn" />

    <main class="main _container">
      <router-view />
    </main>
  </div>
</template>
<script>
import AppHeader from '@/components/base/header/app-header'

export default {
  components: {
    AppHeader,
  },
}
</script>

<style lang="scss">
@import '@/styles/base';
</style>
