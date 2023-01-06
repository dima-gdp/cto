<template>
  <div :class="{ 'mobile-menu--active': isMenuOpen }" class="mobile-menu">
    <div
      :class="{ 'mobile-menu__container--active': isSubmenuOpen }"
      class="mobile-menu__container"
    >
      <div class="mobile-menu__left" @click="hideSubmenu">
        <nav class="mobile-menu__nav">
          <ul class="mobile-menu__list">
            <li
              v-for="menuItem of menu"
              :key="menuItem.id"
              :class="{ 'mobile-menu__item--icon': menuItem.children }"
              class="mobile-menu__item"
            >
              <template v-if="menuItem.children.length">
                <div class="mobile-menu__link" @click="onParentClicked($event, menuItem)">
                  <span>
                    {{ menuItem.title }}
                  </span>
                  <Icon type="ios-arrow-forward" />
                </div>
              </template>
              <AppHeaderLink
                v-else
                class="mobile-menu__link"
                :link="menuItem"
                :has-children="linkHasChildren(menuItem)"
              />
            </li>
          </ul>
        </nav>

        <div class="mobile-menu__manager">
          <AppHeaderManager />
        </div>

        <div class="mobile-menu__actions">
          <AppHeaderActions placement="top-start" />
        </div>
      </div>
      <nav v-show="currentSubmenu.length" class="mobile-menu__right">
        <ul class="mobile-sub-menu">
          <li v-for="sublink of currentSubmenu" :key="sublink.id" class="mobile-sub-menu__item">
            <AppHeaderLink class="mobile-sub-menu__link" :link="sublink" :has-children="false" />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import AppHeaderManager from '@/components/base/header/app-header-manager.vue'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import AppHeaderLink from '@/components/base/header/app-header-link.vue'

export default {
  components: {
    AppHeaderActions,
    AppHeaderManager,
    AppHeaderLink,
  },

  props: {
    isMenuOpen: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Array,
      default: () => [],
    },
    menuBtnSelector: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      currentSubmenu: [],
      isSubmenuOpen: false,
    }
  },

  watch: {
    isMenuOpen(val) {
      // закрывать встроенное меню, если закрыли все меню целиком
      if (!val) {
        this.hideSubmenu()
      }
    },
  },

  mounted() {
    document.body.addEventListener('click', this.onClickOutsideMobileMenu)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onClickOutsideMobileMenu)
  },

  methods: {
    linkHasChildren(link) {
      return !!link.children?.length
    },

    onClickOutsideMobileMenu({ target }) {
      if (!target.closest('.mobile-menu__container') && !target.closest(this.menuBtnSelector)) {
        this.hideSubmenu()
        this.$emit('close-menu')
      }
    },

    hideSubmenu() {
      this.isSubmenuOpen = false
      this.currentSubmenu = []
    },

    onParentClicked(clickEvent, link) {
      if (!this.isSubmenuOpen) {
        clickEvent.stopPropagation()
        if (link.children) {
          this.currentSubmenu = link.children
          this.isSubmenuOpen = true
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header-mobile-menu.scss';
</style>
