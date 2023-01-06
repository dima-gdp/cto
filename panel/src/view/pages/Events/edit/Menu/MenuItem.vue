<template>
  <div class="item-menu-block">
    <div class="item-menu-block__form">
      <Form ref="menuItemForm" :model="menuItem" :rules="$options.formRules">
        <Row :gutter="16">
          <Col span="1">
            <div class="item-menu-block__arrow-block">
              <Icon
                type="md-arrow-dropup"
                size="30"
                class="item-menu-block__arrow"
                :class="{ 'item-menu-block__arrow--disabled': isFirst }"
                @click="moveMenuItemTop"
              />
              <Icon
                type="md-arrow-dropdown"
                size="30"
                :class="{ 'item-menu-block__arrow--disabled': isLast }"
                class="item-menu-block__arrow"
                @click="moveMenuItemDown"
              />
            </div>
          </Col>
          <Col span="5">
            <FormItem
              :label="
                !isChild ? 'Название основного пункта меню' : 'Название вложенного пункта меню'
              "
              prop="title"
            >
              <Input v-model="menuItem.title" placeholder="Введите название"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="Тип ссылки">
              <Select v-model="menuItem.type">
                <Option value="page">Страница</Option>
                <Option value="url">Свой URL</Option>
                <Option value="without_link">Нет ссылки</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem v-if="menuItem.type === 'page'" label="Ссылка на страницу" prop="eventPageId">
              <Select v-model="menuItem.eventPageId" filterable>
                <Option
                  v-for="page in pages"
                  :key="page.id"
                  :value="page.id"
                  :label="page.title.trim()"
                />
              </Select>
            </FormItem>
            <FormItem v-else-if="menuItem.type === 'url'" label="Ссылка на страницу" prop="url">
              <Input v-model="menuItem.url" placeholder="Вводите, начиная с https://"></Input>
            </FormItem>
            <div v-else style="display: inline-block"></div>
          </Col>
          <Col span="3">
            <div class="item-menu-block__del-btn">
              <Button type="error" ghost icon="md-trash" @click="deleteItem">Удалить</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="item-menu-block__children">
      <MenuItem
        v-for="(item, index) in menuItem.children || []"
        :key="index"
        :data="item"
        :pages="pages"
        :is-first="index === 0"
        :is-last="index === menuItem.children.length - 1"
        is-child
        @del-item="deleteChild(index)"
        @up-item="upChild(index)"
        @down-item="downChild(index)"
      >
        {{ item.id }}
      </MenuItem>
    </div>
    <div v-if="!menuItem.parentId" class="item-menu-block__add-menu" @click="addChild">
      <Icon type="ios-add-circle-outline" size="33" />
      <div class="item-menu-block__add-menu-title">Добавить вложенный пункт</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  components: {
    MenuItem: () => import('./MenuItem.vue'),
  },
  formRules: {
    title: [{ required: true, message: 'Это поле обязательно' }],
    url: [
      { required: true, message: 'Это поле обязательно' },
      {
        trigger: 'blur',
        validator(rule, value, callback) {
          if (value && !value.startsWith('https://')) {
            callback(new Error('URL должен начинаться с https://'))
          } else {
            callback()
          }
        },
      },
    ],
    eventPageId: [{ required: true, message: 'Это поле обязательно' }],
  },
  props: {
    data: { type: Object, default: () => ({}) },
    pages: { type: Array, default: () => [] },
    isChild: { type: Boolean, default: false },
    isFirst: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
  },
  computed: {
    menuItem: {
      get() {
        // todo: вообще тут ошибка - у вычисляемого свойства нету сеттера,
        // но из-за того что он объект - то его поля реактивны, и поэтому он мутирует поле пропса, а
        // соответствующий vue-warn не выскакивает
        // оставил специально, чтобы проверить это поведение (в любом случае интересно почему так),
        // получается это баг vue, так как работать не должно (должен быть алерт)
        // в дальнейшем, при любой переделке - убрать нафиг, переделать на сквозные v-model кастомные
        return this.data
      },
    },
  },
  updated() {
    this.$refs.menuItemForm.validate()
  },
  methods: {
    moveMenuItemTop() {
      if (this.isFirst) {
        return
      }
      this.$emit('up-item')
    },
    moveMenuItemDown() {
      if (this.isLast) {
        return
      }
      this.$emit('down-item')
    },
    deleteItem() {
      this.$emit('del-item')
    },
    addChild() {
      this.$emit('add-child')
    },
    deleteChild(index) {
      this.$emit('del-child', index)
    },
    upChild(index) {
      this.$emit('up-child', index)
    },
    downChild(index) {
      this.$emit('down-child', index)
    },
  },
}
</script>

<style lang="less">
.item-menu-block {
  &__arrow-block {
    padding-top: 10px;
    display: inline-flex;
    flex-direction: column;
    color: #0d6efd;
  }
  &__arrow {
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
    &--disabled {
      pointer-events: none;
      color: #8c8c8c;
    }
    &--disabled:hover {
      opacity: 0.1;
    }
  }
  &__del-btn {
    padding-top: 31px;
  }
  &__form {
    background: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
  }
  &__children {
    padding-left: 40px;
  }
  &__add-menu {
    cursor: pointer;
    background: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: #0d6efd;
    margin-left: 40px;
  }
  &__add-menu-title {
    font-weight: bold;
    margin-left: 10px;
  }
}
</style>
