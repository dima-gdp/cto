<template>
  <div :class="itemClasses">
    <div :class="headerClasses" @click="toggle">
      <Icon v-if="!hideArrow" type="ios-arrow-forward"></Icon>
      <slot></slot>
    </div>
    <CollapseTransition v-if="mounted">
      <div v-show="isActive" :class="contentClasses">
        <div :class="boxClasses"><slot name="content"></slot></div>
      </div>
    </CollapseTransition>
  </div>
</template>
<script>
import Icon from '../icon/icon.vue'
import CollapseTransition from '../base/collapse-transition'
const prefixCls = 'ivu-collapse'

export default {
  name: 'Panel',
  components: { Icon, CollapseTransition },
  props: {
    name: {
      type: String,
    },
    hideArrow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      index: 0, // use index for default when name is null
      isActive: false,
      mounted: false,
    }
  },
  computed: {
    itemClasses() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.isActive,
        },
      ]
    },
    headerClasses() {
      return `${prefixCls}-header`
    },
    contentClasses() {
      return `${prefixCls}-content`
    },
    boxClasses() {
      return `${prefixCls}-content-box`
    },
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    toggle() {
      this.$parent.toggle({
        name: this.name || this.index,
        isActive: this.isActive,
      })
    },
  },
}
</script>
