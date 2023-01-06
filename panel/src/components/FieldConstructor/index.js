import FieldConstructor from './Constructor.vue'

export default {
  functional: true,
  render(h, context) {
    const { data, children } = context

    return h(FieldConstructor, data, children)
  },
}
