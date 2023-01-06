import { getTags } from '@/api/tags'
import { debounce } from '@/libs/util'
import { fieldTypes } from '@/filter-models/FormFields'

export default {
  data() {
    return {
      types: fieldTypes,
      tags: [],
      newValue: { value: '' },
      tagLoading: false,
    }
  },
  methods: {
    async getTags(query) {
      const params = {
        filter: [
          {
            slug: {
              ilike: query,
            },
          },
        ],
      }
      this.tagLoading = true
      const { data } = await getTags(params)
      this.tags = data.map((item) => {
        return { name: item.slug, value: item.slug }
      })
      this.tagLoading = false
    },
    async remoteTagSearch(query) {
      const trimedQuery = query.trim()

      if (trimedQuery !== '') {
        this.getTags(trimedQuery)
      }
    },
    debounce(fn, time) {
      return debounce(fn, time)
    },
    addValue(values, value, event) {
      const cpValue = { ...value }

      if (value.value !== '') {
        values.push(cpValue)
        value.value = ''
        this.$refs.optionInput.focus()
      }
    },
    removeValue(index) {
      const removed = this.values.find((item, pos) => pos === index)

      if (removed.id) {
        this.$emit('remove-value', removed.id)
      }

      this.values.splice(index, 1)
    },
    selectDefaultOption(value, values, index) {
      values = values.map((val, pos) => {
        if (index === pos) {
          val.default = value
        } else {
          val.default = false
        }

        return val
      })
    },
  },
}
