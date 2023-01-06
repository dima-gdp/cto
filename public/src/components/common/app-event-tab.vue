<template>
  <div class="s-card s-card--no-padding">
    <div class="event-time-line other-events__event-time-line">
      <div
        v-for="item in list"
        :key="item.id"
        :class="{ 'event-time-line__item--active': +value === +item.id }"
        class="event-time-line__item"
        @click="selectTab(item.id)"
      >
        <span class="s-subtitle">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String, null],
      default: null,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedTab: null,
    }
  },
  methods: {
    selectTab(id) {
      this.$emit('input', id)
      this.$emit('tab-select', this.list.find((item) => +item.id === +id).name)
    },
  },
}
</script>

<style lang="scss">
.event-time-line {
  display: flex;

  &__item {
    position: relative;
    margin: 0px 4px;
    padding: 13px 20px;
    color: var(--s-black-color-80);
    cursor: pointer;
    font-size: 14px;

    &::after {
      content: '';
      position: absolute;
      right: -4.5px;
      height: 24px;
      width: 1px;
      background-color: var(--s-black-color-10);
    }

    &:last-child {
      &::after {
        content: none;
      }
    }

    &--active {
      color: var(--s-primary-color);

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        border-radius: 2px;
        background-color: var(--s-primary-color);
      }
    }
  }
}
</style>
