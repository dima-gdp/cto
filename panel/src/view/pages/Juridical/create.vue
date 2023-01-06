<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание юр. лица</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/juridical/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <JuridicalDetail @on-save="handleSave" />
  </div>
</template>

<script>
import JuridicalDetail from './components/JuridicalDetail'
import { createLegalEntities } from '@/api/legalEntities'
export default {
  name: 'CreateJuridical',
  components: { JuridicalDetail },
  methods: {
    async handleSave(form, redirect) {
      try {
        const res = await createLegalEntities(form)
        this.$Message.success('Юр. лицо успешно создано')

        if (redirect) {
          this.$router.push({ path: '/juridical/list' })
        } else {
          this.$router.push({ path: `/juridical/edit/${res.data.id}` })
        }
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}
</script>
