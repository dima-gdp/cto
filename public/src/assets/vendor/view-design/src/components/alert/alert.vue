<template>
  <transition name="fade">
    <div v-if="!closed" :class="wrapClasses">
      <span v-if="showIcon" :class="iconClasses">
        <slot name="icon">
          <Icon :type="iconType"></Icon>
        </slot>
      </span>
      <span :class="messageClasses"><slot></slot></span>
      <span :class="descClasses"><slot name="desc"></slot></span>
      <a v-if="closable" :class="closeClasses" @click="close">
        <slot name="close">
          <feather type="x" stroke="var(--s-black-color-80)" />
        </slot>
      </a>
    </div>
  </transition>
</template>
<script>
import Icon from '../icon'
import { oneOf } from '../../utils/assist'

const prefixCls = 'ivu-alert'

export default {
  name: 'Alert',
  components: { Icon },
  props: {
    type: {
      validator(value) {
        return oneOf(value, ['success', 'info', 'warning', 'error'])
      },
      default: 'info',
    },
    closable: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    banner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      closed: false,
      desc: false,
    }
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-icon`]: this.showIcon,
          [`${prefixCls}-with-desc`]: this.desc,
          [`${prefixCls}-with-banner`]: this.banner,
        },
      ]
    },
    messageClasses() {
      return `${prefixCls}-message`
    },
    descClasses() {
      return `${prefixCls}-desc`
    },
    closeClasses() {
      return `${prefixCls}-close`
    },
    iconClasses() {
      return `${prefixCls}-icon`
    },
    iconType() {
      let type = ''

      switch (this.type) {
        case 'success':
          type = 'ios-checkmark-circle'
          break
        case 'info':
          type = 'ios-information-circle'
          break
        case 'warning':
          type = 'ios-alert'
          break
        case 'error':
          type = 'ios-close-circle'
          break
      }

      if (this.desc) type += '-outline'
      return type
    },
  },
  mounted() {
    this.desc = this.$slots.desc !== undefined
  },
  methods: {
    close(e) {
      this.closed = true
      this.$emit('on-close', e)
    },
  },
}
</script>
