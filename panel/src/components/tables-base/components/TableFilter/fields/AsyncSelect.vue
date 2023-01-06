<template>
  <div>
    <SSelect
      v-model="realValue"
      :initial-options="asyncData"
      :track-by="filter.valueKey"
      :label="filter.nameKey"
      :placeholder="filter.placeholder"
      :multiple="filter.multiple"
      :searchable="true"
      :async-function="getSelectOptions"
    />
  </div>
</template>

<script>
import SSelect from '@/components/s-select/SSelect'
import { isObject } from '@/libs/util'

export default {
  components: {
    SSelect,
  },
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      type: [Array, String],
      default: () => [],
    },
  },
  data() {
    return {
      asyncData: [],
      formattedValue: null,
    }
  },
  computed: {
    realValue: {
      get() {
        return this.formattedValue
      },
      set(val) {
        if (!val || val.length === 0) {
          this.$emit('clear', this.filter.key)
          return
        }

        if (isObject(val)) {
          this.$emit('input', [val.id])
          this.$emit('search')
          return
        }

        const formattedSelectValue = val.map((item) => item.id)
        this.$emit('input', formattedSelectValue)
        this.$emit('search')
      },
    },
  },
  watch: {
    async value(val) {
      const selectIds = Array.isArray(val) ? val.join(',') : val
      if (val?.length) {
        const params = {
          filter: {
            id: selectIds,
          },
        }
        const { data } = await this.filter.dataSource(params)
        this.formattedValue = data
      } else {
        this.formattedValue = []
      }
    },
  },

  methods: {
    async getSelectOptions(query) {
      if (!query) return
      try {
        const params = {
          filter: {
            [this.filter.nameKey]: {
              ilike: query,
            },
          },
        }
        const { data } = await this.filter.dataSource(params)
        return data
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}
</script>
