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
        filter: [{ 'event-id': this.$route.params.id }],
        'per-page': 0,
        lang: 'ru',
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
          key: 'defaultStr',
          width: '300px',
        },
        {
          title: 'Ru',
          key: 'valueRu',
          render: (h, { row: { id: localeId, eventId, key, valueRu, defaultStr } }) => {
            return h('Input', {
              props: {
                value: valueRu,
              },
              on: {
                'on-blur': async (payload) => {
                  const value = payload && payload.target ? payload.target.value.trim() : ''
                  if (value !== '') {
                    await this.handleEditRu({ eventId, localeId, value, key })
                  }
                },
              },
            })
          },
        },
        {
          title: 'En',
          key: 'ValueEn',
          render: (h, { row: { id: localeId, valueRu, valueEn, defaultStr } }) => {
            return h('Input', {
              props: {
                value: valueRu ? valueEn : '',
                disabled: valueRu === '',
              },
              on: {
                'on-blur': async (payload) => {
                  const value = payload && payload.target ? payload.target.value.trim() : ''
                  if (value !== '' && value !== defaultStr) {
                    await this.handleEditEn({ localeId, value })
                  }
                },
              },
            })
          },
        },
        {
          title: 'Сброс',
          width: '80px',
          render: (h, { row }) => {
            return h('Button', {
              class: '',
              props: {
                size: 'large',
                icon: 'ios-download-outline',
                type: 'primary',
                shape: 'circle',
                disabled: row.valueRu === '',
              },
              on: {
                click: () => {
                  this.clearCustomLocale(row)
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
      //  Получает дефолтные строчки и конкретные для данного мероприятия,
      // и схлопывает их в один масств объектов
      const defaults = await this.getDefaults()

      try {
        const { data: dataRu } = await apiLocales.getAllLocales({
          params: { ...this.params, lang: 'ru' },
        })
        const { data: dataEn } = await apiLocales.getAllLocales({
          params: { ...this.params, lang: 'en' },
        })

        const fullData = defaults.map((locale) => {
          const customLocale = dataRu.find((r) => locale.key === r.key)

          if (customLocale) {
            const engLocale = dataEn.find((r) => locale.key === r.key)
            if (engLocale && engLocale.value === customLocale.value) {
              return {
                ...customLocale,
                defaultStr: locale.value,
                valueRu: customLocale.value,
                valueEn: '',
              }
            }
            return {
              ...customLocale,
              defaultStr: locale.value,
              valueRu: customLocale.value,
              valueEn: engLocale.value,
            }
          }
          return { ...locale, defaultStr: locale.value, valueRu: '', valueEn: '' }
        })

        return this.deleteDoubles(fullData)
      } catch (e) {
        throw new Error(e)
      }
    },

    deleteDoubles(locales) {
      const unique = []
      for (const locale of locales) {
        if (!unique.find((l) => locale.key === l.key)) {
          unique.push(locale)
        }
      }
      return unique
    },

    async handleEditRu({ eventId, localeId, value, key }) {
      if (eventId === null) {
        const { id } = await this.createLocale({ localeId, value, key })

        this.tableData = this.tableData.map((r) =>
          r.key === key ? { ...r, valueRu: value, id } : r
        )
      } else {
        await this.updateLocale({ localeId, value, lang: 'ru' })
      }
    },

    async handleEditEn({ localeId, value }) {
      await this.updateLocale({ localeId, value, lang: 'en' })
    },

    async createLocale({ localeId, value, key }) {
      const data = {
        key,
        event_id: this.$route.params.id,
        value,
      }
      const { data: response } = await apiLocales.createLocale({ data, params: this.params })
      this.getLocales()
      return response
    },

    async updateLocale({ localeId, value, lang }) {
      const data = { value }
      await apiLocales.updateLocale({ id: localeId, data, params: { ...this.params, lang } })
    },

    async getDefaults() {
      // TODO: нужен бекенд для получения дефолтных значений локалей.
      // На данный момент, получает все и фильтрует их по тем, у кого нет event ID
      try {
        const filterWithoutFilterEventId = this.params.filter.filter(
          (f) => f['event-id'] === undefined
        )
        const params = { ...this.params, filter: filterWithoutFilterEventId }
        const { data } = await apiLocales.getAllLocales({ params })

        const defaults = data.filter((r) => r.eventId === null)
        return defaults
      } catch (e) {
        throw new Error(e)
      }
    },

    async clearCustomLocale(row) {
      try {
        this.loading = true
        await apiLocales.deleteLocale({ id: row.id })
        this.loading = false
        this.getLocales()
      } catch (e) {
        this.loading = false
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
      const filtredValue = this.filter.value.toLowerCase()
      if (this.filter.value === '') return true
      return (
        locale.defaultStr.toLowerCase().includes(filtredValue) ||
        locale.valueRu.toLowerCase().includes(filtredValue) ||
        locale.valueEn.toLowerCase().includes(filtredValue)
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
