<template>
  <Select
    :value="value"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :remote-method="throttledMethod"
    :label="initialLabel"
    filterable
    remote
    @input="updateValue"
  >
    <Option
      v-for="remoteValue in remoteValues"
      :key="remoteValue.id"
      :value="JSON.stringify(remoteValue)"
      :label="remoteValue.city"
    >
      <div class="location-city">
        {{ remoteValue.city }}
      </div>
      <div class="location-region">
        {{ remoteValue.region }}
      </div>
    </Option>
  </Select>
</template>

<script>
import debounce from 'lodash/debounce'
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'
import { getExistingApiInstance } from '@/api'

export default {
  mixins: [UpdateValue, InitValidation],
  props: {
    value: { type: String, default: '' },
    field: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
    countryId: { type: Number, default: 1 },
  },
  data() {
    return {
      remoteValues: [],
    }
  },
  computed: {
    throttledMethod() {
      const DELAY = 500
      return debounce(this.remoteMethod, DELAY)
    },
    initialLabel() {
      try {
        return this.value ? JSON.parse(this.value).city : ''
      } catch {
        return ''
      }
    },
  },
  watch: {
    countryId(val, oldVal) {
      this.updateValue('')
      this.remoteValues = []
    },
  },
  methods: {
    async remoteMethod(query) {
      if (!query) {
        return
      }

      const {
        data: {
          response: { items },
        },
      } = await getExistingApiInstance().vk.getCities(query, {
        country_id: this.countryId,
        lang: this.$i18n.locale,
      })

      this.remoteValues = items.map((i) => ({ id: i.id, city: i.title, region: i.region }))
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
