<script>
import Icon from '@/assets/vendor/view-design/src/components/icon/icon.vue'
import { MENU_ITEMS_TYPES } from '@/utils/constants'
import { mapGetters } from 'vuex'

export default {
  MENU_ITEMS_TYPES,
  props: {
    link: { type: Object, required: true },
    hasChildren: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters('pages', ['getPagePathById']),

    /**
     * @returns {{options: {}, element: string}}
     */
    linkObj() {
      if (this.link.type === MENU_ITEMS_TYPES.PAGE) {
        return {
          element: 'router-link',
          options: {
            props: {
              to: {
                path: this.getPagePathById(this.link.eventPageId),
                query: {
                  lang: this.link.lang,
                },
              },
            },
          },
        }
      }
      if (this.link.type === MENU_ITEMS_TYPES.NO_LINK) {
        return {
          element: 'div',
          options: {},
        }
      }
      return {
        element: 'a',
        options: {
          attrs: {
            href: this.link.url,
            target: '_blank',
          },
        },
      }
    },
  },

  methods: {
    getLinkInnerHtml(createElement) {
      if (this.hasChildren) {
        return [
          createElement('span', this.link.title),
          createElement(Icon, {
            props: {
              type: 'ios-arrow-down',
            },
          }),
        ]
      }
      return [createElement('div', this.link.title)]
    },
  },

  render(createElement) {
    return createElement(
      this.linkObj.element,
      this.linkObj.options,
      this.getLinkInnerHtml(createElement),
    )
  },
}
</script>

<style></style>
