<template>
  <div class="save-panel">
    <Button class="save-panel__btn save-panel__save-btn" @click="save">
      <Icon type="md-checkmark-circle" />
      Сохранить
    </Button>
    <Button class="save-panel__btn save-panel__apply-btn" @click="apply"> Применить </Button>
  </div>
</template>
<script>
let containerApp

export default {
  mounted() {
    containerApp = document.getElementById('app')
    containerApp.classList.add('app-pb')
  },

  beforeDestroy() {
    containerApp.classList.remove('app-pb')
  },

  methods: {
    save() {
      this.$emit('save')
    },
    apply() {
      this.$emit('apply')
    },
  },
}
</script>
<style lang="less">
.save-panel {
  position: fixed;
  width: 100%;
  height: 60px;
  background: #152536;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &__btn + &__btn {
    margin-left: 20px;
  }

  &__save-btn {
    background: #0d6efd;
    display: flex;
    align-items: center;
    border-color: #0d6efd;
    color: #fff;

    &:hover {
      color: #0d6efd;
      border-color: #0d6efd;
    }
  }

  &__apply-btn {
    background: #152536;
    color: #fff;
    border-color: #0d6efd;

    &:hover {
      border-color: #0d6efd;
      background: #fff;
      color: #0d6efd;
    }
  }
}
</style>
