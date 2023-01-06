<template>
  <!-- компонент для кастомных фильтров карточек, ничего почти не умеет -->
  <div>
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <template v-if="filterConfig && isFilterShown">
        <ComplexTableFilter
          :filter-config="filterConfig"
          :visual-structure="visualStructure"
          @search="onComplexSearch"
        />
      </template>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <!-- :size="size" -->

      <!-- Action row -->
      <template slot="actions" slot-scope="{ column, row }">
        <Dropdown trigger="click">
          <a @click.prevent>
            <Icon type="ios-more" color="#515a6e" size="25" />
          </a>
          <DropdownMenu slot="list">
            <template v-for="(item, index) in column.options">
              <DropdownItem
                v-if="item && item.access.includes(role)"
                :key="index"
                style="padding: 0"
                :style="item.style"
              >
                <div style="padding: 10px" @click="$emit(item.action, row)">
                  {{ item.name }}
                </div>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
      </template>
      <!-- End action row -->

      <slot slot="header" name="header"></slot>
      <slot slot="footer" name="footer"></slot>
      <slot slot="loading" name="loading"></slot>
    </Table>
    <div v-if="paging" style="margin: 10px; overflow: hidden">
      <div class="table-pagination">
        <div v-if="paging.totalCount" class="table-pagination__info">
          {{ paginationInfo }}
        </div>
        <Page
          class="table-pagination__pagination"
          :total="paging.totalCount"
          :current="1"
          :page-size="paging.perPage"
          :show-total="false"
          @on-change="changePage"
        />
      </div>
    </div>
    <a id="hrefToExportTable" style="display: none; width: 0px; height: 0px"></a>
  </div>
</template>

<script>
import ComplexTableFilter from './components/ComplexTableFilter'
import { mapGetters } from 'vuex'
import clonedeep from 'lodash.clonedeep'
import './index.less'

export default {
  components: { ComplexTableFilter },
  props: {
    filterConfig: { type: Array, default: () => [], required: false },
    value: { type: Array, default: () => [] },
    paging: { type: Object, default: () => {} },
    columns: { type: Array, default: () => [] },
    params: { type: Object, default: () => ({}) },
    size: { type: String, default: '' },
    stripe: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: true },
    highlightRow: { type: Boolean, default: false },
    disabledHover: { type: Boolean },
    loading: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    searchPlace: { type: String, default: 'top' },
    preserveFilter: { type: Object, default: null },
    isFilterShown: { type: Boolean, default: true },
  },
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      defaultSort: '',
      editingCellId: '',
      editingText: '',
      searchValue: {},
      filter: {},
      visualStructure: [],
    }
  },
  computed: {
    ...mapGetters(['role']),
    paginationInfo() {
      const total = this.paging.totalCount
      return `Всего ${total} записей`
    },
  },

  watch: {
    columns(columns) {
      this.handleColumns(columns)
    },
    value(val) {
      this.handleTableData()
    },
  },
  mounted() {
    this.handleColumns(this.columns)
    this.handleTableData()
    this.applyFilterFromUrl()

    if (this.$route.params.visualStructure) {
      this.visualStructure = JSON.parse(this.$route.params.visualStructure)
      this.$emit('show-filters')
    }
  },

  methods: {
    formatFilterConfig(config) {
      return config.filter((c) => c.searchable).sort((a, b) => a.position - b.position)
    },

    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        return res
      })
    },

    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        const res = item
        res.initRowIndex = index
        res.id = +res.id
        return res
      })
    },

    applyFilter(params) {
      this.$emit('on-filter-change', params)
    },

    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column) {
      if (column.order === 'normal' && this.params.sort) {
        delete this.params.sort
      } else {
        const order = column.order === 'desc' ? '-' + column.key : column.key
        // eslint-disable-next-line vue/no-mutating-props
        this.params['sort'] = [order]
      }

      this.$emit('on-sort-change', this.params)
    },
    changePage(page) {
      // eslint-disable-next-line vue/no-mutating-props
      this.params['page'] = page
      this.$emit('on-page-change', this.params)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    },

    async onComplexSearch(filterInfo) {
      await this.saveToUrl(filterInfo)
      this.applyFilterFromUrl()
    },

    async saveToUrl(filterInfo) {
      const vS = this.transformStructureToString(filterInfo)
      await this.$router.push({ path: `/users-cards/list/${vS}` }).catch(() => {})
    },

    applyFilterFromUrl() {
      const { visualStructure } = this.$route.params

      const filter = visualStructure
        ? this.filterConstruct(this.getStructureFromString(visualStructure))
        : []

      console.info(clonedeep(filter))
      const params = { ...this.params, filter }
      this.applyFilter(params)
    },

    getNewFilterId() {
      const { filterId } = this.$route.params
      return +filterId + 1 || 0
    },

    filterConstruct(filterArray = []) {
      if (!filterArray.length) {
        return
      }

      if (filterArray.length === 1) {
        const [item] = filterArray
        if (Array.isArray(item.value) && item.innerCon) {
          return this.constructFilterFromArray(item.value, item.key, item.innerCon)
        }
        return { [`${item.key}`]: item.value }
      }

      for (const i in filterArray.slice(0, filterArray.length - 1)) {
        const item = filterArray[i]

        if (item.conAfter === 'or') {
          const leftExpression = filterArray.slice(0, +i + 1)
          const rightExpression = filterArray.slice(+i + 1)
          return {
            or: [this.filterConstruct(leftExpression), this.filterConstruct(rightExpression)],
          }
        }
      }

      for (const i in filterArray.slice(0, filterArray.length - 1)) {
        const item = filterArray[i]
        if (item.conAfter === 'and') {
          const leftExpression = filterArray.slice(0, +i + 1)
          const rightExpression = filterArray.slice(+i + 1)
          return {
            and: [this.filterConstruct(leftExpression), this.filterConstruct(rightExpression)],
          }
        }
      }
    },

    constructFilterFromArray(values = [], key, conn) {
      if (!values.length) {
        return
      }

      const [firstValue] = values
      if (values.length === 1) {
        return { [key]: firstValue }
      }

      return {
        [conn]: [{ [key]: firstValue }, this.constructFilterFromArray(values.slice(1), key, conn)],
      }
    },

    transformStructureToString(obj) {
      return encodeURIComponent(JSON.stringify(obj))
    },

    getStructureFromString(str) {
      return JSON.parse(decodeURIComponent(str))
    },
  },
}
</script>

<style lang="less">
.ivu-table:after {
  content: none;
}

.ivu-table:before {
  content: none;
}

.ivu-table-wrapper {
  border: none;

  > .ivu-spin {
    border: none;
  }
}
.ivu-page-item a {
  font-weight: normal;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__pagination {
    margin-left: 15px;
  }
}
</style>
