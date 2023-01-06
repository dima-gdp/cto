<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создать импорт</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.go(-1)"> Назад </Button>
      </i-col>
    </Row>
    <import-detail @on-save="handleSave" />
  </div>
</template>

<script>
import importDetail from './components/importDetail'
import { createImport } from '@/api/imports'
export default {
  name: 'CreateImport',
  components: { importDetail },
  methods: {
    handleSave(form) {
      createImport(form)
        .then((res) => {
          this.$Message.success('Импорт успешно создан')
          this.$router.push({ path: '/imports/list' })
        })
        .catch((e) => {
          console.error(e)
        })
    },
  },
}
</script>
