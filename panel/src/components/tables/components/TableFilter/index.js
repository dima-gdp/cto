import Store from '@/store'

import Input from './fields/Input'
import AsyncSelect from './fields/AsyncSelect'
import Select from './fields/Select'
import DateRange from './fields/DateRange'
import Radio from './fields/Radio'
import SuperFilterComponent from './fields/SuperFilterComponent'

export default {
  functional: true,
  components: {
    Input,
    AsyncSelect,
    Select,
    Radio,
    DateRange,
    SuperFilterComponent,
  },
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      required: false,
    },
    withLabels: {
      type: Boolean,
      default: false,
    },
    innerConn: {
      type: String,
    },
  },
  render(createElement, { props, children, listeners }) {
    const { type, searchable, access } = props.filter
    const role = Store.state.user.access

    function selectFilter() {
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
        case 'TurboMultiSelect':
          return SuperFilterComponent
        default:
          break
      }
    }
    if (searchable && access.includes(role)) {
      return createElement(
        'Col',
        {
          attrs: {
            xs: props.filter.cols || 6,
          },
        },
        [
          props.withLabels && props.filter.label && createElement('label', {}, props.filter.label),
          createElement(
            selectFilter(),
            {
              attrs: props,
              on: listeners,
            },
            children
          ),
        ]
      )
    }
  },
}
