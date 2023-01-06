<template>
  <div class="info-block">
    <slot name="alert"></slot>
    <div v-if="description" class="info-block__content">
      <div ref="limit" :class="visibleStyle" class="info-block__limit">
        <slot name="text"></slot>
      </div>
      <div class="info-block__btn">
        <div v-if="height > limit" class="info-block__btn-text" @click="showMore">
          <div
            v-text="show ? $tr('buttons.collapseDescription') : $tr('buttons.expandDescription')"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    limit: {
      type: Number,
      default: 3,
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      height: null,
      show: false,
      ready: false,
    }
  },
  computed: {
    heightBlock() {
      return this.$refs.limit.clientHeight
    },
    visibleStyle() {
      return this.height > this.limit && !this.show
        ? 'info-block__limit--hidden'
        : 'info-block__limit--open'
    },
  },
  mounted() {
    this.height = this.description ? this.$refs.limit.clientHeight : 0
    this.ready = true
  },
  methods: {
    showMore() {
      this.show = !this.show
    },
  },
}
</script>
<style lang="scss">
.info-block {
  background-color: var(--s-white-color);
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0px 0px 32px 0px;
  &__content {
    padding: 0px 24px 0px 24px;
  }
  &__limit {
    &--open {
      height: initial;
      overflow: initial;
    }
    &--hidden {
      height: 83px;
      overflow: hidden;

      @include media-breakpoint-down(sm) {
        height: 75px;
      }
    }
    &__loading {
      height: 90px;
      background: var(--s-primary-color-90);
    }
  }
  &__btn {
    margin-top: 16px;
    color: var(--s-black-color-60);
    font-size: 14px;
    cursor: pointer;
  }
  &__btn-text {
    display: inline-flex;
    border-bottom: 1px dashed var(--s-black-color-60);
    padding-bottom: 5px;
    &:hover {
      border-bottom: 1px dashed transparent;
    }
  }
  p {
    color: var(--s-black-color-80);
    line-height: 26px;
  }
  p + p {
    margin-top: 16px;
  }
}
</style>
