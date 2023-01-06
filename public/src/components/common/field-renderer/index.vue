<template>
  <div>
    <Checkbox
      v-if="field.type === 'checkbox'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <DataTime
      v-if="field.type === 'datatime'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <File
      v-if="field.type === 'file'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <Select
      v-if="field.type === 'select'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <MultiSelect
      v-if="field.type === 'multiselect'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <Phone
      v-if="field.type === 'phone'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <Radio
      v-if="field.type === 'radio'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <StringInput
      v-if="field.type === 'string'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <TextInput
      v-if="field.type === 'text'"
      :value="value"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValue"
    />

    <LocationField
      v-if="field.type === 'location'"
      :value="value ? JSON.stringify(value) : ''"
      :field="preparedField"
      :disabled="disabled"
      :country-id="countryId"
      @input="updateValueLocation"
    />

    <CountryField
      v-if="field.type === 'country'"
      :value="value ? JSON.stringify(value) : ''"
      :field="preparedField"
      :disabled="disabled"
      @input="updateValueLocation"
    />
  </div>
</template>

<script>
import UpdateValue from './mixins/update-value'

import Checkbox from './fields/checkbox.vue'
import DataTime from './fields/data-time.vue'
import File from './fields/file.vue'
import Select from './fields/select.vue'
import MultiSelect from './fields/multi-select.vue'
import Phone from './fields/phone.vue'
import Radio from './fields/radio.vue'
import StringInput from './fields/string.vue'
import TextInput from './fields/text.vue'
import LocationField from './fields/location.vue'
import CountryField from './fields/country.vue'

export default {
  components: {
    Checkbox,
    DataTime,
    File,
    Select,
    MultiSelect,
    Phone,
    Radio,
    StringInput,
    TextInput,
    LocationField,
    CountryField,
  },
  mixins: [UpdateValue],
  // eslint-disable-next-line
  props: ['value', 'field', 'disabled', 'countryId'],
  computed: {
    preparedField() {
      // Сортируем опции если они есть
      return { ...this.field, values: this.sortFieldValues(this.field.values) }
    },
  },
  methods: {
    updateValueLocation(val) {
      if (val) {
        this.$emit('input', JSON.parse(val))
      } else {
        this.$emit('input', '')
      }
    },
    sortFieldValues(values) {
      if (values && Array.isArray(values)) {
        const vList = [...values]
        vList.sort(({ sort: a }, { sort: b }) => +a - +b)
        return vList
      }
      return values
    },
  },
}
</script>
