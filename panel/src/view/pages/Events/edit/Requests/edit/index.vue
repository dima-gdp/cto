<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование материала</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${$route.params.id}/requests`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <div class="content-info">
      <!-- Main Form -->
      <Row type="flex" class-name="request-edit-form">
        <i-col span="24">
          <Card>
            <Row
              type="flex"
              justify="space-between"
              class-name="request-edit-form__title"
              style="margin-bottom: 15px"
            >
              <h3>Редактирование материала</h3>
              <Button type="error" size="small" ghost @click="deleteRequest">
                <Icon type="ios-trash-outline" />
              </Button>
            </Row>

            <!-- Form -->
            <Form ref="requestEditForm" :model="form" :rules="formRules" label-position="top">
              <Row type="flex" :gutter="15">
                <i-col span="24">
                  <FormItem
                    class="request-edit-form__item"
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
                    class="request-edit-form__item"
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
                  <FormItem class="org-form__item" label="Дата начала приема" prop="dateStart">
                    <Input
                      v-model="form.dateStart"
                      v-mask="'##-##-#### ##:##'"
                      type="text"
                      placeholder="Введите дату начала приема"
                      style="width: 100%; text-align: center !important"
                    />
                  </FormItem>
                </i-col>

                <i-col :lg="8" :md="24" :sm="24">
                  <FormItem class="org-form__item" label="Дата окончания приема" prop="dateEnd">
                    <Input
                      v-model="form.dateEnd"
                      v-mask="'##-##-#### ##:##'"
                      type="text"
                      placeholder="Введите дату окончания приема"
                      style="width: 100%; text-align: center !important"
                    />
                  </FormItem>
                </i-col>

                <i-col span="24">
                  <FormItem class="request-edit-form__item" label="Форма для приёма" prop="formId">
                    <Row type="flex" :gutter="15">
                      <i-col :lg="18" :md="24" :sm="24">
                        <Select
                          v-model="form.formId"
                          placeholder="Выберите форму для материалов"
                          filterable
                          not-found-text="Ничего не найдено"
                          @on-change="cleanLocal"
                        >
                          <Option v-for="item in allForms" :key="item.id" :value="item.id">
                            {{ item.name }}
                          </Option>
                        </Select>
                      </i-col>
                      <i-col :lg="6" :md="24" :sm="24">
                        <Button long @click="customize"> Кастомизировать </Button>
                      </i-col>
                    </Row>
                  </FormItem>
                </i-col>

                <i-col :lg="24" :md="24" :sm="24">
                  <FormItem
                    class="request-edit-form__item"
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
      <Row
        type="flex"
        justify="end"
        class-name="request-edit-form-actions"
        :gutter="15"
        style="margin-top: 15px"
      >
        <i-col :lg="3" :sm="6" class-name="request-edit-form-actions__item">
          <Button
            :disabled="load"
            class="request-edit-form-actions__btn"
            long
            @click="submitForm('requestEditForm', 'accept')"
          >
            Применить
          </Button>
        </i-col>
        <i-col :lg="3" :sm="6" class-name="request-edit-form-actions__item">
          <Button
            :disabled="load"
            type="primary"
            class="request-edit-form-actions__btn"
            long
            @click="submitForm('requestEditForm', 'save')"
          >
            Сохранить
          </Button>
        </i-col>
      </Row>

      <Row v-if="isSelectedFormLocal" type="flex" style="margin-top: 15px" :gutter="15">
        <i-col span="24">
          <Card>
            <FormConstructor
              v-model="formModel.form.groups"
              :form="formModel.form"
              :all-fields="formModel.allFields"
              :remote-methods="formModel.remoteMethods"
              :loading="load"
              :is-local="true"
              @make-local="showLocal"
            />
          </Card>
        </i-col>
      </Row>

      <LocalFieldModal
        v-model="localFieldModal"
        :field="currentLocalField"
        :lang="form.lang"
        @on-save="makeLocalField($event)"
        @sort-asc="sortAsc"
        @sort-desc="sortDesc"
      />
    </div>
  </div>
</template>

<script>
import LocalFieldModal from '_c/make-local-modal'
import MarkdownEditor from '_c/markdown'
import FormConstructor from '_c/form-constructor'
import initFormConstructor from '@/view/pages/_mixins/init-form-constructor'
import { requestCategories } from '../requestCategories'
import { fromISOToString, fromStringToISO } from '@/libs/util'

import { updateRequest, getCurrentRequest, deleteRequest } from '@/api/requests'

import {
  getForms,
  createForm,
  createField,
  updateField,
  createValue,
  updateValue,
  updateFormLink,
} from '@/api/forms'
import { validateDateTime } from '@/libs/validators'

export default {
  components: {
    FormConstructor,
    MarkdownEditor,
    LocalFieldModal,
  },
  mixins: [initFormConstructor],
  data() {
    return {
      form: {
        name: '',
        category: '',
        active: true,
        formId: '',
        description: '',
        sendingLimit: 0,
        userSendingLimit: 0,
        dateStart: '',
        dateEnd: '',
      },
      requestCategories,
      load: false,
      allForms: [],
      request: null,
      formsLoad: false,
      localFieldModal: false,
      currentLocalField: {},
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
    requestId() {
      return this.$route.params.request_id
    },
    isSelectedFormLocal() {
      if (this.form) {
        const { formId } = this.form
        const form = this.allForms.find((f) => +f.id === +formId)

        if (form) {
          return form.location === 'local'
        }

        return false
      }
      return false
    },
    formRules() {
      return {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        category: [{ required: true, message: 'Это поле обязательно!' }],
        dateStart: [
          { required: true, message: 'Это поле обязательно!', trigger: 'blur' },
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
      }
    },
  },
  async created() {
    await this.init()
  },
  methods: {
    fromISOToString,
    fromStringToISO,
    async deleteRequest() {
      await deleteRequest(this.requestId).then(() => {
        this.$Message.success('Материал удален!')
      })

      await this.$router.push(`/events/edit/${this.eventId}/requests`)
    },
    async submitForm(ref, action) {
      const valid = await this.$refs[ref].validate()

      if (valid) {
        const form = this.form

        // Конвертируем даты в ISO
        form.startedAt = this.fromStringToISO(this.form.dateStart)
        form.endedAt = this.fromStringToISO(this.form.dateEnd)

        await Promise.all([
          updateRequest(this.requestId, form, { lang: this.lang }),
          this.formModel.form.groups && this.saveForm(this.formModel.form.groups),
        ])
        await this.init()
      }

      if (action === 'save') {
        await this.$router.push(`/events/edit/${this.eventId}/requests`)
      }
    },
    async getCurrentRequest() {
      const { data: requestData } = await getCurrentRequest(this.requestId)

      this.form = requestData

      // Конвертируем даты из ISO
      this.$set(this.form, 'dateStart', this.fromISOToString(this.form.startedAt))
      this.$set(this.form, 'dateEnd', this.fromISOToString(this.form.endedAt))

      this.form.formId && (await this.setupFormConstructor(this.form.formId))
    },
    async getForms() {
      const params = {
        filter: { type: 'request' },
        'per-page': 0,
      }

      const { data: formsData } = await getForms(params)
      const { formId } = this.form

      // Получить список только глобальных форм, добавив уже выбранную локальную форму, если она есть
      this.allForms = formsData.filter((form) => form.location === 'global' || +form.id === +formId)
    },
    toStamp(maskedString) {
      return this.$luxon.DateTime.fromFormat(maskedString, 'dd-MM-yyyy HH:mm').toSeconds()
    },
    async init() {
      await this.getCurrentRequest()
      await this.getForms()
    },
    async customize() {
      const { formId: currentFormId, id: requestId } = this.form
      const { name, type } = this.allForms.find((f) => f.id === currentFormId)

      const { data: createdForm } = await createForm({
        type,
        active: true,
        name: `${name} - Локальная`,
        location: 'local',
      })

      await this.copyForm(createdForm.id, this.formModel.form.groups)

      const { data: updatedRequest } = await updateRequest(requestId, {
        formId: createdForm.id,
        entityId: this.eventId,
      })

      this.form = updatedRequest

      await this.init()
    },
    cleanLocal() {
      this.submitForm('requestEditForm', 'accept')
    },
    showLocal(field) {
      this.currentLocalField = field

      if (Array.isArray(field.values)) {
        this.currentLocalField.values = field.values.sort((a, b) => {
          if (a.sort < b.sort) {
            return -1
          }
          if (a.sort > b.sort) {
            return 1
          }
          return 0
        })
      }

      this.localFieldModal = true
    },
    async makeLocalField(field) {
      const { location, values, formLink } = field
      if (location === 'global') {
        const {
          data: { id: localFieldId },
        } = await createField({ ...field, location: 'local' }, { lang: this.form.lang })
        await updateFormLink(
          formLink.id,
          { formId: this.formModel.form.id, fieldId: localFieldId },
          { lang: this.form.lang }
        )

        if (values) {
          const newValues = values.map((v) =>
            createValue({ ...v, fieldId: localFieldId }, { lang: this.form.lang })
          )
          await Promise.all(newValues)
        }
      }

      if (location === 'local') {
        await updateField(field.id, { ...field }, { lang: this.form.lang })
        await updateFormLink(
          formLink.id,
          { formId: this.formModel.form.id, fieldId: field.id },
          { lang: this.form.lang }
        )

        if (values) {
          const newValues = values.map((v) =>
            v.id
              ? updateValue(v.id, v, { lang: this.form.lang })
              : createValue(v, { lang: this.form.lang })
          )
          await Promise.all(newValues)
        }
      }

      await this.init()
    },
    sortAsc() {
      console.info('asc')
      if (this.currentLocalField.values) {
        this.currentLocalField.values = this.currentLocalField.values.sort((a, b) => {
          if (a.value.toLowerCase() < b.value.toLowerCase()) {
            return -1
          }
          if (a.value.toLowerCase() > b.value.toLowerCase()) {
            return 1
          }
          return 0
        })
      }
    },
    sortDesc() {
      console.info('desc')
      if (this.currentLocalField.values) {
        this.currentLocalField.values = this.currentLocalField.values.sort((a, b) => {
          if (a.value.toLowerCase() > b.value.toLowerCase()) {
            return -1
          }
          if (a.value.toLowerCase() < b.value.toLowerCase()) {
            return 1
          }
          return 0
        })
      }
    },
  },
}
</script>

<style></style>
