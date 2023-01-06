<template>
  <div class="ellipsis-wrapper">
    <div class="ellipsis-block">
      <div ref="truncate">
        {{ text }}
      </div>
      <div v-if="ellipsis" class="ellipsis-block__btn-block">
        <div
          :class="show ? 'ellipsis-block__btn--active' : ''"
          class="ellipsis-block__btn"
          @click="openMore"
        >
          ...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lines: {
      type: Number,
      default: 3,
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ellipsis: false,
      show: false,
    }
  },
  mounted() {
    this.ellipses()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      if (this.$refs.truncate) {
        this.$refs.truncate.textContent = this.text
      }
      this.ellipses()
    },
    ellipses() {
      const truncateElement = this.$refs.truncate
      const truncateText = truncateElement.textContent

      const getLineHeight = function (element) {
        const lineHeight = window.getComputedStyle(truncateElement)['line-height']
        if (lineHeight === 'normal') {
          // fuck chrome
          return 1.16 * parseFloat(window.getComputedStyle(truncateElement)['font-size'])
        } else {
          return parseFloat(lineHeight)
        }
      }
      const truncateTextParts = truncateText.split(' ')
      const lineHeight = getLineHeight(truncateElement)
      if (!this.show) {
        while (this.lines * lineHeight < truncateElement.clientHeight) {
          // console.log(truncateTextParts.length, this.lines * lineHeight, truncateElement.clientHeight);
          truncateTextParts.pop()
          // truncateElement.innerHTML = truncateTextParts.join(' ') + '...';
          truncateElement.innerHTML = truncateTextParts.join(' ')
          this.ellipsis = true
        }
      } else {
        this.$refs.truncate.textContent = this.text
      }
    },
    openMore() {
      this.show = !this.show
      this.ellipses()
    },
  },
}
</script>
<style>
.ellipsis-block {
  position: relative;
}
.ellipsis-block__btn {
  background-color: #f9f9fa;
  border-radius: 3px;
  display: flex;
  padding: 6px 8px;
  line-height: 0px;
  height: 16px;
  cursor: pointer;
}
.ellipsis-block__btn-block {
  position: absolute;
  display: flex;
  line-height: 0px;
  height: 20px;
  width: 50px;
  right: 0px;
  bottom: 0px;
  background-color: var(--s-white-color);
  justify-content: center;
}
.ellipsis-block__btn--active {
  background-color: #dbdde0;
}
.ellipsis-wrapper {
  height: 100%;
  width: 100%;
}
</style>
