<template>
  <error-content code="404" desc="Такой страницы не существует" :src="src" />
</template>

<script>
import error404 from '@/assets/images/error-page/error-404.svg'
import errorContent from './error-content.vue'
export default {
  name: 'Error404',
  components: {
    errorContent,
  },
  data() {
    return {
      src: error404,
    }
  },
}
</script>
