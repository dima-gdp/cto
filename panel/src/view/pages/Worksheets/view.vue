<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Просмотр анкеты</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/worksheets/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <Row type="flex" class-name="view-content">
      <i-col span="8">
        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные об анкете id {{ worksheetId }}</h3>
              <Row type="flex">
                <i-col span="24" class-name="view-card-item">
                  <span v-show="registration.createdAt" class="view-card-item__title"
                    >Дата создания:</span
                  >
                  <p class="view-card-item__content">
                    {{ formatDate(registration.createdAt) }}
                  </p>
                </i-col>
                <i-col span="24" class-name="view-card-item">
                  <span v-show="email" class="view-card-item__title">Email:</span>
                  <p class="view-card-item__content">
                    {{ email }}
                  </p>
                </i-col>
                <i-col span="24" class-name="view-card-item">
                  <span class="view-card-item__title">Был на мероприятии</span>
                  <p v-if="registration.isVisited" class="view-card-item__content">Да</p>
                  <p v-else-if="registration.isVisited === null" class="view-card-item__content">
                    Не известно
                  </p>
                  <p v-else class="view-card-item__content">Нет</p>
                </i-col>
                <i-col
                  v-if="role === 'administrator' || role === 'it' || role === 'manager'"
                  span="24"
                  class-name="view-card-item"
                >
                  <span class="view-card-item__title">№ членского билета</span>
                  <Form ref="userTicket" :model="formTicket">
                    <FormItem>
                      <Input v-model="registration.ticketNumber"></Input>
                    </FormItem>
                  </Form>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <!-- Comments -->
        <div class="card-wrap card-wrap--left">
          <!-- Comments data -->
          <Card
            v-if="!commentVisible && registration.comment && registration.comment !== null"
            :bordered="false"
            class="view-card"
          >
            <h3 class="view-card__title">Комментарий:</h3>
            <Row type="flex">
              <i-col span="24">
                <p class="view-card-item__content">
                  {{ registration.comment }}
                </p>
              </i-col>
            </Row>
            <Spin v-if="load" fix></Spin>
          </Card>

          <!-- Comments component -->
          <Card v-if="commentVisible" :bordered="false" class="view-card">
            <SingleComment v-model="comment" @save-comment="saveComment" />
            <Spin v-if="load" fix></Spin>
          </Card>

          <div class="card-wrap card-wrap--left card-wrap--right">
            <!-- Comments actions -->
            <Button v-if="!commentVisible && !load" long @click="commentVisible = true">
              {{ registration.comment ? 'Редактировать комментарий' : 'Добавить комментарий' }}
            </Button>
          </div>
          <div
            v-if="role === 'administrator' || role === 'it' || role === 'manager'"
            class="card-wrap card-wrap--left card-wrap--right"
          >
            <!-- Comments actions -->
            <Button type="primary" long @click="updateRegistration(true)"> Сохранить </Button>
          </div>
          <div
            v-if="role === 'administrator' || role === 'it' || role === 'manager'"
            class="card-wrap card-wrap--left card-wrap--right"
          >
            <!-- Comments actions -->
            <Button long @click="updateRegistration(false)"> Применить </Button>
          </div>
        </div>

        <div v-if="!load && deleteAccess.includes(role)" class="card-wrap card-wrap--left">
          <Button
            :disabled="!deleteAccess.includes(role)"
            type="error"
            ghost
            long
            @click="startDeleteWorksheet"
          >
            Удалить анкету
          </Button>
        </div>
      </i-col>
      <i-col span="16">
        <div class="card-wrap card-wrap--right">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Анкетные данные</h3>

              <!-- Formatter -->
              <ViewFormatter :data="worksheetData" :load="load" />
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { getCurrentRegistration, deleteEventRegistration, updateRegistration } from '@/api/event'
import { getFieldsList } from '@/api/forms'

import ViewFormatter from '_c/ViewFormatter'
import SingleComment from '_c/single-comment'
import { mapGetters } from 'vuex'

import dayjs from 'dayjs'

export default {
  components: {
    ViewFormatter,
    SingleComment,
  },
  data() {
    return {
      formTicket: {
        ticket: '12345',
      },
      registration: {
        comment: null,
      },
      fields: [],
      worksheetData: [],
      load: true,
      commentVisible: false,
      comment: '',
    }
  },
  computed: {
    ...mapGetters(['role']),
    deleteAccess() {
      return ['it', 'administrator']
    },
    worksheetId() {
      return this.$route.params.id
    },
    email () {
      return this.registration.user?.email
    },
  },
  created() {
    this.getDependencies(this.worksheetId)
  },
  methods: {
    async getDependencies(id) {
      this.load = true
      const registrationParams = {
        include: ['fields', 'user'].join(','),
        fields: {
          user: ['email'].join(','),
        },
      }

      try {
        const { data: currentRegistration } = await getCurrentRegistration(id, registrationParams)
        this.registration = { ...currentRegistration }
        this.comment = currentRegistration.comment
        const fieldsIds = currentRegistration.fields.map((f) => f.fieldId)
        const fieldsListParams = {
          include: 'values',
          filter: {
            id: fieldsIds.join(','),
          },
          'per-page': 0,
        }
        // todo: огромный запрос
        const { data: fields } = await getFieldsList(fieldsListParams)
        this.fields = [...fields]
      } catch (e) {
        console.error(e)
      } finally {
        this.load = false
      }

      this.formatWorksheet()
    },
    formatWorksheet() {
      this.worksheetData = this.registration.fields.map((f) => {
        const field = this.fields.find((field) => f.fieldId === +field.id)
        return {
          field,
          value: f.value,
        }
      })

      this.worksheetData = this.worksheetData.filter((data) => data.field)
      this.worksheetData = this.prepareData(this.worksheetData)
    },
    prepareData(data) {
      return data.map((item) => {
        switch (item.field.type) {
          case 'datatime':
            item.value = this.formatDate(+item.value)
            return item
          default:
            break
        }

        if (Array.isArray(item.value) && item.field.type !== 'file') {
          item.value = item.value.join(', ').trim()
        }

        return item
      })
    },
    formatDate(unixSeconds) {
      return unixSeconds ? dayjs.unix(unixSeconds).format('DD-MM-YYYY') : ''
    },
    startDeleteWorksheet(e, id = this.worksheetId) {
      this.$Modal.confirm({
        title: 'Удаление анкеты',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить анкету: id${id} ?</p>`,
        onOk: () => {
          this.deleteWorksheet(id)
        },
      })
    },
    async deleteWorksheet(id) {
      try {
        await deleteEventRegistration(id)
        this.$Message.success('Анкета успешно удалена')
        this.$router.push({ path: '/worksheets/list' })
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },
    async saveComment() {
      this.load = true
      this.commentVisible = false
      try {
        const {
          data: { comment },
        } = await updateRegistration(this.worksheetId, { comment: this.comment })
        this.registration.comment = comment
        this.$Message.success('Комментарий успешно сохранен!')
        this.commentVisible = false
        this.load = false
      } catch (e) {
        this.$Message.error('В процессе удаления произошла ошибка!')
        this.load = false
        throw new Error(e)
      }
    },
    async updateRegistration(redirect) {
      this.load = true
      try {
        await updateRegistration(this.worksheetId, this.registration)
        if (redirect) {
          await this.$router.push({ path: `/worksheets/list` })
        }
        this.load = false
      } catch (e) {
        this.load = false
        console.error(e)
      }
    },
  },
}
</script>
