<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование Юр. лица</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/juridical/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <JuridicalDetail :edit="true" @on-save="handleSave" @on-delete="handleDelete" />
  </div>
</template>

<script>
import JuridicalDetail from './components/JuridicalDetail'
import { updateLegalEntities, deleteLegalEntities } from '@/api/legalEntities'
export default {
  name: 'EditJuridical',
  components: { JuridicalDetail },
  methods: {
    handleSave(form, redirect) {
      updateLegalEntities(this.$route.params.id, form)
        .then(() => {
          this.$Message.success('Юр. лицо успешно сохранено')
          if (redirect) {
            this.$router.push({ path: '/juridical/list' })
          }
        })
        .catch((e) => {
          console.warn(e)
        })
    },
    handleDelete() {
      deleteLegalEntities(this.$route.params.id)
        .then(() => {
          this.$Message.success('Юр. лицо успешно удалено')
          setTimeout(() => {
            this.$router.push({ path: '/juridical/list' })
          }, 1000)
        })
        .catch((e) => {
          console.warn(e)
        })
    },
  },
}
</script>
