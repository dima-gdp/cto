<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu
      v-show="!collapsed"
      ref="menu"
      :active-name="activeName"
      :open-names="openedNames"
      :accordion="accordion"
      :theme="theme"
      width="auto"
      @on-select="handleSelect"
    >
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <SideMenuItem
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></SideMenuItem>
          <menu-item
            v-else
            :key="`menu-${item.children[0].name}`"
            :name="getNameOrHref(item, true)"
          >
            <common-icon :size="iconSize" :type="item.children[0].icon || ''" /><span>{{
              showTitle(item.children[0])
            }}</span>
          </menu-item>
        </template>
        <template v-else>
          <SideMenuItem
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></SideMenuItem>
          <menu-item v-else :key="`menu-${item.name}`" :name="getNameOrHref(item)">
            <common-icon :size="iconSize" :type="item.icon || ''" /><span>{{
              showTitle(item)
            }}</span>
          </menu-item>
        </template>
      </template>
    </Menu>
    <div v-show="collapsed" class="menu-collapsed" :list="menuList">
      <template v-for="item in menuList">
        <CollapsedMenu
          v-if="item.children && item.children.length > 1"
          :key="`drop-menu-${item.name}`"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          @on-click="handleSelect"
        ></CollapsedMenu>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import { getUnion } from '@/libs/tools'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  components: {
    SideMenuItem,
    CollapsedMenu,
  },
  mixins: [mixin],
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      },
    },
    collapsed: {
      type: Boolean,
    },
    theme: {
      type: String,
      default: 'light',
    },
    rootIconSize: {
      type: Number,
      default: 20,
    },
    iconSize: {
      type: Number,
      default: 17,
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: '',
    },
    openNames: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      openedNames: [],
    }
  },
  computed: {
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    },
  },
  watch: {
    activeName(name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames(newNames) {
      this.openedNames = newNames
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    },
  },
  mounted() {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
  },
  methods: {
    handleSelect(name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched.map((item) => item.name).filter((item) => item !== name)
    },
    updateOpenName(name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    },
  },
}
</script>
<style lang="less">
@import './side-menu.less';
</style>
