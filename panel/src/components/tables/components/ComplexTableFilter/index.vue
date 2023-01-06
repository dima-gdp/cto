<template>
  <!--  компонент писался в "mvp-стиле", и не предназначен для поддержки -->
  <div>
    <div class="complex-filter">
      <div
        v-for="(item, index) in addedFilters"
        :key="index"
        class="complex-filter__filter-area filter-area"
        :style="`${item.isDeleted ? 'display: none;' : ''}`"
      >
        <div class="filter-area__remove-btn">
          <Button
            icon="md-close"
            type="error"
            size="small"
            ghost
            shape="circle"
            @click="item.isDeleted = true"
          />
        </div>
        <div v-if="!item.key" class="filter-area__selector">
          <Select v-model="item.key">
            <Option v-for="filter in filterConfig" :key="filter.position" :value="filter.key">
              {{ filter.placeholder }}
            </Option>
          </Select>
        </div>
        <div v-else class="filter-area__filter-box filter-box">
          <div class="filter-box__filter">
            <TableFilter
              v-model="item.value"
              :filter="filterConfig.find((f) => f.key === item.key)"
              :inner-conn="item.innerCon"
              with-labels
              @add-inner-conjunction="item.innerCon = $event"
            />
          </div>
          <div class="filter-box__button">
            <Button
              size="small"
              icon="md-create"
              type="default"
              long
              shape="circle"
              @click="clearFilter(index)"
            />
          </div>
        </div>
        <div class="filter-area__conjunction">
          <Conjunction v-model="item.conAfter" />
        </div>
      </div>
      <div class="complex-filter__filter-add-btn filter-add-btn">
        <Button
          icon="md-add"
          type="primary"
          shape="circle"
          @click="addFilter(addedFilters.length)"
        />
      </div>
    </div>
    <div class="filter-btn">
      <Button type="primary" class="users-base-list-actions__btn" @click="createFilters">
        <span>Применить фильтр</span>
      </Button>
    </div>
  </div>
</template>

<script>
import Conjunction from './components/Conjunction'
import TableFilter from '../TableFilter'

export default {
  components: {
    Conjunction,
    TableFilter,
  },

  props: {
    filterConfig: { type: Array, default: () => [] },
    visualStructure: { type: Array, default: () => [] },
  },

  data: () => ({
    addedFilters: [],
    model: '',
    isFiltersInvalid: false,
  }),

  computed: {
    selectedFilters() {
      const isValueExist = (val) => (Array.isArray(val) ? !!val.length : !!val)
      return this.addedFilters.filter((f) => f.key && isValueExist(f.value) && !f.isDeleted)
    },
  },

  mounted() {
    if (this.visualStructure) {
      this.addedFilters = this.visualStructure
    }
  },

  methods: {
    addFilter(index) {
      this.addedFilters.push({ index, conAfter: 'and', isDeleted: false })
    },

    clearFilter(index) {
      // привет реактивность! (не убирать)
      this.addedFilters[index].value = undefined
      this.addedFilters[index].key = undefined
    },

    createFilters() {
      this.$emit('search', this.selectedFilters)
    },
  },
}
</script>

<style scoped lang="less">
// сброс стилей
.complex-filter .ivu-col {
  padding: 0px;
}

.table-filter__item {
  padding: 0px;
}

.filter-box .ivu-col-span-xs-6 {
  width: 100%;
}
// рабочие стили
.complex-filter {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  align-items: center;
  column-gap: 60px;
  row-gap: 15px;
  padding: 5px 0px;
  min-height: 88px;

  &__filter-add-btn {
    min-height: 88px;
  }
}

.filter-area {
  display: grid;
  position: relative;
  grid-template-columns: min-content 1fr min-content;
  align-items: center;
  column-gap: 10px;
  padding: 10px;
  min-height: 88px;
  border-radius: 5px;

  &__filter-box {
    padding: 5px 10px 10px;
  }

  &__selector {
    padding: 10px;
    margin: 0px -10px;
  }

  &__conjunction {
    position: absolute;
    max-width: 40px;
    right: -50px;
  }

  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 0 1px 6px rgba(66, 75, 95, 0.651);
  }
}

.filter-box {
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr min-content;
  column-gap: 5px;
  align-items: center;
}

.filter-btn {
  width: 100%;
  padding: 15px 0px;
  display: flex;
  justify-content: flex-end;
}

.filter-add-btn {
  display: flex;
  align-items: center;
}
</style>
