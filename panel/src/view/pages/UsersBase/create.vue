<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание базы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/users/users_base/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <MainForm :load="loading" @on-submit="handleSubmit" />
  </div>
</template>

<script>
import MainForm from './components/MainForm'
import { createAuthGroup } from '@/api/authGroups'

export default {
  components: { MainForm },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async handleSubmit([form, action]) {
      try {
        this.loading = true
        const {
          data: { id },
        } = await createAuthGroup(form)

        if (action === 'accept') {
          this.$router.push({ path: '/users/users_base/edit/' + id })
        }

        if (action === 'save') {
          this.$router.push({ path: '/users/users_base/list' })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        throw new Error(error)
      }
    },
  },
}
</script>
