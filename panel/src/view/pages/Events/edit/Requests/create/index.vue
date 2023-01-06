<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание материала</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${eventId}/requests`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <div>
      <!-- Form header -->
      <Row type="flex" class-name="request-create-form-header">
        <i-col>
          <Tabs v-model="tab" :animated="false" class="request-create-form-header__item">
            <TabPane
              v-for="locale in availableLangs"
              :key="locale"
              :label="locale.toUpperCase()"
              :disabled="load"
            ></TabPane>
          </Tabs>
        </i-col>
      </Row>

      <!-- Main Form -->
      <Row type="flex" class-name="request-create-form">
        <i-col span="24">
          <Card>
            <Row type="flex" justify="space-between" class-name="request-create-form__title">
              <h3>Создание материала</h3>
            </Row>

            <!-- Form -->
            <Form ref="requestCreateForm" :model="form" :rules="formRules" label-position="top">
              <Row type="flex" :gutter="15">
                <i-col span="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Название в пользовательской части"
                    prop="name"
                  >
                    <Input
                      v-model="form.name"
                      placeholder="Введите название выводимое в кабинете пользователя"
                    />
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Укажите категорию материала"
                    prop="category"
                  >
                    <Select v-model="form.category" placeholder="Выберите категорию материала">
                      <Option
                        v-for="(item, index) in requestCategories"
                        :key="index"
                        :value="item.value"
                      >
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem
                    class="request-edit-form__item"
                    label="Ограничение общего количества"
                    prop="sendingLimit"
                  >
                    <Input v-model="form.sendingLimit" placeholder="введите число" type="number" />
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Лимит подачи на 1 человека"
                    prop="userSendingLimit"
                  >
                    <Input
                      v-model="form.userSendingLimit"
                      placeholder="введите число"
                      type="number"
                    />
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Дата начала приема"
                    prop="dateStart"
                  >
                    <Input
                      v-model="form.dateStart"
                      v-mask="dateMask"
                      type="text"
                      placeholder="Введите дату начала приема"
                    />
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Дата окончания приема"
                    prop="dateEnd"
                  >
                    <Input
                      v-model="form.dateEnd"
                      v-mask="dateMask"
                      type="text"
                      placeholder="Введите дату окончания приема"
                    />
                  </FormItem>
                </i-col>

                <i-col span="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Форма для приёма"
                    prop="formId"
                  >
                    <Select
                      v-model="form.formId"
                      placeholder="Выберите форму для материалов"
                      filterable
                      not-found-text="Ничего не найдено"
                    >
                      <Option v-for="item in allForms" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                </i-col>

                <i-col :lg="24" :md="24" :sm="24">
                  <FormItem
                    class="request-create-form__item"
                    label="Контентная часть"
                    prop="description"
                  >
                    <MarkdownEditor v-model="form.description" autoinit />
                  </FormItem>
                </i-col>
              </Row>
            </Form>

            <Spin v-if="load" fix></Spin>
          </Card>
        </i-col>
      </Row>
      <!-- Actions -->
      <Row type="flex" justify="end" style="margin-top: 15px" :gutter="15">
        <i-col :lg="3" :sm="6" class-name="request-create-form-actions">
          <Button
            :disabled="load"
            class="request-create-form-actions__btn"
            long
            @click="createRequest('accept')"
          >
            Применить
          </Button>
        </i-col>
        <i-col :lg="3" :sm="6" class-name="request-create-form-actions">
          <Button
            :disabled="load"
            type="primary"
            class="request-create-form-actions__btn"
            long
            @click="createRequest('save')"
          >
            Сохранить
          </Button>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import MarkdownEditor from '_c/markdown'
import { createRequest } from '@/api/requests'
import { getForms } from '@/api/forms'
import { requestCategories } from '../requestCategories'
import { fromStringToISO } from '@/libs/util'
import { validateDateTime } from '@/libs/validators'

export default {
  components: {
    MarkdownEditor,
  },
  data() {
    return {
      dateMask: '##-##-#### ##:##',
      tab: 0,
      load: false,
      allForms: [],
      form: {
        name: '',
        category: null,
        dateStart: '',
        dateEnd: '',
        active: true,
        formId: '',
        description: '',
        entity: 'event',
        entityId: '',
        sendingLimit: 0,
        userSendingLimit: 0,
      },
      availableLangs: ['ru', 'en'],
      requestCategories,
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        category: [{ required: true, message: 'Это поле обязательно!' }],
        dateStart: [
          { required: true, message: 'Это поле обязательно!' },
          {
            validator: validateDateTime,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        dateEnd: [
          { required: true, message: 'Это поле обязательно!' },
          {
            validator: validateDateTime,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        formId: [{ required: true, message: 'Это поле обязательно!' }],
      },
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
    lang() {
      return this.availableLangs[this.tab]
    },
  },

  watch: {
    tab() {
      this.clearForm()
    },
  },
  created() {
    this.getForms()
  },

  methods: {
    fromStringToISO,
    clearForm() {
      this.form = {
        name: '',
        category: null,
        dateStart: '',
        dateEnd: '',
        active: true,
        formId: '',
        description: '',
        entity: 'event',
        entityId: this.eventId,
        sendingLimit: 0,
        userSendingLimit: 0,
      }
    },
    async createRequest(action) {
      this.load = true
      const valid = await this.$refs['requestCreateForm'].validate()

      if (valid) {
        const data = this.form

        // Конвертируем даты в ISO
        data.startedAt = this.fromStringToISO(this.form.dateStart)
        data.endedAt = this.fromStringToISO(this.form.dateEnd)

        const params = { lang: this.lang }
        const { data: createdRequest } = await createRequest(
          { ...data, entityId: this.eventId },
          params
        )
        this.$Message.success('Материал успешно создан')

        if (action === 'save') {
          await this.$router.push({ path: `/events/edit/${this.eventId}/requests` })
        }

        if (action === 'accept') {
          await this.$router.push({
            path: `/events/edit/${this.eventId}/requests/edit/${createdRequest.id}`,
          })
        }
      }

      this.load = false
    },
    async getForms() {
      const params = {
        filter: { type: 'request', location: 'global' },
        'per-page': 0,
      }

      const { data: formsData } = await getForms(params)
      this.allForms = formsData
    },
    toStamp(maskedString) {
      return this.$luxon.DateTime.fromFormat(maskedString, 'dd-MM-yyyy HH:mm').toSeconds()
    },
    formatDate(data) {
      const formattedData = { ...data }
      formattedData.settings = {}
      for (const key in formattedData) {
        switch (key) {
          case 'dateStart':
            formattedData.settings['startedAt'] = this.toStamp(formattedData[key])
            break
          case 'dateEnd':
            formattedData.settings['endedAt'] = this.toStamp(formattedData[key])
            break
          default:
            break
        }
      }

      return formattedData
    },
  },
}
</script>

<style></style>
