<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование пользователя</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/users/list')"> Назад </Button>
      </i-col>
    </Row>
    <UserDetail :edit="true" @on-save="handleSave" @on-delete="handleDelete" />
  </div>
</template>

<script>
import UserDetail from './components/UserDetail'
import { updateUser, deleteUser } from '@/api/user'
export default {
  name: 'EditUser',
  components: { UserDetail },
  methods: {
    handleSave(form, redirect) {
      updateUser(this.$route.params.id, form).then((res) => {
        this.$Message.success('Пользователь успешно сохранен')
        if (redirect) {
          this.$router.push({ path: '/users/list' })
        }
      })
    },
    handleDelete(form) {
      deleteUser(this.$route.params.id)
        .then((res) => {
          this.$Message.success('Пользователь успешно удален')
          setTimeout(() => {
            this.$router.push({ path: '/users/list' })
          }, 1000)
        })
        .catch((e) => {
          throw new Error(e)
        })
    },
  },
}
</script>
