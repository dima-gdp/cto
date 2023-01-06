<template>
  <button :class="{ 'menu-btn--active': isMenuOpen }" class="menu-btn" @click="openMenu">
    <span class="menu-btn__burger">
      <svg
        v-show="!isMenuOpen"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12H21"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3 6H21"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3 18H21"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-show="isMenuOpen"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5.63672 5.63605L18.3646 18.364"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.63672 18.364L18.3646 5.63603"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="menu-btn__title">{{ this.$tr('header.menu.button') }}</span>
  </button>
</template>

<script>
export default {
  props: {
    isMenuOpen: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    openMenu() {
      this.$emit('click-menu-btn')
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header-menu-button.scss';
</style>
