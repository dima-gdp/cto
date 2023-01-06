<template>
  <Select
    :value="value"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :label="initialLabel"
    filterable
    clearable
    @input="updateValue"
  >
    <Option
      v-for="remoteValue in countries"
      :key="remoteValue.id"
      :value="JSON.stringify(remoteValue)"
      :label="remoteValue.country"
    >
      {{ remoteValue.country }}
    </Option>
  </Select>
</template>

<script>
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'
import { getExistingApiInstance } from '@/api'

export default {
  mixins: [UpdateValue, InitValidation],
  props: {
    value: { type: String, default: '' },
    field: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      countries: [],
    }
  },
  computed: {
    initialLabel() {
      try {
        return this.value ? JSON.parse(this.value).title : ''
      } catch {
        return ''
      }
    },
  },
  mounted() {
    this.getCountries()
  },
  methods: {
    async getCountries() {
      const {
        data: {
          response: { items },
        },
      } = await getExistingApiInstance().vk.getCountries({ lang: this.$i18n.locale })

      this.countries = items.map((i) => ({
        id: i.id,
        country: i.title,
      }))
    },
  },
}
</script>

<style>
.location-city {
  font-weight: bold;
}
.location-region {
  opacity: 0.8;
}
</style>
