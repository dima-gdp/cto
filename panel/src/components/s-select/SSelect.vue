<template>
  <Multiselect
    v-model="value"
    :options="options"
    :searchable="searchable"
    :placeholder="placeholder"
    :show-labels="true"
    :label="label"
    :track-by="trackBy"
    :multiple="multiple"
    :max-height="220"
    open-direction="bottom"
    :class="{
      'multiselect--single': !multiple,
      'multiselect--error': error,
      'multiselect--loading': isLoading,
      'multiselect--searchable': searchable,
      'multiselect--empty': isSelectEmpty,
    }"
    v-on="listeners"
  >
    <template v-if="asyncFunction" slot="loading">
      <div v-show="isLoading" class="multiselect__spinner">Загрузка</div>
    </template>

    <template slot="noResult">
      <div class="multiselect__message">Нет соответствующих данных</div>
    </template>

    <template slot="noOptions">
      <div class="multiselect__message">
        {{ emptyMessage }}
      </div>
    </template>

    <template slot="caret" slot-scope="{ toggle }">
      <span class="multiselect__select" @mousedown.prevent="toggle">
        <icon type="ios-arrow-down" size="14" color="#808695" />
      </span>
      <span
        v-if="searchable && !multiple"
        class="multiselect__reset"
        @mousedown.prevent="resetValue"
      >
        <icon type="ios-close-circle" size="14" color="#808695" />
      </span>
    </template>

    <template v-if="searchable && multiple" slot="option" slot-scope="{ option }">
      <div class="multiselect-option">
        <span class="multiselect-option__title">{{ option[label] }}</span>
        <icon type="ios-checkmark" size="24" color="rgba(45,140,240,.9)" />
      </div>
    </template>

    <template v-if="multiple" slot="tag" slot-scope="{ option }">
      <span class="multiselect__tag">
        <span class="s-tag">
          <span class="s-tag__label">{{ option[label] }}</span>
          <span class="s-tag__icon" @click="removeOption(option[label])">
            <icon type="ios-close" size="20" color="#666" />
          </span>
        </span>
      </span>
    </template>
  </Multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import { isObject } from '@/libs/util'
import { debounce } from '../../libs/util'

export default {
  name: 'SSelect',
  components: { Multiselect },
  model: { prop: 'initialValue', event: 'change-select' },
  props: {
    initialOptions: {
      type: Array,
      default: () => {
        return []
      },
    },
    initialValue: {
      type: [Array, Object, null],
      default: () => {
        return []
      },
    },
    placeholder: { type: String, default: '' },
    label: { type: String, required: true },
    trackBy: { type: String, required: true },
    searchable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    emptyMessage: { type: String, default: 'Список пуст' },
    // eslint-disable-next-line vue/require-default-prop
    asyncFunction: { type: Function },
    error: { type: Boolean, default: false },
  },

  data() {
    return {
      options: this.initialOptions,
      isLoading: false,
    }
  },

  computed: {
    value: {
      get() {
        return this.initialValue
      },

      set(val) {
        this.$emit('change-select', val)
      },
    },

    isSelectEmpty() {
      return !this.value?.length
    },

    listeners() {
      const listeners = {
        close: () => {
          this.$emit('close')
        },
      }
      if (this.asyncFunction) {
        listeners['search-change'] = this.fetchOptions().bind(this)
      }
      return listeners
    },

    checkedLabels() {
      if (Array.isArray(this.value)) {
        return this.value.map((el) => el[this.label])
      } else {
        return [this.value[this.label]]
      }
    },
  },

  methods: {
    fetchOptions() {
      const ctx = this
      return debounce(async function (query) {
        ctx.isLoading = true
        try {
          if (!query) {
            return
          }
          const optionsData = await ctx.asyncFunction(query)
          ctx.optionsValidator(optionsData)
          ctx.options = optionsData
        } catch (e) {
          console.error(e)
        } finally {
          ctx.isLoading = false
        }
      }, 1000)
    },

    optionsValidator(optionsData) {
      if (!Array.isArray(optionsData)) {
        throw new Error('Список опций должен быть массивом')
      }
      if (optionsData.length) {
        optionsData.forEach((el) => {
          if (!isObject(el)) {
            throw new Error('Список должен содержать объекты')
          }
          if (!Object.keys(el).includes(this.label)) {
            throw new Error('Список должен содержать поле label')
          }
        })
      }
    },

    isChecked(option) {
      return this.checkedLabels.value.includes(option[this.label])
    },

    removeOption(slotLabel) {
      this.value = this.value.filter((el) => el[this.label] !== slotLabel)
    },

    resetValue() {
      this.value = null
    },
  },
}
</script>

<style lang="less">
@import './_s-select';
</style>
