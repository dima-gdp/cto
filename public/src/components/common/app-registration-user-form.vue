<template>
  <div class="registration-form">
    <Form ref="userForm" :model="userModel" :rules="validateUserRules">
      <div class="registration-form-group">
        <h3 class="registration-form-group__title">
          {{ $tr('registration.profileTitle') }}
        </h3>
        <div class="row">
          <FormItem
            :label="$tr('registration.email')"
            class="col-12 col-md-6 col-lg-4"
            prop="email"
          >
            <Input v-model="userModel.email" disabled />
          </FormItem>
          <FormItem
            :label="$tr('registration.passwordTitle')"
            class="col-12 col-md-6 col-lg-4"
            prop="password"
          >
            <Input
              v-model="userModel.password"
              :placeholder="$tr('registration.passwordPh')"
              type="password"
            />
          </FormItem>
          <FormItem
            :label="$tr('registration.repeatPasswordTitle')"
            class="col-12 col-md-6 col-lg-4"
            prop="passwordRepeat"
          >
            <Input
              v-model="userModel.passwordRepeat"
              :placeholder="$tr('registration.passwordPh')"
              type="password"
            />
          </FormItem>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'form',
    event: 'updateFormModel',
  },

  props: {
    form: { type: Object, default: () => ({}) },
    eventData: { type: Object, default: () => ({}) },
  },

  data() {
    const repeatEqual = (rule, value, cb) => {
      if (value !== this.userModel.password) {
        cb(new Error(this.$tr('registration.repeatEqual')))
      } else {
        cb()
      }
    }

    return {
      userModel: {
        ...this.form,
        isValid: false,
      },
      validateUserRules: {
        email: [{ required: true, message: this.$tr('initValidation.required'), trigger: 'blur' }],
        password: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { min: 6, message: this.$tr('auth.password.errorLength') },
          { max: 255, message: this.$tr('auth.password.errorLengthMax') },
        ],
        passwordRepeat: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { validator: repeatEqual, trigger: 'blur' },
        ],
      },
    }
  },

  watch: {
    userModel: {
      async handler(value) {
        if (!this.$refs.userForm) {
          return
        }
        const isValid = await this.$refs.userForm.validate()

        this.$emit('updateFormModel', {
          ...value,
          isValid,
        })
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/blocks/registration.scss';
</style>
