<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styles">
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column)" />
      <col v-if="$parent.showVerticalScrollBar" :width="$parent.scrollBarWidth" />
    </colgroup>
    <thead>
      <tr v-for="(cols, rowIndex) in headRows">
        <th
          v-for="(column, index) in cols"
          :colspan="column.colSpan"
          :rowspan="column.rowSpan"
          :class="alignCls(column)"
        >
          <div :class="cellClasses(column)">
            <template v-if="column.type === 'expand'">
              <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
              <render-header
                v-else
                :render="column.renderHeader"
                :column="column"
                :index="index"
              ></render-header>
            </template>
            <template v-else-if="column.type === 'selection'"
              ><Checkbox
                :value="isSelectAll"
                :disabled="isSelectDisabled"
                @on-change="selectAll"
              ></Checkbox
            ></template>
            <template v-else>
              <span
                v-if="!column.renderHeader"
                :class="{ [prefixCls + '-cell-sort']: column.sortable }"
                @click="handleSortByHead(getColumn(rowIndex, index)._index)"
                >{{ column.title || '#' }}</span
              >
              <render-header
                v-else
                :render="column.renderHeader"
                :column="column"
                :index="index"
              ></render-header>
              <span v-if="column.sortable" :class="[prefixCls + '-sort']">
                <i
                  class="ivu-icon ivu-icon-md-arrow-dropup"
                  :class="{ on: getColumn(rowIndex, index)._sortType === 'asc' }"
                  @click="handleSort(getColumn(rowIndex, index)._index, 'asc')"
                ></i>
                <i
                  class="ivu-icon ivu-icon-md-arrow-dropdown"
                  :class="{ on: getColumn(rowIndex, index)._sortType === 'desc' }"
                  @click="handleSort(getColumn(rowIndex, index)._index, 'desc')"
                ></i>
              </span>
              <Poptip
                v-if="isPopperShow(column)"
                v-model="getColumn(rowIndex, index)._filterVisible"
                placement="bottom"
                popper-class="ivu-table-popper"
                transfer
                :capture="false"
                @on-popper-hide="handleFilterHide(getColumn(rowIndex, index)._index)"
              >
                <span :class="[prefixCls + '-filter']">
                  <i
                    class="ivu-icon ivu-icon-ios-funnel"
                    :class="{ on: getColumn(rowIndex, index)._isFiltered }"
                  ></i>
                </span>

                <div
                  v-if="getColumn(rowIndex, index)._filterMultiple"
                  slot="content"
                  :class="[prefixCls + '-filter-list']"
                >
                  <div :class="[prefixCls + '-filter-list-item']">
                    <CheckboxGroup v-model="getColumn(rowIndex, index)._filterChecked">
                      <Checkbox
                        v-for="(item, index) in column.filters"
                        :key="index"
                        :label="item.value"
                        >{{ item.label }}</Checkbox
                      >
                    </CheckboxGroup>
                  </div>
                  <div :class="[prefixCls + '-filter-footer']">
                    <i-button
                      type="text"
                      size="small"
                      :disabled="!getColumn(rowIndex, index)._filterChecked.length"
                      @click.native="handleFilter(getColumn(rowIndex, index)._index)"
                      >{{ t('i.table.confirmFilter') }}</i-button
                    >
                    <i-button
                      type="text"
                      size="small"
                      @click.native="handleReset(getColumn(rowIndex, index)._index)"
                      >{{ t('i.table.resetFilter') }}</i-button
                    >
                  </div>
                </div>
                <div v-else slot="content" :class="[prefixCls + '-filter-list']">
                  <ul :class="[prefixCls + '-filter-list-single']">
                    <li
                      :class="itemAllClasses(getColumn(rowIndex, index))"
                      @click="handleReset(getColumn(rowIndex, index)._index)"
                    >
                      {{ t('i.table.clearFilter') }}
                    </li>
                    <li
                      v-for="item in column.filters"
                      :class="itemClasses(getColumn(rowIndex, index), item)"
                      @click="handleSelect(getColumn(rowIndex, index)._index, item.value)"
                    >
                      {{ item.label }}
                    </li>
                  </ul>
                </div>
              </Poptip>
            </template>
          </div>
          <div
            v-if="column.resizable"
            class="ivu-table-header-resizable"
            @mousedown="handleMouseDown(column, $event)"
            @mousemove="handleMouseMove(column, $event)"
            @mouseout="handleMouseOut"
          ></div>
        </th>

        <th
          v-if="$parent.showVerticalScrollBar && rowIndex === 0"
          :class="scrollBarCellClass()"
          :rowspan="headRows.length"
        ></th>
      </tr>
    </thead>
  </table>
</template>
<script>
import CheckboxGroup from '../checkbox/checkbox-group.vue'
import Checkbox from '../checkbox/checkbox.vue'
import Poptip from '../poptip/poptip.vue'
import iButton from '../button/button.vue'
import renderHeader from './header'
import Mixin from './mixin'
import Locale from '../../mixins/locale'

