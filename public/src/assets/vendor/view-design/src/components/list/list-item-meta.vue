<template>
  <div class="ivu-list-item-meta">
    <div v-if="avatar || $slots.avatar" class="ivu-list-item-meta-avatar">
      <slot name="avatar">
        <Avatar :src="avatar" />
      </slot>
    </div>
    <div class="ivu-list-item-meta-content">
      <div v-if="title || $slots.title" class="ivu-list-item-meta-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" class="ivu-list-item-meta-description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '../avatar/avatar.vue'

export default {
  name: 'ListItemMeta',
  components: { Avatar },
  props: {
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
}
</script>
