<template>
  <div class="users-cards-list">
    <Card>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :columns="columns"
        :filter-config="filterConfig"
        @on-params-change="findByFilter"
        @on-delete="onDeleteSegment"
        @on-download-card="onDownloadCardReport"
        @on-download-card-profile="onDownloadCardProfileReport"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import {
  getAllSegments,
  deleteSegment,
  downloadCardReport,
  downloadCardProfileReport,
} from '@/api/segments'
import { getDate } from '@/libs/tools'
import filterConfig from '@/filter-models/Segments'

export default {
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        include: [].join(','),
        filter: {},
        sort: '-id',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      filterConfig,
    }
  },
  computed: {
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          maxWidth: 70,
        },
        {
          title: 'Название',
          key: 'name',
        },
        {
          title: 'Тип',
          key: 'type',
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          render: (h, params) => {
            if (params.row.createdAt !== null) {
              return h('span', getDate(params.row.createdAt))
            }
          },
        },
        {
          title: 'Действия',
          key: 'handle',
          options: [
            {
              name: 'Удалить',
              action: 'on-delete',
              access: ['administrator'],
            },
            {
              name: 'Выгрузить карточки xls',
              action: 'on-download-card-profile',
              access: ['administrator', 'it'],
            },
            {
              name: 'Выгрузить анкеты xls',
              action: 'on-download-card',
              access: ['administrator', 'it'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 100,
        },
      ]
    },
  },
  methods: {
    async findByFilter(filter) {
      this.params = filter
      this.loading = true
      try {
        const { data, meta } = await getAllSegments(this.params)

        this.tableData = data
        this.tableMeta = meta

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    async onDeleteSegment(row) {
      try {
        await deleteSegment(row.id)
        this.$Message.success('Сегмент удален')
        this.findByFilter(this.params)
      } catch (e) {
        console.error(e)
        this.$Message.error('Ошибка при удалении сегмента')
      }
    },
    async onDownloadCardReport(row) {
      try {
        await downloadCardReport(row.id)
        this.$Message.success('Отчет успешно сформирован')
      } catch (e) {
        console.error(e)
        this.$Message.error('Ошибка при выгрузке карточек сегмента с данными анкет')
      }
    },
    async onDownloadCardProfileReport(row) {
      try {
        await downloadCardProfileReport(row.id)
        this.$Message.success('Отчет успешно сформирован')
      } catch (e) {
        console.error(e)
        this.$Message.error('Ошибка при выгрузке карточек сегмента')
      }
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
