<template>
  <div :class="classNames">
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
import fieldMixin from '../mixins/fieldMixin'
import SSelect from '@/components/s-select/SSelect'

export default {
  components: {
    SSelect,
  },
  mixins: [fieldMixin],
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      default: '',
      type: [Array, String],
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
        if (!val) {
          this.$emit('clear', this.filter.key)
          return
        }

        const formattedSelectValue = Array.isArray(val) ? val : [val]
        this.$emit('input', formattedSelectValue)
        if (formattedSelectValue.length) {
          this.$emit('search')
        } else {
          this.$emit('clear', this.filter.key)
        }
      },
    },
  },
  watch: {
    async value(val) {
      if (val) {
        const formattedSelectedIds = Array.isArray(val) ? val.join(',') : val
        const params = {
          filter: {
            id: formattedSelectedIds,
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
