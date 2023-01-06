<!--компонент является хорошим примером проблем с приложением в админке -
сущности в кучу, черт пойми что с языками, дублирование кода-->
<template>
  <div class="content-info">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${$route.params.id}`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <Row type="flex">
      <Tabs v-model="tab" :animated="false" class="tabs" @on-click="changeFormLang()">
        <TabPane label="RU"></TabPane>
        <TabPane label="EN"></TabPane>
      </Tabs>
    </Row>

    <Row v-show="!event.formLink" type="flex" class-name="content-info-form">
      <i-col span="24">
        <Card>
          <h3 class="content-info-form__title" style="margin-bottom: 15px">
            Контентная информация
          </h3>
          <Form ref="createFormLink" :model="formLink" :rules="formLinkRules" label-position="top">
            <FormItem label="Форма регистрации" prop="formId">
              <Row type="flex" :gutter="15">
                <i-col :lg="18" :md="24" :sm="24" class-name="content-info-form__item">
                  <Select v-model="formLink.formId" placeholder="Выберите форму регистрации">
                    <Option v-for="form in allForms" :key="form.id" :value="form.id">
                      {{ form.name }}
                    </Option>
                  </Select>
                </i-col>
                <i-col :lg="6" :md="24" :sm="24" class-name="content-info-form__item">
                  <Button long @click="createFormLink()"> Применить </Button>
                </i-col>
              </Row>
            </FormItem>
          </Form>
        </Card>
      </i-col>
    </Row>

    <Row v-if="event.formLink" type="flex" class-name="content-info-form">
      <i-col span="24">
        <Card>
          <h3 class="content-info-form__title" style="margin-bottom: 15px">
            Контентная информация
          </h3>
          <Form ref="contentInfo" :model="event" :rules="formRules" label-position="top">
            <Row type="flex" :gutter="15">
              <i-col :lg="12" :md="24" :sm="24">
                <FormItem
                  class="content-info-form__item"
                  label="Название мероприятия"
                  prop="displayName"
                >
                  <Input v-model="event.displayName" placeholder="Введите название мероприятия" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem class="content-info-form__item" label="Телефон" prop="phoneNumber">
                  <Input v-model="event.phoneNumber" placeholder="Введите телефон" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem class="content-info-form__item" label="Добавочный номер" prop="phoneInfo">
                  <Input v-model="event.phoneExtension" placeholder="Добавочный номер" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem class="content-info-form__item" label="Email" prop="email">
                  <Input v-model="event.email" placeholder="Введите email" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem
                  class="content-info-form__item"
                  label="Ссылка к мероприятию"
                  prop="formLink.logoLink"
                >
                  <Input v-model="event.formLink.externalUrl" placeholder="Ссылка к мероприятию" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem
                  class="content-info-form__item"
                  label="Текст под телефоном"
                  prop="phoneText"
                >
                  <Input v-model="event.phoneInfo" placeholder="Введите текст под телефоном" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem class="content-info-form__item" label="Место проведения" prop="location">
                  <Input v-model="event.location" placeholder="Введите место проведения" />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem
                  class="content-info-form__item"
                  label="Логотип мероприятия"
                  prop="formLink.logo[0]"
                >
                  <Uploader
                    v-model="event.formLink.logo[0]"
                    desc="Загрузите логотип мероприятия: .svg .png .jpg .gif"
                    type="drag"
                  />
                </FormItem>
              </i-col>

              <i-col :lg="6" :md="24" :sm="24">
                <FormItem class="content-info-form__item" label="Стартовая страница" prop="page">
                  <Select
                    v-model="startedPageId"
                    filterable
                    not-found-text="Ничего не найдено"
                    clearable
                  >
                    <Option v-for="page in event.pages" :key="page.id" :value="page.id">
                      {{ page.title }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>

            <FormItem label="Форма регистрации" prop="formLink.formId">
              <Row type="flex" :gutter="15">
                <i-col :lg="18" :md="24" :sm="24" class-name="content-info-form__item">
                  <Select
                    v-model="event.formLink.formId"
                    placeholder="Выберите форму регистрации"
                    filterable
                    not-found-text="Ничего не найдено"
                    @on-select="cleanLocal"
                  >
                    <Option v-for="form in allForms" :key="form.id" :value="form.id">
                      {{ form.name }}
                    </Option>
                  </Select>
                </i-col>
                <i-col :lg="6" :md="24" :sm="24" class-name="content-info-form__item">
                  <Button long :disabled="isSelectedFormLocal" @click="customize">
                    Кастомизировать
                  </Button>
                </i-col>
              </Row>
            </FormItem>
          </Form>

          <Spin v-if="load" fix></Spin>
        </Card>

        <Row type="flex" justify="end" style="margin-top: 15px" :gutter="15">
          <i-col :lg="3" :sm="6" class-name="content-info-form-actions">
            <Button
              :disabled="load"
              class="content-info-form-actions__btn"
              long
              @click="submitForm('contentInfo', 'accept')"
            >
              Применить
            </Button>
          </i-col>
          <i-col :lg="3" :sm="6" class-name="content-info-form-actions">
            <Button
              :disabled="load"
              type="primary"
              class="content-info-form-actions__btn"
              long
              @click="submitForm('contentInfo', 'save')"
            >
              Сохранить
            </Button>
          </i-col>
        </Row>
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
      :lang="lang"
      @sort-asc="sortAsc"
      @sort-desc="sortDesc"
      @on-save="makeLocalField($event)"
    />
  </div>
</template>

<script>
import LocalFieldModal from '@/components/make-local-modal'
import FormConstructor from '@/components/form-constructor'
import Uploader from '@/components/Uploader'
import initFormConstructor from '@/view/pages/_mixins/init-form-constructor'

import { getEvent, updateEvent, updateEventFormLink, createEventFormLink } from '@/api/event'
import { getEventPages, updateStartedEventPage } from '@/api/event-page'

import {
  getForms,
  createForm,
  createField,
  updateField,
  createValue,
  updateValue,
  updateFormLink,
} from '@/api/forms'

export default {
  components: {
    Uploader,
    FormConstructor,
    LocalFieldModal,
  },
  mixins: [initFormConstructor],
  data() {
    return {
      tab: 0,
      event: {
        pages: [],
      },
      availableLangs: ['ru', 'en'],
      load: false,
      allForms: [],
      formLink: {
        formId: null,
        externalUrl: null,
        logo: [null],
        eventId: null,
      },
      startedPageId: null,
      formLinkRules: {
        formId: [{ required: true, message: 'Это поле обязательно!' }],
      },
      formRules: {
        formLink: {
          formId: [{ required: true, message: 'Это поле обязательно!' }],
        },
        phoneNumber: [{ required: true, message: 'Это поле обязательно!' }],
      },
      localFieldModal: false,
      currentLocalField: {},
    }
  },
  computed: {
    lang() {
      return this.availableLangs[this.tab]
    },
    eventId() {
      return this.$route.params.id
    },
    isSelectedFormLocal() {
      if (this.event.formLink) {
        const { formId = null } = this.event.formLink
        const form = this.allForms.find((f) => +f.id === +formId)

        if (form) {
          return form.location === 'local'
        }

        return false
      }
      return false
    },
  },
  created() {
    this.init()
  },
  methods: {
    async submitForm(ref, action) {
      const valid = await this.$refs[ref].validate()

      if (!this.isFormHasFIO(this.formModel.form)) {
        this.$Message.error('Необходимо добавить поля с тегами "Имя", "Фамилия", "Отчество"')
        return
      }

      const eventData = {
        ...this.event,
        phone: {
          info: this.event.phoneInfo || '',
          number: this.event.phoneNumber || '',
          extension: this.event.phoneExtension || '',
        },
      }

      delete eventData.phoneInfo
      delete eventData.phoneNumber
      delete eventData.phoneExtension

      if (valid) {
        await Promise.all([
          updateEvent(this.eventId, eventData, { lang: this.lang }),
          updateEventFormLink(this.event.formLink.id, this.event.formLink, { lang: this.lang }),
          this.saveStartedPage(this.startedPageId),
          this.isSelectedFormLocal && this.saveForm(this.formModel.form.groups),
        ])

        if (action === 'save') {
          await this.$router.push(`/events/edit/${this.eventId}`)
        } else {
          await this.init()
        }
      }
    },
    async removeStartedPage() {
      const startedPage = this.event.pages.find((p) => p.isStarted === true)
      try {
        startedPage &&
          (await updateStartedEventPage({ eventPageId: startedPage.id, isStarted: false }))
      } catch (e) {
        console.error(e)
      }
    },
    async saveStartedPage(selectedPageId) {
      try {
        selectedPageId
          ? await updateStartedEventPage({ eventPageId: selectedPageId, isStarted: true })
          : await this.removeStartedPage()
      } catch (e) {
        console.error(e)
      }
    },
    async changeFormLang() {
      await this.init()
    },
    async init() {
      this.event = {
        pages: [],
      }
      this.allForms = []

      await this.getEvent(this.eventId, this.lang)
      await this.getEventPages(this.eventId, this.lang)
      await this.getAllForms()
    },
    async getAllForms() {
      const params = {
        'per-page': 0,
        // include: 'fields',
        filter: { type: 'registration' },
      }

      if (this.event.formLink) {
        const { formId: currentFormId } = this.event.formLink
        const { data: allForms } = await getForms(params)

        this.allForms = allForms.filter(
          (form) => form.location === 'global' || form.id === currentFormId
        )
      } else {
        const { data: allForms } = await getForms({
          ...params,
          filter: { ...params.filter, location: 'global' },
        })
        this.allForms = allForms
      }
    },
    async getEvent(id, lang) {
      const params = { include: 'form-link', lang }

      const { data: eventData } = await getEvent(id, params)

      if (eventData.phone) {
        const { info, number, extension } = eventData.phone
        Object.assign(eventData, {
          phoneInfo: info,
          phoneNumber: number,
          phoneExtension: extension,
        })
        delete eventData.phone
      }
      this.event = eventData

      if (this.event.formLink) {
        await this.setupFormConstructor(this.event.formLink.formId)
      }
    },
    async getEventPages(id, lang) {
      const params = {
        'per-page': 0,
        filter: {
          lang,
          eventId: id,
          active: true,
        },
      }

      try {
        const { data: eventPages } = await getEventPages(params)
        const startedPageId = eventPages.find((p) => p.isStarted === true)
        this.startedPageId = startedPageId?.id || null
        this.event.pages = eventPages
      } catch (e) {
        console.error(e)
      }
    },
    async customize() {
      const { formId: currentFormId, id: eventLinkId } = this.event.formLink
      const { name, type } = this.allForms.find((f) => f.id === currentFormId)

      const { data: createdForm } = await createForm({
        type,
        active: true,
        name: `${name} - Локальная`,
        location: 'local',
      })

      await this.copyForm(createdForm.id, this.formModel.form.groups)

      const { data: updatedEventLink } = await updateEventFormLink(eventLinkId, {
        formId: createdForm.id,
        eventId: this.eventId,
      })

      this.event.formLink = updatedEventLink

      await this.init()
    },
    cleanLocal() {
      this.submitForm('contentInfo', 'accept')
    },
    async createFormLink() {
      const valid = await this.$refs['createFormLink'].validate()

      if (valid) {
        await createEventFormLink({ ...this.formLink, eventId: this.eventId }, { lang: this.lang })
        await this.init()
      }
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
        } = await createField({ ...field, location: 'local' }, { lang: this.lang })
        await updateFormLink(
          formLink.id,
          { formId: this.formModel.form.id, fieldId: localFieldId },
          { lang: this.lang }
        )

        if (values) {
          const newValues = values.map((v) =>
            createValue({ ...v, fieldId: localFieldId }, { lang: this.lang })
          )
          await Promise.all(newValues)
        }
      }

      if (location === 'local') {
        await updateField(field.id, { ...field }, { lang: this.lang })
        await updateFormLink(
          formLink.id,
          { formId: this.formModel.form.id, fieldId: field.id },
          { lang: this.lang }
        )

        if (values) {
          const newValues = values.map((v) =>
            v.id ? updateValue(v.id, v, { lang: this.lang }) : createValue(v, { lang: this.lang })
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
    isFormHasFIO({ groups }) {
      const tagsOnForm = groups.map((g) => g.fields.map((f) => f.tag)).flat()

      return (
        tagsOnForm.includes('first_name') &&
        tagsOnForm.includes('last_name') &&
        tagsOnForm.includes('middle_name')
      )
    },
  },
}
</script>

<style lang="less">
@import './ContentInfo.less';
</style>
