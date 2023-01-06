<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование страницы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/static-pages/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <Card style="margin-bottom: 15px">
      <div class="current-event">
        <span class="current-event__name">Мероприятие: {{ initialEvent.technicalName }}</span>
        <Button type="primary" @click="isShowSelect = true">Изменить</Button>
      </div>
      <Form ref="pageUpdate" :model="formModel" :rules="formRules" label-position="top">
        <Row type="flex" :gutter="24">
          <transition name="fade">
            <i-col v-if="isShowSelect" span="8">
              <FormItem prop="selectEventId" label="Мероприятие">
                <Select
                  v-model="formModel.selectEventId"
                  placeholder="Тех название мероприятия"
                  filterable
                  remote
                  :loading="selectLoading"
                  :remote-method="debounce(remoteEventSearch, 800)"
                  not-found-text="Ничего не найдено"
                >
                  <Option v-for="e in events" :key="e.id" :value="e.id">
                    {{ e.technicalName }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </transition>
          <i-col>
            <FormItem class="org-form__item" label="Активность" prop="active">
              <i-switch v-model="formModel.active" />
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="24" type="flex" align="middle">
          <i-col span="16">
            <FormItem prop="title" label="Название страницы">
              <Input v-model="formModel.title" />
            </FormItem>
          </i-col>
          <i-col span="3">
            <FormItem prop="lang" style="margin-bottom: 0">
              <Select v-model="formModel.lang">
                <Option value="ru"> RU</Option>
                <Option value="en"> EN</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem prop="sort" label="Сортировка">
              <InputNumber v-model="formModel.sort" />
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col>
            <FormItem prop="content" label="Контент">
              <VueArticle
                v-if="formModel.content.html"
                v-model="formModel.content.html"
                :config="editorConfig"
              />
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="8">
            <FormItem label="Дата начала публикации" prop="autoActiveStartedAt">
              <Input
                v-model="formModel.autoActiveStartedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату начала публикации"
              />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="Дата завершения публикации" prop="autoActiveEndedAt">
              <Input
                v-model="formModel.autoActiveEndedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату окончания публикации"
              />
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Spin v-if="loading" fix />
    </Card>
    <SavePanel @save="updatePage('save')" @apply="updatePage('accept')" />
  </div>
</template>

<script>
import VueArticle from '@s256/article-editor'
import editorConfig from '@/config/editor-config'
import { getEvents, getEvent } from '@/api/event'
import { updateStaticPage, getOneStaticPage } from '@/api/staticPages'
import { debounce, convertISOToStrDate, covertStrDateToISO } from '@/libs/util'
import { validateDateTime } from '@/libs/validators'
import SavePanel from '@/components/save-panel/save-panel'

const dateRules = [
  {
    validator: validateDateTime,
    message: 'Дата должна иметь формат: 12-01-2020 18:00',
    trigger: 'blur',
  },
]

const DATE_FIELD_NAMES = ['autoActiveStartedAt', 'autoActiveEndedAt']

export default {
  components: { VueArticle, SavePanel },
  data() {
    return {
      events: [],
      initialEvent: {
        technicalName: '',
      },
      selectEventId: null,
      formModel: {
        eventId: null,
        selectEventId: null,
        title: '',
        lang: 'ru',
        content: { html: '' },
        sort: 0,
        active: null,
      },
      formRules: {
        selectEventId: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        title: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        lang: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        active: [{ required: true }],
        autoActiveStartedAt: [...dateRules],
        autoActiveEndedAt: [...dateRules],
      },
      loading: false,
      selectLoading: false,
      isShowSelect: false,
      editorConfig,
    }
  },
  computed: {
    pageId() {
      return this.$route.params.id
    },
  },
  async mounted() {
    this.loading = true
    await this.init()
    await this.getCurrentEvent(this.formModel.eventId)
    this.loading = false
  },
  methods: {
    async init() {
      const { data } = await getOneStaticPage(this.pageId)
      this.formModel = {
        ...this.formModel,
        ...convertISOToStrDate(data, DATE_FIELD_NAMES),
      }
    },
    async updatePage(action) {
      const isFormValid = await this.$refs['pageUpdate'].validate()

      if (isFormValid) {
        this.loading = true
        if (this.formModel.selectEventId) {
          this.formModel.eventId = this.formModel.selectEventId
        }
        const formData = covertStrDateToISO(this.formModel, DATE_FIELD_NAMES)
        await updateStaticPage(this.pageId, formData)
        this.loading = false
        if (action === 'save') {
          await this.$router.push('/static-pages/list')
        }
      }
    },

    async getEvents(query) {
      try {
        const params = {
          'per-page': 0,
          fields: {
            event: ['id', 'technical-name'],
          },
          filter: [
            {
              'technical-name': {
                ilike: query,
              },
            },
          ],
        }
        this.selectLoading = true
        const { data: eventsData } = await getEvents(params)
        this.selectLoading = false
        this.events = eventsData
      } catch (e) {
        this.selectLoading = false
        throw new Error(e)
      }
    },
    async getCurrentEvent(id) {
      const params = {
        fields: {
          event: ['technical-name'],
        },
      }
      const { data: initialEvent } = await getEvent(id, params)
      this.initialEvent = initialEvent
    },
    debounce(fn, time) {
      return debounce(fn, time)
    },
    remoteEventSearch(query) {
      const trimmedQuery = query.trim()
      if (trimmedQuery.length > 1) {
        this.getEvents(trimmedQuery)
      }
    },
  },
}
</script>

<style lang="less">
.editor-wrap {
  border-radius: 4px;
  border: 1px solid #dcdee2;
  padding: 20px 0 0 0;
}

.current-event {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &__name {
    margin-right: 20px;
  }
}
</style>
