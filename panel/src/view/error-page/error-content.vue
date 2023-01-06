<template>
  <div class="error-page">
    <div class="content-con">
      <div class="text-con">
        <h4>{{ code }}</h4>
        <h5>{{ desc }}</h5>
      </div>
      <back-btn-group class="back-btn-group"></back-btn-group>
    </div>
  </div>
</template>

<script>
import './error.less'
import backBtnGroup from './back-btn-group.vue'
export default {
  name: 'ErrorContent',
  components: {
    backBtnGroup,
  },
  // TODO: Поставить значения по-умолчанию у пропсов
  /* eslint-disable vue/require-default-prop */
  props: {
    code: String,
    desc: String,
    src: String,
  },
  /* eslint-enable vue/require-default-prop */
}
</script>
