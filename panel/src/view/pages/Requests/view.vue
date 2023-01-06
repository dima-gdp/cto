<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Просмотр материала</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/requests/list')"> Назад </Button>
      </i-col>
    </Row>
    <Row type="flex" class-name="view-content">
      <i-col :span="appealData ? 8 : 24">
        <!-- Request info -->
        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Статус</h3>
              <Row v-if="!load" type="flex">
                <i-col span="24" class-name="view-card-item">
                  <Select v-model="request.status">
                    <Option
                      v-for="(status, index) in requestStatusList"
                      :key="index"
                      :value="status.value"
                    >
                      {{ status.label }}
                    </Option>
                  </Select>
                </i-col>
              </Row>
              <Row>
                <i-col v-if="requestType" span="24">
                  <Input v-model="request.comment" type="textarea" :autosize="true" placeholder="Введите комментарий..."> </Input>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные о материале id {{ appealId }}</h3>
              <Row v-if="!load" type="flex">
                <i-col span="12" class-name="view-card-item">
                  <span v-show="request.createdAt" class="view-card-item__title"
                    >Дата создания:</span
                  >
                  <p class="view-card-item__content">
                    {{ fromISOToString(request.createdAt) }}
                  </p>
                </i-col>
                <i-col v-if="requestType" span="12">
                  <span class="view-card-item__title">Тип:</span>
                  <p class="view-card-item__content">
                    {{ requestType }}
                  </p>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <!-- User data -->
        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные пользователя</h3>
              <Row v-if="request.user && !load" type="flex">
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">ФИО</span>
                  <p class="view-card-item__content">
                    {{ formatUserName }}
                  </p>
                </i-col>
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">Телефон</span>
                  <p class="view-card-item__content">
                    {{ request.user.phone }}
                  </p>
                </i-col>
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">Email</span>
                  <p class="view-card-item__content">
                    {{ request.user.email }}
                  </p>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <div v-if="!load && deleteAccess.includes(role)" class="card-wrap card-wrap--left">
          <Button
            :disabled="!deleteAccess.includes(role)"
            type="error"
            ghost
            long
            @click="startDeleteRequest"
          >
            Удалить материал
          </Button>
        </div>
      </i-col>
      <i-col v-if="appealData && appealData.length" span="16">
        <!-- Form data -->
        <div class="card-wrap card-wrap--right">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные материала</h3>

              <!-- Formatter -->
              <ViewFormatter :data="appealData" :load="load" />
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>
      </i-col>
    </Row>
    <SavePanel @save="updateRequest('save')" @apply="updateRequest('accept')" />
  </div>
</template>

<script>
import { getCurrentEventRequest, deleteEventRequest, updateEventRequest } from '@/api/event'
import { getCurrentRequest } from '@/api/requests'
import { getFieldsList } from '@/api/forms'
import { fromISOToString } from '@/libs/util.js'
import SavePanel from '@/components/save-panel/save-panel'

import ViewFormatter from '_c/ViewFormatter'
import { mapGetters } from 'vuex'
import { fromStampToStringWithoutTime } from '@/libs/util'
export default {
  components: {
    ViewFormatter,
    SavePanel,
  },
  data() {
    return {
      request: {},
      requestType: '',
      fields: [],
      appealData: [],
      load: true,
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
    ...mapGetters(['role']),
    deleteAccess() {
      return ['it', 'administrator']
    },
    appealId() {
      return this.$route.params.id
    },
    formatUserName() {
      if (this.request.user) {
        const { firstName, middleName, lastName } = this.request.user

        if (firstName && middleName && lastName) {
          return `${lastName} ${firstName[0]}.${middleName[0]}.`
        }
        if (firstName && lastName) {
          return `${lastName} ${firstName[0]}.`
        }
      }

      return ''
    },
  },
  created() {
    this.getDependencies(this.appealId)
  },
  methods: {
    fromISOToString,
    async getDependencies(id) {
      this.load = true

      const requestParams = {
        include: 'user,fields',
      }

      const requestData = await getCurrentEventRequest(id, requestParams).catch((e) => {
        this.load = false
        console.error(e)
      })

      this.request = { ...requestData.data }

      const requestId = requestData.data.requestId

      const res = await getCurrentRequest(requestId).catch((e) => {
        this.requestType = ''
        this.load = false
        console.error(e)
      })

      this.requestType = res.data.name

      if (!requestData.data.fields) {
        this.appealData = undefined
        this.load = false
        return
      }

      const fieldsIds = requestData.data.fields.map((f) => f.fieldId)

      const fieldsListParams = {
        include: 'values,group',
        filter: {
          id: fieldsIds.join(','),
        },
        'per-page': 0,
      }

      const fieldsListData = await getFieldsList(fieldsListParams).catch((e) => {
        this.load = false
        console.error(e)
      })

      this.fields = [...fieldsListData.data]

      this.formatRequest()
      this.load = false
    },
    formatRequest() {
      this.appealData = this.request.fields.map((f) => {
        const field = this.fields.find((field) => f.fieldId === +field.id)
        return {
          field,
          value: f.value,
        }
      })

      this.appealData = this.appealData.filter((data) => data.field)
      this.appealData = this.prepareData(this.appealData)
    },
    prepareData(data) {
      return data.map((item) => {
        switch (item.field.type) {
          case 'datatime':
            item.value = this.formatDate(item.value)
            return item
          default:
            break
        }

        if (item.field.type !== 'file' && Array.isArray(item.value)) {
          item.value = item.value.join(', ').trim()
        }

        return item
      })
    },
    formatDate(date) {
      if (+date) return fromStampToStringWithoutTime(date)
      else return date
    },
    startDeleteRequest(e, id = this.appealId) {
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
        this.$router.push({ path: '/requests/list' })
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },
    async updateRequest(action) {
      this.load = true
      try {
        await updateEventRequest(this.request.id, {
          status: this.request.status,
          comment: this.request.comment,
        })
        if (action === 'save') {
          await this.$router.push('/requests/list')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.load = false
      }
    },
  },
}
</script>
