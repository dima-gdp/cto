<template>
  <div>
    <Card>
      <div class="drag-box-card">
        <DragList
          :list1.sync="list1"
          :list2.sync="list2"
          :drop-con-class="dropConClass"
          @on-change="handleChange"
        >
          <h3 slot="left-title">В дело</h3>
          <Card slot="left" slot-scope="left" class="drag-item">
            {{ left.itemLeft.name }}
          </Card>
          <h3 slot="right-title">Сделано</h3>
          <Card slot="right" slot-scope="right" class="drag-item">
            {{ right.itemRight.name }}
          </Card>
        </DragList>
      </div>
      <div class="handle-log-box">
        <h3>Лог</h3>
        <div class="handle-inner-box">
          <p v-for="(item, index) in handleList" :key="`handle_item_${index}`">
            {{ item }}
          </p>
        </div>
      </div>
      <div class="res-show-box">
        <pre>{{ list1 }}</pre>
      </div>
      <div class="res-show-box">
        <pre>{{ list2 }}</pre>
      </div>
    </Card>
  </div>
</template>
<script>
import DragList from '_c/drag-list'
import { getDragList } from '@/api/data'
export default {
  name: 'DragListPage',
  components: {
    DragList,
  },
  data() {
    return {
      list1: [],
      list2: [],
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box'],
      },
      handleList: [],
    }
  },
  mounted() {
    getDragList().then((res) => {
      this.list1 = res.data
      this.list2 = [res.data[0]]
    })
  },
  methods: {
    handleChange({ src, target, oldIndex, newIndex }) {
      this.handleList.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`)
    },
  },
}
</script>
<style lang="less">
.drag-box-card {
  display: inline-block;
  width: 600px;
  height: 560px;
  .drag-item {
    margin: 10px;
  }
  h3 {
    padding: 10px 15px;
  }
  .drop-box {
    border: 1px solid #eeeeee;
    height: 455px;
    border-radius: 5px;
  }
  .left-drop-box {
    margin-right: 10px;
  }
  .right-drop-box {
    //
  }
}
.handle-log-box {
  display: inline-block;
  margin-left: 20px;
  border: 1px solid #eeeeee;
  vertical-align: top;
  width: 200px;
  height: 500px;
  h3 {
    padding: 10px 14px;
  }
  .handle-inner-box {
    height: ~'calc(100% - 44px)';
    overflow: auto;
    p {
      padding: 14px 0;
      margin: 0 14px;
      border-bottom: 1px dashed #eeeeee;
    }
  }
}
.res-show-box {
  display: inline-block;
  margin-left: 20px;
  border: 1px solid #eeeeee;
  vertical-align: top;
  width: 350px;
  height: 570px;
}
</style>
