<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование формы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/forms/list')"> Назад </Button>
      </i-col>
    </Row>

    <MainForm :load="load" :form-data="formModel.form" @on-submit="buildForm" />

    <Card>
      <FormConstructor
        v-model="formModel.form.groups"
        :form="formModel.form"
        :all-fields="formModel.allFields"
        :remote-methods="formModel.remoteMethods"
        :loading="load"
      />
    </Card>
  </div>
</template>

<script>
import MainForm from './components/MainForm'
import FormConstructor from '@/components/form-constructor'

import {
  getCurrentForm,
  getAllFields,
  createGroup,
  deleteGroup,
  updateGroup,
  createFormLink,
  updateFormLink,
  deleteFormLink,
  updateForm,
} from '@/api/forms'

export default {
  components: {
    MainForm,
    FormConstructor,
  },
  data() {
    return {
      formLinks: [],
      fields: [],
      formData: {},
      load: false,
      formModel: {
        form: {},
        allFields: [],
        remoteMethods: {},
      },
    }
  },
  async created() {
    await this.loadForm()
  },
  methods: {
    async buildForm([formData, action]) {
      if (formData.type === 'registration' && !this.isFormHasFIO(formData)) {
        this.$Message.error('Необходимо добавить поля с тегами "Имя", "Фамилия", "Отчество"')
        return
      }
      this.load = true

      try {
        const { id } = this.$route.params

        await updateForm(id, formData)
        await this.saveForm(this.formModel.form.groups)

        this.$Message.success('Форма успешно обновлена!')
        this.load = false
      } catch (e) {
        this.$Message.error('Ошибка при обновлении формы!')
        this.load = false
        throw new Error(e)
      }

      await this.loadForm()

      if (action === 'save') {
        await this.$router.push({ path: '/forms/list' })
      }
    },
    async loadForm() {
      const { id } = this.$route.params
      const model = await this.initModel(id)

      this.formModel = {
        form: {},
        allFields: [],
        remoteMethods: {},
      }

      Object.entries(model).forEach(([key, value]) => {
        this.$set(this.formModel, key, value)
      })
    },
    async initModel(formId) {
      this.load = true

      const formParams = { include: 'fields.values,groups' }
      const { data: form } = await getCurrentForm(formId, formParams)
      const { data: allFields } = await getAllFields({
        'per-page': 0,
        filter: {
          location: 'global',
        },
      })

      const { fields = [], groups = [] } = form

      form.groups = groups || []

      form.groups.forEach((group) => {
        this.$set(
          group,
          'fields',
          fields.filter((f) => +f.formLink.groupId === +group.id)
        )
      })
      form.groups.push({
        name: 'Без группы',
        fields: fields.filter((f) => f.formLink.groupId === null),
        id: null,
        formId: form.id,
      })

      const remoteMethods = {
        removeFormLink: deleteFormLink,
        removeGroup: deleteGroup,
        addGroup: createGroup,
      }

      this.load = false
      return { form, allFields, remoteMethods }
    },
    async saveForm(groups) {
      this.loading = true
      await Promise.all(groups.map((g) => this.groupProcess(g)))
      this.loading = false
    },
    async groupProcess(group) {
      const update = updateGroup
      const { id, formId, name, sort, fields } = group

      // Обновляем поля без групп
      if (id === null) {
        await Promise.all(fields.map((f) => this.fieldsProcess(f)))
        return
      }

      // Обновляем группу и входящие в нее филды
      if (id) {
        await update(id, { formId, name, sort })
        await Promise.all(fields.map((f) => this.fieldsProcess(f)))
      }
    },
    async fieldsProcess(field) {
      const create = createFormLink
      const update = updateFormLink

      const { formLink: link } = field

      link.id ? await update(link.id, link) : await create(link)
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

<style></style>
