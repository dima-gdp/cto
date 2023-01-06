<template>
  <div class="page-event-menu">
    <Row
      class="page-event-menu__header"
      type="flex"
      justify="center"
      align="middle"
      class-name="view-header"
    >
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Настройка меню мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${$route.params.id}`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>
    <Card class="page-event-menu__card">
      <Tabs v-model="lang" :animated="false" class="tabs" @on-click="fetchData">
        <div style="padding: 12px 0">
          <Row>
            <i-col>
              <Checkbox v-model="menu.isItemAutoCreation">
                Автоматически добавлять новые страницы в меню
              </Checkbox>
            </i-col>
          </Row>
        </div>
        <TabPane
          v-for="availableLanguage in existingLangs"
          :key="availableLanguage"
          :label="availableLanguage.toUpperCase()"
          :name="availableLanguage"
        >
          <Spin v-if="loading" fix></Spin>
          <div v-else class="page-event-menu__content menu-block">
            <h3 class="menu-block__title">Пункты меню</h3>
            <MenuItem
              v-for="(item, index) in menuItems"
              :key="index"
              :data="item"
              :pages="pages"
              :is-first="index === 0"
              :is-last="index === menuItems.length - 1"
              @del-item="delItemMenu(index)"
              @up-item="upMenuItem(index)"
              @down-item="downMenuItem(index)"
              @add-child="addChildIntoMenuItem(index)"
              @del-child="deleteChild($event, index)"
              @up-child="upChild($event, index)"
              @down-child="downChild($event, index)"
            />
            <div class="add-item-menu" @click="addItemMenu">
              <Icon class="add-item-menu__icon" type="ios-add-circle-outline" size="44" />
              <div class="add-item-menu__title">Добавить новый пункт меню</div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
    <SavePanel @save="submitForm('save')" @apply="submitForm('accept')" />
  </div>
</template>
<script>
import { getEventMenuList, updateEventMenu, updateItemListMenu } from '@/api/event-menu'
import { getEventPages } from '@/api/event-page'
import MenuItem from './MenuItem.vue'
import SavePanel from '@/components/save-panel/save-panel'
import {
  addMenuItem,
  createDefaultMenuItem,
  downItem,
  removeMenuItem,
  sortItems,
  upItem,
} from '@/view/pages/Events/edit/Menu/menu-service'
import { getEventFormLink } from '@/api/event'

export default {
  components: {
    MenuItem,
    SavePanel,
  },
  data() {
    return {
      lang: 'ru',
      menu: {},
      pages: null,
      eventId: this.$route.params.id,
      loading: false,
      /**
       * @type EventMenuItem[]
       */
      menuItems: [],
      existingLangs: ['ru'],
    }
  },

  created() {
    this.fetchData()
    this.fetchExistingLangs()
  },
  methods: {
    async fetchData() {
      await Promise.all([this.getMenu(this.eventId, this.lang), this.getEventPages(this.eventId)])
    },

    async fetchExistingLangs() {
      const { data } = await getEventFormLink({
        filter: {
          eventId: this.eventId,
        },
      })
      this.existingLangs = data.map((f) => f.lang)
    },
    async getMenu(eventId, lang) {
      this.loading = true
      const params = {
        filter: { eventId: eventId, lang: lang },
        include: 'items.children',
      }
      try {
        const { data } = await getEventMenuList(params)

        const [rawMenu] = data // там массив из одного элемента (привет языкам)
        const { menu, items } = this.processMenu(rawMenu)

        this.menuItems = items
        this.menu = menu
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    processMenu(rawMenu) {
      const sortedItems = this.sortMenuItems(rawMenu.items)
      const menu = rawMenu
      delete menu.items

      return { menu, items: sortedItems }
    },

    sortMenuItems(items) {
      return sortItems(items).map((child) => ({
        ...child,
        children: sortItems(child.children),
      }))
    },

    async getEventPages(eventId) {
      const params = {
        filter: { eventId: eventId, lang: this.lang },
      }
      const { data } = await getEventPages(params)
      this.pages = data
    },

    addItemMenu() {
      const newItem = createDefaultMenuItem({
        eventMenuId: this.menu.id,
        lang: this.lang,
        parentId: null,
      })
      this.menuItems = this.sortMenuItems(addMenuItem(this.menuItems, newItem))
    },

    addChildIntoMenuItem(menuItemIndex) {
      const menuItem = this.menuItems[menuItemIndex]
      const newChild = createDefaultMenuItem({
        eventMenuId: this.menu.id,
        lang: this.lang,
        parentId: menuItem.id,
      })

      const newChildren = addMenuItem(menuItem.children, newChild)

      this.updateChildrenInItem(menuItemIndex, newChildren)
    },
    delItemMenu(menuItemIndex) {
      this.menuItems = removeMenuItem(this.menuItems, menuItemIndex)
    },
    upMenuItem(index) {
      this.menuItems = upItem(this.menuItems, index)
    },
    downMenuItem(index) {
      this.menuItems = downItem(this.menuItems, index)
    },

    deleteChild(childIndex, menuItemIndex) {
      const item = this.menuItems[menuItemIndex]
      const newChildren = removeMenuItem(item.children, childIndex)
      this.updateChildrenInItem(menuItemIndex, newChildren)
    },

    upChild(childIndex, menuItemIndex) {
      const item = this.menuItems[menuItemIndex]
      const newChildren = upItem(item.children, childIndex)
      this.updateChildrenInItem(menuItemIndex, newChildren)
    },

    downChild(childIndex, menuItemIndex) {
      const item = this.menuItems[menuItemIndex]
      const newChildren = downItem(item.children, childIndex)
      this.updateChildrenInItem(menuItemIndex, newChildren)
    },

    updateChildrenInItem(menuItemIndex, newChildren) {
      const item = this.menuItems[menuItemIndex]
      this.$set(this.menuItems, menuItemIndex, { ...item, children: newChildren })
    },

    async submitForm(action) {
      this.loading = true
      const menuWithItems = this.menu // кастомное обновление итемов (не по json api)
      menuWithItems.eventMenuId = menuWithItems.id
      menuWithItems.items = this.menuItems

      try {
        await updateEventMenu(this.menu.id, { isItemAutoCreation: this.menu.isItemAutoCreation })
        await updateItemListMenu(menuWithItems)
        if (action === 'save') {
          await this.$router.push(`/events/edit/${this.eventId}`)
        }
        await this.getMenu(this.eventId, this.lang)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less">
.page-event-menu {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
  }
  &__card {
  }
}
.menu-block {
  &__title {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
.add-item-menu {
  padding: 20px;
  border: 1px dashed #6c757d;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #0d6efd;
  cursor: pointer;
  &__icon {
    margin-bottom: 10px;
  }
  &__title {
    font-weight: bold;
  }
}
</style>
