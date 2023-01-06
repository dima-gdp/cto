<template>
  <div>
    <Card dis-hover>
      <Form ref="typeForm" :model="form" :rules="$options.typeFormValidationRules">
        <Row :gutter="12" type="flex">
          <i-col span="6">
            <FormItem label="Начало мероприятия" prop="startedAt">
              <Input
                v-model="form.startedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату начала мероприятия"
              />
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="Окончание мероприятия" prop="endedAt">
              <Input
                v-model="form.endedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату окончания мероприятия"
              />
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
import { validateDateTime } from '@/libs/validators'
import { fromISOToString, fromStringToISO } from '@/libs/util'

const dateRules = [
  {
    validator: validateDateTime,
    message: 'Дата должна иметь формат: 12-01-2020 18:00',
    trigger: 'blur',
  },
]

const typeFormValidationRules = {
  startedAt: [...dateRules],
  endedAt: [...dateRules],
}

export default {
  model: {
    prop: 'formTypeEvent',
    event: 'updateFormTypeEvent',
  },

  props: {
    formTypeEvent: {
      type: Object,
      default: () => ({}),
    },
  },

  typeFormValidationRules,

  data() {
    return {
      form: {
        id: this.formTypeEvent.id,
        isValid: false,
        startedAt: fromISOToString(this.formTypeEvent.startedAt),
        endedAt: fromISOToString(this.formTypeEvent.endedAt),
      },
    }
  },

  watch: {
    form: {
      async handler(value) {
        const isValid = await this.$refs.typeForm.validate()

        this.$emit('updateFormTypeEvent', {
          id: value.id,
          startedAt: fromStringToISO(value.startedAt),
          endedAt: fromStringToISO(value.endedAt),
          isValid,
        })
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
