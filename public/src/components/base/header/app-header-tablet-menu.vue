<template>
  <div :class="{ 'tablet-menu--active': isMenuOpen }" class="tablet-menu">
    <div class="tablet-menu__container">
      <div class="tablet-menu__wrapper">
        <nav class="tablet-menu__nav">
          <ul ref="tabletMenu" class="tablet-menu__list">
            <!-- Основное меню-->
            <li
              v-for="(menuItem, idx) of menu"
              :key="menuItem.id"
              ref="headLink"
              :class="{ 'tablet-menu__item--icon': menuItem.children }"
              class="tablet-menu__item"
            >
              <template v-if="menuItem.children.length">
                <div class="mobile-menu__link" @click="onParentClicked(menuItem, idx)">
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
              <!-- Подменю-->
              <ul v-if="menuItem.children" ref="submenu" class="tablet-sub-menu">
                <li
                  v-for="sublink of menuItem.children"
                  :key="sublink.id"
                  class="tablet-sub-menu__item"
                >
                  <AppHeaderLink
                    class="tablet-sub-menu__link"
                    :link="sublink"
                    :has-children="false"
                  />
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="tablet-menu__manager">
          <AppHeaderManager />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeaderManager from '@/components/base/header/app-header-manager.vue'
import AppHeaderLink from '@/components/base/header/app-header-link.vue'

export default {
  components: {
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

  watch: {
    isMenuOpen(val) {
      // закрывать встроенное меню, если закрыли все меню целиком
      if (!val) {
        this.hideAllSubMenus()
      }
    },
  },
  mounted() {
    document.body.addEventListener('click', this.onClickOutsideTabletMenu)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onClickOutsideTabletMenu)
  },

  methods: {
    linkHasChildren(link) {
      return !!link.children?.length
    },

    hideAllSubMenus() {
      this.$refs.submenu.forEach((subMenu) => {
        subMenu.classList.remove('tablet-sub-menu--active')
        subMenu.previousSibling.classList.remove('mobile-menu__link--table-active')
      })
    },

    onParentClicked(link, idx) {
      if (link.children) {
        this.hideAllSubMenus()
        const subMenu = this.$refs.headLink[idx].lastElementChild
        // todo: убрать императивное выставление классов - сделать все через v-bind
        subMenu.classList.add('tablet-sub-menu--active')
        subMenu.previousSibling.classList.add('mobile-menu__link--table-active')
      }
    },

    onClickOutsideTabletMenu({ target }) {
      if (!target.closest('.tablet-menu__wrapper') && !target.closest(this.menuBtnSelector)) {
        this.hideAllSubMenus()
        this.$emit('close-menu')
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header-tablet-menu.scss';
</style>
