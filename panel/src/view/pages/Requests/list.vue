<template>
  <div>
    <Card>
      <Button
        v-if="role === 'administrator' || role === 'it' || permissions.includes('downloadRequest')"
        type="primary"
        icon="md-add"
        class="ivu-card-body__btn-create"
        @click="createReport"
      >
        Создать отчет
      </Button>
      <Tables
        ref="tables"
        v-model="tableData"
        searchable
        search-place="top"
        :loading="loading"
        :paging="tableMeta"
        :params="params"
        :filter-config="filterConfig"
        :columns="columns"
        @on-params-change="findByFilter"
        @on-route="toAppeal"
        @on-delete="startDeleteRequest"
        @on-edit="toEditAppeals"
      />
    </Card>
    <Modal v-model="modalRequestStatus" title="Изменить статус" @on-ok="warningModal = true">
      <Form>
        <FormItem>
          <Select v-model="currentRequest.status">
            <Option v-for="(status, index) in requestStatusList" :key="index" :value="status.value">
              {{ status.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            v-model="currentRequest.comment"
            type="textarea"
            :autosize="true"
            placeholder="Введите комментарий..."
          >
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="warningModal" @on-ok="updateStatusRequest">
      <p>Вы уверены что хотите изменить статус?</p>
      <p>После изменения пользователю будет отправлено уведомление</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables-base'
import filterConfig from '@/filter-models/Requests'
import { mapGetters } from 'vuex'
import { getEventRequests, deleteEventRequest, updateEventRequest } from '@/api/event'
import { getRequests } from '@/api/requests'
import { fromISOToString } from '@/libs/util.js'
import { REQUESTS_TYPE_MAP, REQUESTS_TYPE_COLOR_MAP } from '@/libs/constants.js'

export default {
  name: 'Requests',
  components: {
    Tables,
  },
  data() {
    return {
      params: {
        filter: {},
        include: 'user',
        sort: '-id',
      },
      loading: false,
      tableData: [],
      tableMeta: {},
      deleteModal: false,
      requests: [],
      filterConfig: filterConfig,
      modalRequestStatus: false,
      warningModal: false,
      currentRequest: {
        status: null,
        comment: '',
      },
      requestStatusList: [
        {
          value: 'under_consideration',
          label: 'На рассмотрении',
        },
        {
          value: 'rejected',
          label: 'Отклонено',
        },
        {
          value: 'accepted_for_publication',
          label: 'Принято к публикации',
        },
        {
          value: 'accepted_for_the_report',
          label: 'Принято к выступлению',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      role: 'role',
      permissions: 'permissions',
    }),
    columns() {
      if (['manager', 'it', 'administrator'].includes(this.role)) {
        return [
          {
            title: 'ID',
            key: 'id',
            type: 'integer',
            searchable: true,
            sortable: true,
            sortType: 'desc',
            maxWidth: 70,
          },
          {
            title: 'ФИО',
            key: 'name',
            type: 'string',
            searchable: true,
            sortable: true,
            render: (h, params) => {
              if (params.row.user) {
                return h(
                  'span',
                  `${params.row.user.lastName} ${params.row.user.firstName} ${params.row.user.middleName}`
                )
              } else {
                return null
              }
            },
          },
          {
            title: 'Название материала',
            key: 'base-request.name',
            type: 'string',
            searchable: true,
            sortable: true,
            render: (h, params) => {
              if (params.row.type) {
                return h('span', `${params.row.type}`)
              } else {
                return null
              }
            },
          },
          {
            title: 'Телефон',
            key: 'user.phone',
            searchable: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.user) {
                return h('span', `${params.row.user.phone}`)
              } else {
                return null
              }
            },
          },
          {
            title: 'Статус',
            key: 'status',
            searchable: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.status) {
                const content = [
                  h('span', REQUESTS_TYPE_MAP[params.row.status]),
                  h('Icon', { attrs: { type: 'md-create' } }),
                ]

                return h(
                  'div',
                  {
                    class: [
                      { [`request-status`]: true },
                      { [`request-status--${REQUESTS_TYPE_COLOR_MAP[params.row.status]}`]: true },
                    ],
                    on: {
                      click: () => {
                        this.statusRequest(params.row)
                      },
                    },
                  },
                  content
                )
              } else {
                return null
              }
            },
          },
          {
            title: 'Коментарии',
            key: 'comment',
            searchable: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.comment) {
                return h('span', `${params.row.comment}`)
              } else {
                return h('span', `-`)
              }
            },
          },
          {
            title: 'Дата подачи',
            key: 'requestCreatedAt',
            sortable: true,
            render: (h, params) => {
              return h('span', this.fromISOToString(params.row.createdAt))
            },
          },
          {
            title: '',
            key: 'handle',
            options: [
              {
                name: 'Просмотр',
                action: 'on-route',
                access: ['manager', 'it', 'administrator'],
              },
              {
                name: 'Удаление',
                action: 'on-delete',
                style: {
                  color: '#ed4014',
                },
                access: ['it', 'administrator'],
              },
            ],
            slot: 'actions',
            align: 'center',
            maxWidth: 70,
          },
        ]
      }
      return [
        {
          title: 'ID',
          key: 'id',
          type: 'integer',
          searchable: true,
          sortable: true,
          sortType: 'desc',
          maxWidth: 70,
        },
        {
          title: 'ФИО',
          key: 'name',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.user) {
              return h(
                'span',
                `${params.row.user.lastName} ${params.row.user.firstName} ${params.row.user.middleName}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Название материала',
          key: 'base-request.name',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.type) {
              return h('span', `${params.row.type}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Телефон',
          key: 'user.phone',
          searchable: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.user) {
              return h('span', `${params.row.user.phone}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Дата подачи',
          key: 'requestCreatedAt',
          sortable: true,
          render: (h, params) => {
            return h('span', this.fromISOToString(params.row.createdAt))
          },
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Просмотр',
              action: 'on-route',
              access: ['manager', 'it', 'administrator'],
            },
            {
              name: 'Удаление',
              action: 'on-delete',
              style: {
                color: '#ed4014',
              },
              access: ['it', 'administrator'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        },
      ]
    },
  },
  methods: {
    fromISOToString,
    async findByFilter(filter) {
      this.params = filter
      this.loading = true
      var requestsParams = {
        'per-page': 0,
      }
      try {
        const requestsRes = await getRequests(requestsParams)
        const ids = requestsRes.data.map((i) => i.id)
        const usersRes = await getEventRequests(filter)

        usersRes.data = usersRes.data.map((user) => {
          const additionalReqData = requestsRes.data.find((item) => +user.requestId === +item.id)

          return {
            ...user,
            type: additionalReqData.name,
            requestCreatedAt: additionalReqData.createdAt,
          }
        })

        this.requests = requestsRes.data

        this.tableData = usersRes.data
        this.tableMeta = usersRes.meta

        this.loading = false
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    startDeleteRequest({ id }) {
      this.$Modal.confirm({
        title: 'Удаление материала',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить материал: id${id} ?</p>`,
        onOk: () => {
          this.deleteRequest(id)
        },
      })
    },
    async deleteRequest(id) {
      try {
        await deleteEventRequest(id)
        this.$Message.success('Материал успешно удален')
        await this.findByFilter(this.params)
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },
    toAppeal({ id }) {
      this.$router.push({ path: `/requests/${id}` })
    },
    toEditAppeals({ id }) {
      this.$router.push({ path: `/requests/edit/${id}` })
    },
    async createReport() {
      const reports = 'xlsx'
      const cpFilter = {
        filter: this.params.filter,
        download: reports,
      }
      try {
        await getEventRequests(cpFilter)
        this.$Message.success('Вы успешно сформировали отчет')
      } catch (e) {
        console.error(e)
        this.$Message.error('Ошибка')
      }
    },
    statusRequest(request) {
      this.currentRequest = { ...request }
      this.modalRequestStatus = true
    },
    async updateStatusRequest() {
      try {
        await updateEventRequest(this.currentRequest.id, {
          status: this.currentRequest.status,
          comment: this.currentRequest.comment,
        })

        const changedRow = this.tableData.find((row) => row.id === this.currentRequest.id)
        changedRow.status = this.currentRequest.status
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less">
.request-status {
  cursor: pointer;

  &--warning {
    color: #ffc107;
  }

  &--danger {
    color: #dc3545;
  }

  &--success {
    color: #28a745;
  }

  .ivu-icon {
    margin-left: 10px;
    font-size: 20px;
  }
}
</style>
