<template lang="html">
  <div :class="wrapperClasses">
    <div :class="spinnerClasses">
      <Spin fix>
        <Icon type="ios-loading" size="18" :class="iconClasses"></Icon>
        <div v-if="text" :class="textClasses">{{ text }}</div>
      </Spin>
    </div>
  </div>
</template>

<script>
import Spin from '../spin/spin.vue'
import Icon from '../icon/icon.vue'

const prefixCls = 'ivu-scroll'

export default {
  components: { Spin, Icon },
  props: ['text', 'active', 'spinnerHeight'],
  computed: {
    wrapperClasses() {
      return [
        `${prefixCls}-loader-wrapper`,
        {
          [`${prefixCls}-loader-wrapper-active`]: this.active,
        },
      ]
    },
    spinnerClasses() {
      return `${prefixCls}-spinner`
    },
    iconClasses() {
      return `${prefixCls}-spinner-icon`
    },
    textClasses() {
      return `${prefixCls}-loader-text`
    },
  },
}
</script>
