<template>
  <div>
    <Dropdown trigger="click" @on-click="selectLang">
      <a href="javascript:void(0)">
        {{ title }}
        <Icon :size="18" type="md-arrow-dropdown" />
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localList" :key="`lang-${key}`" :name="key">
          {{ value }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'Language',
  // TODO: Поставить значения по-умолчанию у пропсов
  /* eslint-disable vue/require-default-prop */
  props: {
    lang: String,
  },
  /* eslint-enable vue/require-default-prop */
  data() {
    return {
      langList: {
        'ru-RU': 'Язык',
        'en-US': 'Lang',
      },
      localList: {
        'ru-RU': 'Русский',
        'en-US': 'English',
      },
    }
  },
  computed: {
    title() {
      return this.langList[this.lang]
    },
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang
    },
  },
  methods: {
    selectLang(name) {
      this.$emit('on-lang-change', name)
    },
  },
}
</script>
