<template>
  <div class="split-pane-page-wrapper">
    <SplitPane v-model="offset" @on-moving="handleMoving">
      <div slot="left" class="pane left-pane">
        <SplitPane v-model="offsetVertical" mode="vertical" @on-moving="handleMoving">
          <div slot="top" class="pane top-pane"></div>
          <div slot="bottom" class="pane bottom-pane"></div>
          <div slot="trigger" class="custom-trigger">
            <Icons class="trigger-icon" :size="22" type="resize-vertical" color="#fff" />
          </div>
        </SplitPane>
      </div>
      <div slot="right" class="pane right-pane"></div>
    </SplitPane>
  </div>
</template>

<script>
import SplitPane from '_c/split-pane'
import Icons from '_c/icons'
export default {
  name: 'SplitPanePage',
  components: {
    SplitPane,
    Icons,
  },
  data() {
    return {
      offset: 0.6,
      offsetVertical: '250px',
    }
  },
  methods: {
    handleMoving(e) {
      console.info(e.atMin, e.atMax)
    },
  },
}
</script>

<style lang="less">
.center-middle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.split-pane-page-wrapper {
  height: 600px;
  .pane {
    width: 100%;
    height: 100%;
    &.left-pane {
      background: sandybrown;
    }
    &.right-pane {
      background: palevioletred;
    }
    &.top-pane {
      background: sandybrown;
    }
    &.bottom-pane {
      background: palevioletred;
    }
  }
  .custom-trigger {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000000;
    position: absolute;
    .center-middle;
    box-shadow: 0 0 6px 0 rgba(28, 36, 56, 0.4);
    i.trigger-icon {
      .center-middle;
    }
  }
}
</style>
