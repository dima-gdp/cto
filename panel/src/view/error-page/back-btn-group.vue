<template>
  <div>
    <Button size="large" type="text" @click="backHome">
      Вернуться на главную ({{ second }} сек)
    </Button>
    <Button size="large" type="text" @click="backPrev"> Назад </Button>
  </div>
</template>

<script>
import './error.less'
export default {
  name: 'BackBtnGroup',
  data() {
    return {
      second: 15,
      timer: null,
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) {
        this.backHome()
      } else {
        this.second--
      }
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    backHome() {
      this.$router.replace({
        name: this.$config.homeName,
      })
    },
    backPrev() {
      this.$router.go(-1)
    },
  },
}
</script>
