import {
  getCurrentForm,
  getAllFields,
  createGroup,
  deleteGroup,
  updateGroup,
  createFormLink,
  updateFormLink,
  deleteFormLink,
} from '@/api/forms'

export default {
  data() {
    return {
      formModel: {
        form: {},
        allFields: [],
        remoteMethods: {},
      },
    }
  },
  methods: {
    async setupFormConstructor(formId) {
      this.formModel = await this.initModel(formId)
      return this.formModel
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
      return {
        form,
        allFields,
        remoteMethods,
      }
    },
    async saveForm(groups) {
      this.load = true
      await Promise.all(groups.map((g) => this.groupProcess(g)))
      this.load = false
    },
    async copyForm(targetFormId, groups) {
      this.load = true
      await Promise.all(groups.map((g) => this.copyGroup(targetFormId, g)))
      this.load = false
    },
    async copyGroup(targetFormId, group) {
      const create = createGroup
      const { id, name, sort = 0, fields } = group

      if (id === null) {
        await Promise.all(fields.map((f) => this.copyField(targetFormId, id, f)))
      } else {
        const { data: newGroup } = await create({ formId: targetFormId, name, sort })
        await Promise.all(fields.map((f) => this.copyField(targetFormId, newGroup.id, f)))
      }
    },
    async copyField(targetFormId, groupId, field) {
      if (field) {
        await createFormLink({
          ...field.formLink,
          formId: targetFormId,
          groupId,
          dependentFormFieldId: null,
        })
      }
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

      for (const key in link) {
        if (link[key] === undefined) {
          link[key] = null
        }
      }

      link.id ? await update(link.id, link) : await create(link)
    },
  },
}
