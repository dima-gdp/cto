import { FieldEventBus } from '../field-event-bus'
// todo: давно нуждается в переосмыслении и рефакторинге, как и весь field-renderer

const MAX_DAYS_IN_MONTH = 31
const MAX_MONTHS = 12

export default {
  methods: {
    setupValidation() {
      const {
        id,
        type,
        formLink: { required },
      } = this.field

      const requireRule = {
        required,
        message: this.$tr('initValidation.required'),
        // trigger: 'blur'
      }

      const maxLengthStringRule = {
        validator(rule, value, _callback) {
          if (!value) {
            return true
          } // обязательность проверяется другим правилом

          return value.length <= 255
        },
        message: this.$tr('errors.fields.string.notValidLength'),
      }

      const dateRule = {
        validator(rule, value, _callback) {
          if (!value) {
            return true
          } // обязательность проверяется другим правилом

          const [day, month] = value.split('-')
          return +day <= MAX_DAYS_IN_MONTH && +month <= MAX_MONTHS
        },
        message: this.$tr('initValidation.wrongDateFormat'),
        pattern: /^\d{2}-\d{2}-\d{4}$/,
      }

      /**
       * @type {Array<{ type: string, rules: Array}>}
       */
      const typeRulesList = [
        { type: 'string', rules: [maxLengthStringRule] },
        { type: 'datatime', rules: [dateRule] },
      ]

      FieldEventBus.$emit('initValidation', { id, rule: requireRule })

      typeRulesList.forEach((typeRule) => {
        if (type === typeRule.type) {
          typeRule.rules.forEach((rule) => {
            FieldEventBus.$emit('initValidation', { id, rule })
          })
        }
      })
    },
  },
  mounted() {
    this.setupValidation()
  },
}
