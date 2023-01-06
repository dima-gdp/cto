<template>
  <div class="user-ticket">
    <div class="user-ticket__title">{{ $tr('profile.userTicket.text') }}</div>
    <div class="user-ticket__number">{{ userTicket }}</div>
  </div>
</template>
<script>
export default {
  props: {
    userTicket: { type: String, default: '' },
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss">
.user-ticket {
  padding: 11px 20px 11px 24px;
  display: inline-flex;
  flex-direction: column;
  max-width: 252px;
  background: var(--s-success-color-light);
  color: var(--s-success-color-darker);
  border-radius: 5px;
  &__title {
    font-size: 14px;
    line-height: 22px;
  }
  &__number {
    font-weight: 500;
    font-size: 26px;
    line-height: 32px;
    word-break: break-all;
    letter-spacing: 0.2px;
  }
}
</style>
