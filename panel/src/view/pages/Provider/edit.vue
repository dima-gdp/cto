<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактировать провайдера оплаты</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.go(-1)"> Назад </Button>
      </i-col>
    </Row>
    <ProviderDetail edit="true" @on-save="handleSave" @on-delete="handleDelete" />
  </div>
</template>

<script>
import ProviderDetail from './components/ProviderDetail'
import { updatePayment, deletePayment } from '@/api/payments'
export default {
  name: 'CreateProvider',
  components: { ProviderDetail },
  methods: {
    handleSave(form, redirect) {
      const juridicalID = form.legalEntityId
      updatePayment(this.$route.params.id, form).then((res) => {
        this.$Message.success('Провайдер успешно обновлен')
        if (redirect) {
          this.$router.push({ path: `/juridical/edit/${juridicalID}` })
        }
      })
    },
    handleDelete(form) {
      deletePayment(this.$route.params.id)
        .then((res) => {
          const juridicalID = form.legalEntityId
          this.$Message.success('Провайдер успешно удален')
          setTimeout(() => {
            this.$router.push({ path: `/juridical/edit/${juridicalID}` })
          }, 1000)
        })
        .catch((e) => {
          console.error(e)
        })
    },
  },
}
</script>
