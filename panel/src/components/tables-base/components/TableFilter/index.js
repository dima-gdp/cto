import Input from './fields/Input'
import AsyncSelect from './fields/AsyncSelect'
import Select from './fields/Select'
import DateRange from './fields/DateRange'
import Radio from './fields/Radio'

export default {
  functional: true,
  components: {
    Input,
    AsyncSelect,
    Select,
    Radio,
    DateRange,
  },
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      type: [Array, String],
      default: '',
    },
  },
  render(createElement, { props, listeners }) {
    const { type } = props.filter

    function filterField() {
      switch (type) {
        case 'Input':
          return Input
        case 'Select':
          return Select
        case 'Radio':
          return Radio
        case 'AsyncSelect':
          return AsyncSelect
        case 'DateRange':
          return DateRange
        default:
          break
      }
    }

    return createElement(
      'Col',
      {
        attrs: {
          xs: props.filter.cols || 6,
        },
      },
      [
        createElement(filterField(), {
          class: ['table-filter__item'],
          on: listeners,
          props,
        }),
      ]
    )
  },
}
