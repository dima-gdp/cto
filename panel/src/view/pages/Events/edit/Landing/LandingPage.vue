<template>
  <div>
    <Row
      v-if="role !== $options.ROLES.manager"
      class="page-event-menu__header"
      type="flex"
      justify="center"
      align="middle"
      class-name="view-header"
    >
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Настройка лендинга</span>
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
    <Spin v-if="isLoading" fix />
    <div v-else class="landing-page">
      <RadioGroup v-model="lang" type="button" button-style="solid" class="landing-page__lang">
        <Radio :label="$options.LANGUAGES.ru"></Radio>
        <Radio :label="$options.LANGUAGES.en"></Radio>
      </RadioGroup>
      <div class="landing-page__btn-wrapper">
        <Button @click="onClickLoadTemplates"> Загрузить шаблон </Button>
      </div>
      <div>
        <LandingEditor :code="code" :style-link-url="styleLinkUrl" @save="onSave" />
      </div>
    </div>
    <Modal
      v-model="isModalOpen"
      title="Загрузить шаблон"
      ok-text="Загрузить"
      cancel-text="Отмена"
      width="350"
      @on-ok="onOkTemplateModal"
    >
      <Spin v-if="modalTemplatesLoading" fix />
      <Select v-model="landingTemplateId">
        <Option v-for="template in landingTemplates" :key="template.id" :value="template.id">
          {{ template.name }}
        </Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
import LandingEditor from '@/components/landing-editor/landing-editor'
import eventLandingAdapter from '@/services/event-landing-adapter'
import eventAdapter from '@/services/event-adapter'
import useEventLanding from '@/app/use-event-landing'
import eventLandingTemplateAdapter from '@/services/event-landing-template-adapter'
import { mapGetters } from 'vuex'
import { ROLES } from '@/domain/role'
import { LANGUAGES } from '@/domain/languages'

export default {
  components: {
    LandingEditor,
  },

  props: {
    propName: {
      type: Number,
      default: 0,
    },
  },

  ROLES,
  LANGUAGES,

  data() {
    return {
      code: {
        html: '',
        css: '',
        js: '',
      },
      styleLinkUrl: '',
      landingId: null,
      eventId: null,
      isLoading: false,
      lang: LANGUAGES.ru,
      isModalOpen: false,
      landingTemplates: [],
      landingTemplateId: null,
      modalTemplatesLoading: false,
      isTemplatesLoad: false,
    }
  },

  computed: {
    ...mapGetters(['getEventId', 'role']),
  },

  watch: {
    lang(val) {
      this.onChangeLang(val)
    },
  },

  async created() {
    try {
      this.isLoading = true
      this.eventId = this.$route.query.eventId || this.getEventId
      this.colorThemeId = await eventAdapter().getColorThemeId(this.eventId)
      this.styleLinkUrl = useEventLanding().getSrcEventStyleEl(this.colorThemeId)
      await this.setLandingData(this.eventId, this.lang)
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    resetLendingData() {
      this.code = {
        html: '',
        css: '',
        js: '',
      }
      this.landingId = null
    },

    async setLandingData(eventId, lang) {
      const [landing] = await eventLandingAdapter().getEventLandings({ filter: { eventId, lang } })
      if (landing) {
        this.code = {
          html: landing.body,
          css: landing.css,
          js: landing.js,
        }
        this.landingId = landing.id
        this.lang = landing.lang
      } else {
        this.resetLendingData()
      }
    },

    async onChangeLang(lang) {
      try {
        this.isLoading = true
        await this.setLandingData(this.eventId, lang)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async createLanding(code, lang, eventId) {
      try {
        const { id } = await eventLandingAdapter().createLanding({
          body: code.html,
          css: code.css,
          js: code.js,
          lang: lang,
          eventId: eventId,
        })
        this.landingId = id
        this.$Message.success('Лендинг успешно сохранен')
      } catch (e) {
        throw e
      }
    },

    async updateLanding(id, payload) {
      try {
        await eventLandingAdapter().updateLanding(this.landingId, payload)
        this.$Message.success('Лендинг успешно сохранен')
      } catch (e) {
        throw e
      }
    },

    goBack() {
      if (this.role === ROLES.manager) {
        this.$router.push({ name: 'home' })
      } else {
        this.$router.push(`/events/edit/${this.eventId}`)
      }
    },

    async onSave(code, isExit) {
      try {
        this.isLoading = true
        this.code = {
          html: code.html,
          css: code.css,
          js: code.js,
        }
        if (this.landingId) {
          await this.updateLanding(this.landingId, {
            body: code.html,
            css: code.css,
            js: code.js,
          })
        } else {
          await this.createLanding(code, this.lang, this.eventId)
        }

        if (isExit) {
          this.goBack()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async onOkTemplateModal() {
      try {
        this.isLoading = true
        const template = await eventLandingTemplateAdapter().getTemplate(this.landingTemplateId)
        this.code = {
          html: template.body,
          css: template.css,
          js: template.js,
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async loadTemplates() {
      try {
        this.modalTemplatesLoading = true
        const { data } = await eventLandingTemplateAdapter().getTemplates({
          sort: '-id',
          fields: {
            ['event-landing-template']: 'name',
          },
        })
        this.landingTemplates = data
        this.isTemplatesLoad = true
      } catch (e) {
        console.error(e)
      } finally {
        this.modalTemplatesLoading = false
      }
    },

    async onClickLoadTemplates() {
      try {
        this.isModalOpen = true
        if (this.isTemplatesLoad) return
        await this.loadTemplates()
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less">
.landing-page {
  &__lang {
    margin-bottom: 15px;
  }

  &__btn-wrapper {
    margin-bottom: 15px;
  }
}
</style>