export default {
  name: 'TableHead',
  components: { CheckboxGroup, Checkbox, Poptip, iButton, renderHeader },
  mixins: [Mixin, Locale],
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    objData: Object,
    data: Array, // rebuildData
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false,
    },
    columnRows: Array,
    fixedColumnRows: Array,
  },
  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {},
    }
  },
  computed: {
    styles() {
      const style = Object.assign({}, this.styleObject)
      const width = parseInt(this.styleObject.width)
      style.width = `${width}px`
      return style
    },
    isSelectAll() {
      let isSelectAll = true
      if (!this.data.length) isSelectAll = false
      if (!this.data.find((item) => !item._disabled)) isSelectAll = false // #1751
      for (let i = 0; i < this.data.length; i++) {
        if (
          !this.objData[this.data[i]._index]._isChecked &&
          !this.objData[this.data[i]._index]._isDisabled
        ) {
          isSelectAll = false
          break
        }
      }

      return isSelectAll
    },
    headRows() {
      const isGroup = this.columnRows.length > 1
      if (isGroup) {
        return this.fixed ? this.fixedColumnRows : this.columnRows
      } else {
        return [this.columns]
      }
    },
    isSelectDisabled() {
      let isSelectDisabled = false
      if (!this.data.length) isSelectDisabled = true
      if (!this.data.find((item) => !item._disabled)) isSelectDisabled = true
      return isSelectDisabled
    },
  },
  methods: {
    cellClasses(column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]:
            !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
          [`${this.prefixCls}-cell-with-selection`]: column.type === 'selection',
        },
      ]
    },
    scrollBarCellClass() {
      let hasRightFixed = false
      for (let i in this.headRows) {
        for (let j in this.headRows[i]) {
          if (this.headRows[i][j].fixed === 'right') {
            hasRightFixed = true
            break
          }
          if (hasRightFixed) break
        }
      }
      return [
        {
          [`${this.prefixCls}-hidden`]: hasRightFixed,
        },
      ]
    },
    itemClasses(column, item) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]:
            column._filterChecked[0] === item.value,
        },
      ]
    },
    itemAllClasses(column) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length,
        },
      ]
    },
    selectAll() {
      const status = !this.isSelectAll
      this.$parent.selectAll(status)
    },
    handleSort(index, type) {
      // 在固定列时，寻找正确的 index #5580
      const column = this.columns.find((item) => item._index === index)
      const _index = column._index

      if (column._sortType === type) {
        type = 'normal'
      }
      this.$parent.handleSort(_index, type)
    },
    handleSortByHead(index) {
      // 在固定列时，寻找正确的 index #5580
      const column = this.columns.find((item) => item._index === index)
      if (column.sortable) {
        const type = column._sortType
        if (type === 'normal') {
          this.handleSort(index, 'asc')
        } else if (type === 'asc') {
          this.handleSort(index, 'desc')
        } else {
          this.handleSort(index, 'normal')
        }
      }
    },
    handleFilter(index) {
      this.$parent.handleFilter(index)
    },
    handleSelect(index, value) {
      this.$parent.handleFilterSelect(index, value)
    },
    handleReset(index) {
      this.$parent.handleFilterReset(index)
    },
    handleFilterHide(index) {
      this.$parent.handleFilterHide(index)
    },
    // 因为表头嵌套不是深拷贝，所以没有 _ 开头的方法，在 isGroup 下用此列
    getColumn(rowIndex, index) {
      const isGroup = this.columnRows.length > 1

      if (isGroup) {
        const id = this.headRows[rowIndex][index].__id
        return this.columns.filter((item) => item.__id === id)[0]
      } else {
        return this.headRows[rowIndex][index]
      }
    },
    handleMouseDown(column, event) {
      if (this.$isServer) return

      if (this.draggingColumn) {
        this.dragging = true

        const table = this.$parent
        const tableEl = table.$el
        const tableLeft = tableEl.getBoundingClientRect().left
        const columnEl = this.$el.querySelector(`th.ivu-table-column-${column.__id}`)
        const columnRect = columnEl.getBoundingClientRect()
        const minLeft = columnRect.left - tableLeft + 30

        table.showResizeLine = true

        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft,
        }

        const resizeProxy = table.$refs.resizeLine
        resizeProxy.style.left = this.dragState.startLeft + 'px'

        document.onselectstart = function () {
          return false
        }
        document.ondragstart = function () {
          return false
        }

        const handleMouseMove = (event) => {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft
          const proxyLeft = this.dragState.startLeft + deltaLeft

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px'
        }

        const handleMouseUp = () => {
          if (this.dragging) {
            const { startColumnLeft, startLeft } = this.dragState

            const finalLeft = parseInt(resizeProxy.style.left, 10)
            const columnWidth = finalLeft - startColumnLeft

            const _column = table.columns.find((item) => item.__id === column.__id)
            if (_column) _column.width = columnWidth
            table.$emit(
              'on-column-width-resize',
              _column.width,
              startLeft - startColumnLeft,
              column,
              event,
            )

            document.body.style.cursor = ''
            this.dragging = false
            this.draggingColumn = null
            this.dragState = {}

            table.showResizeLine = false
          }

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          document.onselectstart = null
          document.ondragstart = null
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    },
    handleMouseMove(column, event) {
      let target = event.target

      while (target && target.tagName !== 'TH') {
        target = target.parentNode
      }

      if (!column || !column.resizable) return

      if (!this.dragging) {
        let rect = target.getBoundingClientRect()

        const bodyStyle = document.body.style

        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize'
          this.draggingColumn = column
        } else if (!this.dragging) {
          bodyStyle.cursor = ''
          this.draggingColumn = null
        }
      }
    },
    handleMouseOut() {
      if (this.$isServer) return
      document.body.style.cursor = ''
    },
  },
}
</script>
