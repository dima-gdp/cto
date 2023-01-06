<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание пользователя</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/users/list')"> Назад </Button>
      </i-col>
    </Row>
    <UserDetail @on-save="handleSave" />
  </div>
</template>

<script>
import UserDetail from './components/UserDetail'
import { createUser } from '@/api/user'
export default {
  name: 'CreateUser',
  components: { UserDetail },
  methods: {
    handleSave(form, redirect) {
      createUser(form).then((res) => {
        this.$Message.success('Пользователь успешно создан')
        if (redirect) {
          this.$router.push({ path: '/users/list' })
        } else {
          this.$router.push({ path: `/users/edit/${res.data.id}` })
        }
      })
    },
  },
}
</script>
