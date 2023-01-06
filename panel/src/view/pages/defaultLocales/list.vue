<template>
  <div class="users-base-list">
    <Card style="position: relative">
      <Row>
        <i-col span="12">
          <Input
            v-model.trim="filter.value"
            placeholder="Значение"
            clearable
            style="margin-bottom: 15px"
            @on-enter="applyFilter"
            @on-clear="applyFilter"
          />
        </i-col>
      </Row>
      <Row>
        <Table :columns="columns" :data="tableData" :loading="loading" />
      </Row>
    </Card>
  </div>
</template>

<script>
import { apiLocales } from '@/api/locales'

export default {
  data() {
    return {
      filter: {
        key: '',
        value: '',
      },
      params: {
        'per-page': 0,
      },
      loading: false,
      tableData: [],
      tableInitial: [],
      columns: [
        {
          title: 'Ключ',
          key: 'key',
          width: '300px',
        },
        {
          title: 'Стандартное значение',
          key: 'valueRu',
          width: '300px',
        },
        {
          title: 'En',
          key: 'ValueEn',
          render: (h, { row: { id: localeId, valueEn } }) => {
            return h('Input', {
              props: {
                value: valueEn,
              },
              on: {
                'on-blur': async (payload) => {
                  const value = payload && payload.target ? payload.target.value.trim() : ''
                  if (value !== '') {
                    await this.handleEditEn({ localeId, value })
                  }
                },
              },
            })
          },
        },
      ],
    }
  },
  created() {
    this.getLocales()
  },
  methods: {
    async getLocales() {
      this.loading = true
      this.tableData = await this.getFullTableData()
      this.tableInitial = [...this.tableData]
      this.loading = false
    },

    async getFullTableData() {
      try {
        const dataRu = await this.getDefaults('ru')
        const dataEn = await this.getDefaults('en')

        const fullData = dataRu.map((locale) => {
          const engLocale = dataEn.find((r) => locale.key === r.key)
          if (engLocale && engLocale.value === locale.value) {
            return {
              ...locale,
              valueRu: locale.value,
              valueEn: '',
            }
          }
          return {
            ...locale,
            valueRu: locale.value,
            valueEn: engLocale.value,
          }
        })
        return fullData
      } catch (e) {
        throw new Error(e)
      }
    },

    handleEditEn({ localeId, value }) {
      this.updateLocale({ localeId, value, lang: 'en' })
    },

    updateLocale({ localeId, value, lang }) {
      const data = { value }
      apiLocales.updateLocale({ id: localeId, data, params: { ...this.params, lang } })
    },

    async getDefaults(lang) {
      try {
        const params = { ...this.params, lang }
        const { data } = await apiLocales.getAllLocales({ params })

        return data.filter((r) => r.eventId === null)
      } catch (e) {
        throw new Error(e)
      }
    },

    applyFilter() {
      this.loading = true
      this.tableData = this.tableInitial.filter((r) => {
        return this.filterValue(r)
      })
      this.loading = false
    },

    filterValue(locale) {
      const filteredValue = this.filter.value.toLowerCase()
      if (this.filter.value === '') return true
      return (
        locale.valueRu.toLowerCase().includes(filteredValue) ||
        locale.valueEn.toLowerCase().includes(filteredValue)
      )
    },
  },
}
</script>

<style lang="less">
.custom-input input {
  border-color: green;
}
</style>
