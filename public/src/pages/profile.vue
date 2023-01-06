<template>
  <div class="registration">
    <div class="s-card registration__registration-form">
      <Alert v-if="!userData.emailValidate" type="warning" class="text-center">
        <div>
          <div class="mb-1">
            {{ $tr('profile.alerts.emailNotConfirmed') }}
          </div>
          <a class="ivu-alert-warning ivu-alert-message" @click.prevent="validateEmail">
            {{ $tr('profile.alerts.resend') }}
          </a>
        </div>
      </Alert>
      <h3 class="registration-form-group__title">
        {{ $tr('profile.heading') }}
      </h3>
      <AppUserTicket
        v-if="userTicket"
        class="registration-form-group__user-ticket"
        :user-ticket="userTicket"
      >
      </AppUserTicket>
      <AppProfileUserForm />
      <AppForm
        :form-id="event.formLink.formId"
        :get-values-function="getFieldValues"
        @submit="updateProfile"
      >
        <template #submit="{ submit: formSubmit }">
          <Portal to="profile-submit">
            <Button
              type="primary"
              size="large"
              :disabled="isLoading"
              class="registration-footer__submit"
              @click="formSubmit"
            >
              {{ $tr('profile.submit') }}
            </Button>
          </Portal>
        </template>
      </AppForm>
    </div>
    <div class="registration__registration-footer">
      <div class="row registration-footer">
        <div class="col-sm-12 col-lg-4 registration-footer__submit-wrapper">
          <PortalTarget name="profile-submit"></PortalTarget>
        </div>
        <div class="col-sm-12 col-lg-8">
          <AppContentItems class="registration-footer__content-items" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppProfileUserForm from '@/components/common/app-profile-user-form'
import AppUserTicket from '@/components/common/app-user-ticket'

import AppForm from '@/components/common/app-form'
import AppContentItems from '@/components/common/app-content-items'
import useRegistration from '@/domain/composables/use-registration'
import useUser from '@/domain/composables/use-user'
import useForm from '@/domain/composables/use-form'

export default {
  components: {
    AppProfileUserForm,
    AppForm,
    AppContentItems,
    AppUserTicket,
  },
  data() {
    return {
      isLoading: false,
      userModel: {
        email: this.$store.state.auth.userData.email,
        password: '',
        newPassword: '',
        newPasswordRepeat: '',
      },
      contentItems: null,
      userTicket: null,
    }
  },
  computed: {
    ...mapState({
      event: (state) => state.event.data,
      userData: (state) => state.auth.userData,
    }),
  },
  mounted() {
    this.getUserTicket()
    if (!this.event.formLink.formId) {
      this.$toLocalePath('/404')
    }
  },

  methods: {
    async getUserTicket() {
      const userId = this.$store.state.auth.userId
      const eventId = this.$route.params.eventId
      const { getUserTicket } = useRegistration()
      try {
        const userTicket = await getUserTicket(userId, eventId)
        if (userTicket && userTicket.length > 0) this.userTicket = userTicket
      } catch (e) {
        console.error(e)
      }
    },
    async getFieldValues() {
      const userId = this.$store.state.auth.userId
      const eventId = this.$route.params.eventId
      const { getFieldValues } = useRegistration()

      const regValues = await getFieldValues(userId, eventId)
      return regValues
    },
    async updateProfile({ form, entityId }) {
      try {
        this.isLoading = true
        const { updateRegistrationData } = useForm()
        await updateRegistrationData({ registrationId: entityId, form })

        // todo: это использование vuex как кеша, так быть не должно (антипаттерн)
        const { getUser } = useUser()
        const user = await getUser(this.$store.state.auth.userId)
        this.$store.commit('auth/SET_USER_DATA', user)

        this.$Message.success(this.$tr('profile.succesAlert'))
        window.scrollTo(0, 0) //todo: smooth-scrolling
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async validateEmail() {
      const { id: userId } = this.userData
      const eventId = this.$store.getters['event/currentEventId']

      const { validateEmail } = useUser()

      await validateEmail(userId, eventId)
      this.$Message.success(this.$tr('profile.emailConfirm'))
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/blocks/registration.scss';
</style>
