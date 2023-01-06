<script>
const returnArrayFn = () => []

export default {
  functional: true,
  props: {
    options: {
      type: Array,
      default: returnArrayFn,
    },
    slotOptions: {
      type: Array,
      default: returnArrayFn,
    },
    slotUpdateHook: {
      type: Function,
      default: () => {},
    },
    suffix: {
      type: String,
    },
  },
  render(h, { props, parent }) {
    // to detect changes in the $slot children/options we do this hack
    // so we can trigger the parents computed properties and have everything reactive
    // although $slot.default is not
    if (props.slotOptions !== parent.$slots.default) props.slotUpdateHook()

    if (props.suffix)
      props.options.forEach((o) => {
        o.componentOptions.propsData.suffix = props.suffix
      })

    return props.options
  },
}
</script>
