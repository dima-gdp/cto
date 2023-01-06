<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование базы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/users/users_base/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <MainForm :load="loading" :form-data="formData" @on-submit="handleSubmit" />
  </div>
</template>

<script>
import MainForm from './components/MainForm'
import { updateAuthGroup, getAuthGroup } from '@/api/authGroups'

export default {
  components: { MainForm },
  data() {
    return {
      loading: false,
      formData: {},
    }
  },
  computed: {
    authGroupId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getAuthGroup()
  },
  methods: {
    async handleSubmit([form, action]) {
      try {
        this.loading = true
        await updateAuthGroup(this.authGroupId, form)

        if (action === 'save') {
          await this.$router.push({ path: '/users/users_base/list' })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        throw new Error(error)
      }
    },
    async getAuthGroup() {
      try {
        this.loading = true
        const { data } = await getAuthGroup(this.authGroupId)
        this.formData = data
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$Message.error('В процессе загрузки произошла ошибка')
        await this.$router.push({ path: '/users/users_base/list' })
      }
    },
  },
}
</script>
