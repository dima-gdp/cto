<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создать провайдера оплаты</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.go(-1)"> Назад </Button>
      </i-col>
    </Row>
    <ProviderDetail @on-save="handleSave" />
  </div>
</template>

<script>
import ProviderDetail from './components/ProviderDetail'
import { createPayment } from '@/api/payments'
export default {
  name: 'CreateProvider',
  components: { ProviderDetail },
  computed: {
    juridicalId() {
      return this.$route.params.id
    },
  },
  methods: {
    handleSave(form, redirect, action) {
      createPayment(form)
        .then((res) => {
          this.$Message.success('Провайдер успешно создан')

          if (action === 'accept') {
            this.$router.push({ path: `/juridical/provider-edit/${res.data.id}` })
          }
          if (action === 'save') {
            this.$router.push({ path: `/juridical/edit/${this.juridicalId}` })
          }
        })
        .catch((e) => {
          throw new Error(e)
        })
    },
  },
}
</script>
