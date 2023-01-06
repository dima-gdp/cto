<template>
  <div class="super-filter">
    <div class="super-filter__conn">
      <Conjunction v-model="innerConjunction" />
    </div>
    <Select
      :id="id"
      class="search-input super-filter__select"
      :value="value"
      :placeholder="filter.placeholder"
      filterable
      clearable
      multiple
      loading-text="Ищем варианты"
      not-found-text="Вариантов не найдено"
      :loading="loading"
      :remote-method="debounce(handleSearch, 800)"
      @on-change="onChange"
      @input="onInput"
    >
      <Option v-for="(data, index) in asyncData" :key="index" :value="data.value">
        {{ data.label }}
      </Option>
    </Select>
  </div>
</template>

<script>
import { searchOptions } from '@/api/filter-data'
import { debounce, getID } from '@/libs/util'
import Conjunction from '../../ComplexTableFilter/components/Conjunction'
// происходит невероятная дичь, проще все удалить чем понять
export default {
  components: {
    Conjunction,
  },
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
      type: [Array, undefined],
    },
    innerConn: {
      type: String,
      default: 'or',
    },
  },
  data() {
    return {
      id: getID(),
      asyncData: [],
      loading: false,
      innerConjunction: this.innerConn,
      isAllSelected: false,
      allSelectedElement: null,
      searchValue: '',
      selectedValues: [],
    }
  },
  computed: {
    isSelectAllDisabled() {
      return this.searchValue.length < 3
    },
    isAllReallySelected() {
      if (!this.value) return false
      return this.asyncData.length === this.value.length
    },
  },
  watch: {
    innerConjunction(val) {
      this.$emit('add-inner-conjunction', val)
    },
    loading(isLoading) {
      if (!this.allSelectedElement) {
        return
      }
      if (isLoading) {
        this.allSelectedElement.style.display = 'none'
      } else {
        this.allSelectedElement.style.display = 'block'
      }
    },
    asyncData(asyncData) {
      if (!this.allSelectedElement) {
        return
      }
      if (!asyncData.length) {
        this.allSelectedElement.style.display = 'none'
      } else {
        this.allSelectedElement.style.display = 'block'
      }
    },
    isSelectAllDisabled(isSelectAllDisabled) {
      if (!this.allSelectedElement) {
        return
      }
      if (isSelectAllDisabled) {
        this.allSelectedElement.setAttribute('disabled', true)
      } else {
        this.allSelectedElement.setAttribute('disabled', false)
      }
    },
    isAllReallySelected(isAllReallySelected) {
      if (!this.allSelectedElement) {
        return
      }
      if (isAllReallySelected) {
        this.allSelectedElement.textContent = 'Убрать все'
      } else {
        this.allSelectedElement.textContent = 'Выбрать все'
      }
    },
  },
  mounted() {
    this.createSelectAllFeature()
  },
  async created() {
    if (this.value && this.value.length) {
      const promises = this.value.map((v) => searchOptions(this.filter.key, v))
      this.loading = true
      const res = await Promise.all(promises)
      this.loading = false
      this.asyncData = res.map((r) => r.data).flat()
    }
  },
  methods: {
    debounce(fn, time) {
      return debounce(fn, time)
    },

    async handleSearch(val) {
      this.loading = true
      this.isAllSelected = false
      this.searchValue = val
      const { data } = await searchOptions(this.filter.key, val).catch(() => {
        this.asyncData = []
      })
      this.asyncData = this.getUniqueObjectArray([...this.selectedValues, ...data], 'value')
      this.loading = false
    },

    getUniqueObjectArray(array, keyName) {
      const objKeys = {}
      array.forEach((i) => {
        objKeys[i[keyName]] = i
      })
      return Object.keys(objKeys).map((k) => objKeys[k])
    },

    onInput(val) {},

    onChange(val) {
      if (this.value && val.length + 1 === this.value.length) {
        this.selectedValues = this.getUniqueObjectArray(
          val.map((i) => ({ value: i, label: i })),
          'value'
        )
      }
      this.$emit('input', val)
      this.$emit('add-inner-conjunction', this.innerConjunction)
      if (this.isAllSelected) {
        this.selectAll()
      }
      this.isAllSelected = false
    },

    createSelectAllFeature() {
      // надеюсь никто никогда не увидит, чем тут пришлось заниматься
      const selector = `#${this.id} .ivu-select-dropdown-list`
      const dropdown = document.querySelector(selector)

      if (this.allSelectedElement) {
        return
      }

      const createElem = this.generateCreateAllWrapperElement()
      createElem.style.display = 'none'

      dropdown.prepend(createElem)
    },

    selectAll() {
      this.isAllSelected = true
      const allValues = [...(this.value || []), ...this.asyncData.map((v) => v.value)]
      const uniqueValues = this.getUniqueValues(allValues)
      this.selectedValues = this.getUniqueObjectArray(
        [...this.selectedValues, ...this.asyncData],
        'value'
      )
      this.$emit('input', [])
      this.$emit('input', uniqueValues)
      this.$emit('add-inner-conjunction', this.innerConjunction)
    },

    getUniqueValues(array) {
      const set = new Set(array)
      return Array(...set)
    },

    deselectAll(event) {
      this.selectedValues = []
      this.isAllSelected = false
      this.$emit('input', [])
    },

    generateCreateAllWrapperElement() {
      const elem = document.createElement('div')

      elem.setAttribute('id', `${this.id}--select-all`)
      elem.classList.add('ivu-select-item')
      elem.textContent = 'Выбрать все'
      elem.addEventListener('click', () => {
        if (this.isSelectAllDisabled) {
          return
        }
        this.isAllReallySelected ? this.deselectAll() : this.selectAll()
      })
      elem.setAttribute('disabled', false)
      this.allSelectedElement = elem
      return elem
    },
  },
}
</script>

<style lang="less">
.super-filter {
  &__conn {
    position: absolute;
    max-width: 20px;
    right: 10px;
    top: 0px;

    & > .ivu-btn {
      padding: 0px;
      border: none;
    }
  }

  &__select {
    margin-top: 10px;
  }

  & .ivu-select-selection {
    max-height: 150px;
    overflow-y: auto;
  }
  .ivu-select-dropdown {
    max-width: 800px;
  }
}

.ivu-select-item {
  input[type='checkbox'] {
    margin-right: 5px;
  }

  &[disabled='true'] {
    color: gray;
  }
}
</style>
