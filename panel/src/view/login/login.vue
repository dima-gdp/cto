<template>
  <Row class="login">
    <i-col :lg="6" :md="14" :sm="18" :xs="24">
      <!-- Alert -->
      <Alert v-if="showError" type="error" show-icon>
        Не удается войти.
        <span slot="desc"> Пожалуйста, проверьте правильность написания логина и пароля. </span>
      </Alert>

      <!-- Logo -->
      <div class="login-logo">
        <div>
          <img
            src="@/assets/images/mero-place-logo.svg"
            class="login-logo__img"
            alt="logo Mero place"
          />
        </div>
      </div>

      <!-- Login form -->
      <div icon="log-in">
        <div class="form-con">
          <LoginForm @on-success-valid="handleSubmit"></LoginForm>
        </div>
      </div>
    </i-col>
    <Spin v-if="loading" size="large" fix></Spin>
  </Row>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      showError: false,
      loading: false,
    }
  },
  computed: {
    errorList() {
      return this.$store.state.app.errorList.filter((error) => error.code === 401)
    },
  },
  watch: {
    errorList(newValue, oldValue) {
      this.showError = this.errorList.length > 0 && newValue !== oldValue
    },
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit({ userName, password }) {
      this.loading = true
      this.handleLogin({ userName, password })
        .then((res) => {
          this.getUserInfo().then((res) => {
            if (res.role === 'administrator' || res.role === 'it') {
              this.$router.push('/domains/list')
            } else {
              this.$router.push('/select-event')
            }
          })
        })
        .catch((error) => {
          console.error(error)
          this.loading = false
          this.$Notice.error({
            title: 'Ошибка авторизации',
            desc: 'Проверьте логин/пароль и попробуйте снова',
          })
        })
    },
  },
}
</script>

<style lang="less">
@import './login.less';
</style>
