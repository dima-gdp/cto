<template>
  <ul ref="menu" class="menu">
    <!-- Основной элемент меню-->
    <li
      v-for="menuItem of mainMenu"
      :key="menuItem.id"
      ref="menuItems"
      :class="{ 'menu__item--icon': menuItem.children }"
      class="menu__item"
    >
      <AppHeaderLink
        class="menu__link"
        :link="menuItem"
        :has-children="linkHasChildren(menuItem)"
      />
      <!-- Подменю(выпадашка)-->
      <ul v-if="menuItem.children" class="sub-menu">
        <li v-for="sublink of menuItem.children" :key="sublink.id" class="sub-menu__item">
          <AppHeaderLink class="sub-menu__link" :link="sublink" :has-children="false" />
        </li>
      </ul>
    </li>

    <!-- Дополнительное меню-->
    <li v-if="additionalMenu.length" class="menu__item menu__item--icon">
      <span class="menu__link">
        <span>Дополнительно</span>
        <Icon type="ios-arrow-down" />
      </span>
      <ul class="sub-menu">
        <li v-for="link of additionalMenu" :key="link.id" class="sub-menu__item">
          <AppHeaderLink class="sub-menu__link" :link="link" :has-children="false" />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import AppHeaderLink from '@/components/base/header/app-header-link.vue'
import { MENU_ITEMS_TYPES } from '@/utils/constants'

const HEADER_SIZES = {
  HEADER_PADDING: 48,
  LOGO_SIZE: 135,
  MENU_MR: 92,
  MANAGER_SIZE: 81,
  ACTIONS_SIZE: 96,
  RESERVE: 50,
}

const ADDITIONAL_MENU_ITEM_WIDTH = 185

export default {
  components: {
    AppHeaderLink,
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    windowWith: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      additionalMenu: [],
      mainMenu: this.menu,
    }
  },
  watch: {
    async menu(menuItems) {
      if (this.additionalMenu.length) return
      await this.setMenu(menuItems)
    },
  },
  methods: {
    linkHasChildren(link) {
      return !!link.children?.length
    },

    getSumHeaderSizesWithoutMenu() {
      return Object.values(HEADER_SIZES).reduce((sum, current) => sum + current, 0)
    },

    getIndexForSliceMenu(availableWidth) {
      let sliceWidth = 0

      for (let i = this.$refs.menuItems.length - 1; i >= 0; i--) {
        sliceWidth += this.$refs.menuItems[i].offsetWidth

        if (
          this.$refs.menu.offsetWidth - sliceWidth + ADDITIONAL_MENU_ITEM_WIDTH <
          availableWidth
        ) {
          return i
        }
      }
    },

    setAdditionalMenu(availableWidth) {
      const additionalMenu = []
      const sliceIdx = this.getIndexForSliceMenu(availableWidth)

      // Наполняем дополнительное меню невлезающими элементами
      this.menu.slice(-this.menu.length + sliceIdx).forEach((menuItem) => {
        additionalMenu.push(menuItem)
        if (menuItem.children) {
          additionalMenu.push(...menuItem.children)
        }
      })

      this.additionalMenu = additionalMenu
      this.mainMenu = this.menu.slice(0, sliceIdx)
    },

    async setMenu(menuItems) {
      if (menuItems.length) {
        this.mainMenu = menuItems
        await this.$nextTick()
        const availableWidth = this.windowWith - this.getSumHeaderSizesWithoutMenu()

        // Если ширина меню больше чем влезет
        if (this.$refs.menu.offsetWidth > availableWidth) {
          this.setAdditionalMenu(availableWidth)
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header-menu.scss';
</style>
