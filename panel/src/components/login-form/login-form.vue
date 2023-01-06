<template>
  <Form ref="loginForm" :model="form" class="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" class="form__input" size="large" placeholder="Логин" />
    </FormItem>
    <FormItem prop="password">
      <Input
        v-model="form.password"
        class="form__input"
        size="large"
        type="password"
        placeholder="Пароль"
      />
    </FormItem>
    <FormItem>
      <Button type="primary" class="form__button" long @click="handleSubmit"> Авторизоваться </Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
      },
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
      },
    },
  },
  data() {
    return {
      form: {
        userName: '',
        password: '',
      },
    }
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
      }
    },
  },
  methods: {
    handleSubmit() {
      this.loading = true
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
          })
        }
      })
    },
  },
}
</script>


<style lang="less">
@import './login-form.less';
</style>
