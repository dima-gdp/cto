<template>
  <div>
    <Spin v-if="isLoading" size="large" fix style="z-index: 11" />
    <Row v-else type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание шаблона лендинга</span>
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
import { getLandingTemplate } from '@/domain/event-landing-template'

export default {
  components: { FormLanding },

  data() {
    return {
      form: { name: '', description: '' },
      code: { html: '', css: '', js: '' },
      isLoading: false,
    }
  },

  methods: {
    async onSubmitForm({ form, code, isExit }) {
      try {
        this.isLoading = true
        const templatePayload = getLandingTemplate(form, code)
        const template = await eventLandingTemplateAdapter().createTemplate(templatePayload)
        this.$Message.success('Шаблон успешно сохранен')

        if (isExit) {
          await this.$router.push({ name: 'landings_list' })
          return
        }

        this.$router.push({ name: 'landing_edit', params: { id: template.id } })
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
