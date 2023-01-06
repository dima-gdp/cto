<template>
  <div>
    <div v-if="searchable" class="search-con search-con-top">
      <template v-if="filterConfig">
        <Form class="table-filter" inline @submit.native.prevent>
          <Row type="flex" align="middle">
            <Col v-for="(f, index) in formatFilterConfig" :key="index" :xs="6">
              <component
                :is="filterField(f.type)"
                v-model="currentParams.filter[f.key]"
                :filter="f"
                class="table-filter__item"
                @search="handleSearch"
                @clear="handleClear"
              />
            </Col>
          </Row>
        </Form>
      </template>
    </div>
    <Table
      ref="tablesMain"
      :loading="loading"
      :data="value"
      :columns="insideColumns"
      @on-sort-change="onSortChange"
    >
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
          :current="currentParams.page"
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
import TableFilter from './components/TableFilter'
import { mapGetters } from 'vuex'
import Input from './components/TableFilter/fields/Input'
import AsyncSelect from './components/TableFilter/fields/AsyncSelect'
import Select from './components/TableFilter/fields/Select'
import DateRange from './components/TableFilter/fields/DateRange'
import Radio from './components/TableFilter/fields/Radio'
import { isObject } from '@/libs/util'

export default {
  name: 'Tables',
  components: { TableFilter, Input, AsyncSelect, Select, Radio, DateRange },
  props: {
    filterConfig: { type: Array, default: () => [], required: false },
    value: { type: Array, default: () => [] },
    paging: { type: Object, default: () => {} },
    columns: { type: Array, default: () => [] },
    params: { type: Object, default: () => ({ filter: {} }) },
    loading: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    preserveFilter: { type: Object, default: () => ({ filter: {} }) },
  },

  data() {
    return {
      currentParams: { ...this.params },
      insideColumns: this.columns,
      insideTableData: [],
      searchValue: {},
    }
  },

  computed: {
    ...mapGetters(['role']),
    paginationInfo() {
      const total = this.paging.totalCount
      return `Всего ${total} записей`
    },
    formatFilterConfig() {
      return this.filterConfig
        .filter((config) => config.access.includes(this.role))
        .sort((a, b) => a.position - b.position)
    },
  },

  watch: {
    columns(columns) {
      this.insideColumns = columns
    },
  },

  async mounted() {
    this.initialSetCurrentParams()
    this.applyParams()
  },

  methods: {
    filterField(type) {
      switch (type) {
        case 'Input':
          return Input
        case 'Select':
          return Select
        case 'Radio':
          return Radio
        case 'AsyncSelect':
          return AsyncSelect
        case 'DateRange':
          return DateRange
        default:
          break
      }
    },

    setFilterFromUrl() {
      const params = this.$route.query
      if (!Object.values(params).length) return
      this.currentParams = { filter: {}, ...this.getDecodedFilter(params) }
    },

    initialSetCurrentParams() {
      if (Object.keys(this.preserveFilter.filter).length) {
        this.currentParams = { ...this.preserveFilter }
      } else {
        this.setFilterFromUrl()
      }
    },

    getEncodedFilter(filter) {
      return Object.fromEntries(
        Object.entries(filter).map(([key, value]) => {
          if (isObject(value)) {
            return [key, this.getEncodedFilter(value)]
          }
          return [key, encodeURIComponent(value)]
        })
      )
    },

    getDecodedFilter(filter) {
      return Object.fromEntries(
        Object.entries(filter).map(([key, value]) => {
          if (isObject(value)) {
            return [key, this.getDecodedFilter(value)]
          }
          return [key, decodeURIComponent(value)]
        })
      )
    },

    addFiltersToUrl() {
      const encodedQuery = this.getEncodedFilter(this.currentParams)
      if (JSON.stringify(this.$route.query) === JSON.stringify(encodedQuery)) return

      this.$router.push({ ...this.$route, query: { ...encodedQuery } })
    },

    handleSearch() {
      this.addFiltersToUrl()
      this.applyParams()
    },

    handleClear(key) {
      delete this.currentParams.filter[key]
      this.handleSearch()
    },

    applyParams() {
      this.$emit('on-params-change', this.currentParams)
    },

    onSortChange(column) {
      const sort = column.order === 'asc' ? column.key : `-${column.key}`
      this.currentParams.sort = sort
      this.currentParams.page = 1
      this.$emit('on-params-change', this.currentParams)
    },

    changePage(page) {
      this.currentParams.page = page
      this.$emit('on-params-change', this.currentParams)
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

.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 5px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}

// Стили для фильтра
.table-filter {
  &__item {
    padding: 5px;

    > .search-input {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
