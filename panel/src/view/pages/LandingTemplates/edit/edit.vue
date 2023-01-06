<template>
  <div>
    <Spin v-if="isLoading" size="large" fix style="z-index: 11" />
    <Row v-else type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование шаблона лендинга</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push({ name: 'landings_list' })">
          Назад
        </Button>
      </i-col>
    </Row>
    <Card>
      <FormLanding :form="form" :code="code" @submit="onSubmitForm" />
    </Card>
  </div>
</template>

<script>
import FormLanding from '@/view/pages/LandingTemplates/form/FormLanding'
import eventLandingTemplateAdapter from '@/services/event-landing-template-adapter'
import { getCodeFromTemplate, getLandingTemplate } from '@/domain/event-landing-template'

export default {
  components: { FormLanding },

  data() {
    return {
      form: { name: '', description: '' },
      code: { html: '', css: '', js: '' },
      isLoading: false,
      templateId: null,
    }
  },

  async created() {
    try {
      this.isLoading = true
      this.templateId = this.$route.params.id
      if (this.templateId) {
        const template = await eventLandingTemplateAdapter().getTemplate(this.templateId)
        this.form = template
        this.code = getCodeFromTemplate(template)
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async onSubmitForm({ form, code, isExit }) {
      try {
        this.isLoading = true
        const templatePayload = getLandingTemplate(form, code)
        const template = await eventLandingTemplateAdapter().updateTemplate(
          this.templateId,
          templatePayload
        )
        this.$Message.success('Шаблон успешно сохранен')

        if (isExit) {
          await this.$router.push({ name: 'landings_list' })
          return
        }

        this.form = template
        this.code = getCodeFromTemplate(template)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
