<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание страницы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/static-pages/list')">
          Назад
        </Button>
      </i-col>
    </Row>
    <Card style="margin-bottom: 15px">
      <Form ref="pageCreate" :model="formModel" :rules="formRules" label-position="top">
        <Row type="flex" :gutter="24">
          <i-col span="8">
            <FormItem prop="eventId" label="Мероприятие">
              <Select
                v-model="formModel.eventId"
                placeholder="Тех название мероприятия"
                filterable
                remote
                :loading="loading"
                :remote-method="debounce(remoteEventSearch, 800)"
                not-found-text="Ничего не найдено"
              >
                <Option v-for="e in events" :key="e.id" :value="e.id">
                  {{ e.technicalName }}
                </Option>
              </Select>
            </FormItem>
          </i-col>
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
                <Option value="ru"> RU </Option>
                <Option value="en"> EN </Option>
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
              <VueArticle v-model="formModel.content.html" :config="editorConfig" />
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
    </Card>
    <SavePanel @save="createPage('save')" @apply="createPage('accept')" />
  </div>
</template>

<script>
import VueArticle from '@s256/article-editor'
import editorConfig from '@/config/editor-config'
import { getEvents } from '@/api/event'
import { createStaticPage } from '@/api/staticPages'
import { debounce, covertStrDateToISO } from '@/libs/util'
import { validateDateTime } from '@/libs/validators'
import SavePanel from '@/components/save-panel/save-panel'

const dateRules = [
  {
    validator: validateDateTime,
    message: 'Дата должна иметь формат: 12-01-2020 18:00',
    trigger: 'blur',
    // required: true,
  },
]

const DATE_FIELD_NAMES = ['autoActiveStartedAt', 'autoActiveEndedAt']

export default {
  components: { VueArticle, SavePanel },
  data() {
    return {
      events: [],
      formModel: {
        eventId: null,
        title: '',
        lang: 'ru',
        content: {
          html: '<p></p>',
        },
        sort: 0,
        active: false,
        autoActiveStartedAt: '',
        autoActiveEndedAt: '',
      },
      formRules: {
        eventId: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        title: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        lang: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        active: [{ required: true }],
        autoActiveStartedAt: [...dateRules],
        autoActiveEndedAt: [...dateRules],
      },
      loading: false,
      editorConfig,
    }
  },
  created() {},
  methods: {
    debounce(fn, time) {
      return debounce(fn, time)
    },
    async createPage(action) {
      const isFormValid = await this.$refs['pageCreate'].validate()

      if (isFormValid) {
        const formData = covertStrDateToISO(this.formModel, DATE_FIELD_NAMES)
        const {
          data: { id },
        } = await createStaticPage(formData)

        if (action === 'accept') {
          await this.$router.push('/static-pages/edit/' + id)
        }
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
        this.loading = true
        const { data: eventsData } = await getEvents(params)
        this.loading = false
        this.events = eventsData
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    remoteEventSearch(query) {
      const trimmedQuery = query.trim()
      if (trimmedQuery !== '') {
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
</style>
