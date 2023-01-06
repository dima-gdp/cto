<template>
  <div>
    <Form ref="userForm" :model="userModel" :rules="validateUserRules">
      <div class="registration-form-group registration-form-group--divider">
        <div class="row">
          <FormItem class="col-12 col-md-6 col-lg-4" prop="email" label="Email">
            <Input
              v-model="userModel.email"
              :suffix="suffixLockEmail"
              :disabled="isEmailLocked"
              @suffixClick="isEmailLocked = !isEmailLocked"
            />
          </FormItem>

          <FormItem v-if="!isEmailLocked" class="col-12 col-md-6 col-lg-4">
            <Button :disabled="isLoading" class="ivu-btn-primary-light" long @click="updateEmail">
              {{ $tr('profile.saveEmail') }}
            </Button>
          </FormItem>
        </div>
        <div class="row">
          <FormItem
            :label="$tr('profile.password.label')"
            class="col-12 col-md-6 col-lg-4"
            prop="oldPassword"
          >
            <Input
              v-model="userModel.oldPassword"
              :disabled="isPasswordLocked"
              :suffix="suffixLockPassword"
              placeholder="******"
              type="password"
              @suffixClick="isPasswordLocked = !isPasswordLocked"
            />
          </FormItem>
        </div>
        <div class="row">
          <template v-if="!isPasswordLocked">
            <FormItem
              :label="$tr('profile.password.newPasswordLabel')"
              class="col-12 col-md-6 col-lg-4"
              prop="newPassword"
            >
              <Input v-model="userModel.newPassword" type="password" />
            </FormItem>
            <FormItem
              :label="$tr('profile.password.repeatNewPasswordLabel')"
              class="col-12 col-md-6 col-lg-4"
              prop="newPasswordRepeat"
            >
              <Input v-model="userModel.newPasswordRepeat" type="password" />
            </FormItem>
            <FormItem class="col-12 col-md-6 col-lg-4" label="">
              <Button :disabled="isLoading" type="primary" long @click="updatePassword">
                {{ $tr('profile.password.savePassword') }}
              </Button>
            </FormItem>
          </template>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import useUser from '@/domain/composables/use-user'

export default {
  data() {
    const repeatEqual = (rule, value, cb) => {
      if (value !== this.userModel.newPassword) {
        cb(new Error(this.$tr('resetPassword.passwordConfirm.ruleDiff')))
      } else {
        cb()
      }
    }

    return {
      userModel: {
        email: this.$store.getters['auth/email'],
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
      },
      isLoading: false,
      validateUserRules: {
        email: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { type: 'email' },
        ],
        oldPassword: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { min: 6, message: this.$tr('auth.password.errorLength') },
        ],
        newPassword: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { min: 6, message: this.$tr('auth.password.errorLength') },
        ],
        newPasswordRepeat: [
          { required: true, message: this.$tr('initValidation.required'), trigger: 'blur' },
          { min: 6, message: this.$tr('auth.password.errorLength') },
          { validator: repeatEqual },
        ],
      },
      isPasswordLocked: true,
      isEmailLocked: true,
    }
  },
  computed: {
    ...mapState({ user: (state) => state.auth.userData }),
    suffixLockPassword() {
      return this.isPasswordLocked ? 'lock' : 'unlock'
    },
    suffixLockEmail() {
      return this.isEmailLocked ? 'lock' : 'unlock'
    },
  },
  methods: {
    updateEmail() {
      this.$refs.userForm.validateField('email', async (errors, isValid) => {
        if (isValid) {
          const { email } = this.userModel

          const { id: userId } = this.user
          const { updateEmail } = useUser()

          this.isLoading = true

          try {
            const user = await updateEmail(userId, email)
            this.$store.commit('auth/SET_USER_DATA', user)
            this.$Message.success(this.$tr('profile.emailChange'))
          } catch (e) {
            this.userModel.email = this.user.email
            if (e.status === 422) {
              this.$Message.warning(this.$tr('auth.emailAlreadyExisted'))
            } else {
              console.error(e)
            }
          } finally {
            this.resetUserForm()
            this.isLoading = false
          }
        }
      })
    },
    async updatePassword() {
      const isUserModelValid = await this.$refs.userForm.validate()

      if (isUserModelValid) {
        const { newPassword: password, oldPassword } = this.userModel
        const { id: userId } = this.user
        const { updatePassword } = useUser()

        this.isLoading = true
        try {
          await updatePassword({ userId, password, oldPassword })
          this.$Message.success(this.$tr('profile.password.change'))
        } catch {
          this.$Message.error(this.$tr('auth.authError'))
        } finally {
          this.isLoading = false
          this.resetUserForm()
        }
      }
    },
    resetUserForm() {
      this.isPasswordLocked = true
      this.isEmailLocked = true
    },
  },
}
</script>

<style scoped></style>
