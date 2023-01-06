<template>
  <div id="app">
    <AppLoader>
      <component :is="currentLayout" />
    </AppLoader>
  </div>
</template>
<script>
import layouts from '@/layouts'
import AppLoader from '@/components/base/app-loader'

export default {
  components: {
    AppLoader,
  },
  computed: {
    currentLayout() {
      return layouts[this.$route.meta.layout]
    },
  },
}
</script>
