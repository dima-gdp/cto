<template>
  <div class="theme-create">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание темы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/themes')"> Назад </Button>
      </i-col>
    </Row>
    <Card style="margin-bottom: 15px">
      <Form ref="themeCreate" :model="formModel" :rules="formRules" label-position="top">
        <FormItem prop="name" label="Название">
          <Input v-model="formModel.name" placeholder="Введите название темы" />
        </FormItem>
      </Form>
      <Spin v-if="loading" fix></Spin>
    </Card>
    <Card style="margin-bottom: 15px; padding: 15px">
      <h2 style="margin-bottom: 15px">Цвета</h2>
      <Row
        v-for="(colors, name) in theme.colors"
        :key="name"
        type="flex"
        style="margin-bottom: 20px"
        :gutter="10"
      >
        <i-col :sm="24" style="margin-bottom: 10px">
          <h3>{{ name | capitalize }}</h3>
        </i-col>
        <i-col
          v-for="(color, index) in colors"
          :key="index"
          :lg="4"
          :md="8"
          :sm="12"
          style="margin-bottom: 15px"
        >
          <ColorPicker
            v-model="colors[index].value"
            size="large"
            :alpha="/rgba\(.+\)/.test(color)"
          />
          <div v-if="colors[index].help" style="margin-top: 5px">
            <i>{{ colors[index].help }}</i>
          </div>
        </i-col>
      </Row>
      <Spin v-if="loading" fix></Spin>
    </Card>
    <Card style="margin-bottom: 15px">
      <h2 style="margin-bottom: 15px">Шрифты</h2>
      <Row type="flex" style="margin-bottom: 15px">
        <i-col :sm="24" style="margin-bottom: 10px">
          <h3 style="margin-bottom: 5px">Regular</h3>
          <Input v-model.trim="theme.fonts.regular.value" />
        </i-col>
        <i-col :sm="24" style="margin-bottom: 10px">
          <h3 style="margin-bottom: 5px">Medium</h3>
          <Input v-model.trim="theme.fonts.medium.value" />
        </i-col>
        <i-col :sm="24" style="margin-bottom: 10px">
          <h3 style="margin-bottom: 5px">Semi-bold</h3>
          <Input v-model.trim="theme.fonts.semiBold.value" />
        </i-col>
      </Row>
      <Spin v-if="loading" fix></Spin>
    </Card>
    <Row type="flex" justify="end">
      <i-col :lg="3" :sm="6" class-name="org-form-actions">
        <Button class="org-form-actions__btn" long @click="createTheme('accept')">
          Применить
        </Button>
      </i-col>
      <i-col :lg="3" :sm="6" class-name="org-form-actions" style="margin-left: 15px">
        <Button type="primary" class="org-form-actions__btn" long @click="createTheme('save')">
          Сохранить
        </Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { createTheme } from '@/api/themes'

export default {
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  data() {
    return {
      formModel: {
        name: '',
      },
      formRules: {
        name: [{ required: true, message: 'Поле обязательно для заполнения!' }],
      },
      loading: false,
      theme: {
        colors: {
          main: [
            {
              value: '#E5F2FF',
              name: '--s-primary-color-10',
              help:
                'Фон для небольших элементов (фон дат мероприятия. фон действий с полями в форме)',
            },
            {
              value: '#CCE5FF',
              name: '--s-primary-color-20',
              help: 'Наведение в выпадающих списках',
            },
            { value: '#B3D8FF', name: '--s-primary-color-30', help: 'Цвет фона мобильного меню' },
            { value: '#99CBFF', name: '--s-primary-color-40', help: 'Не используется' },
            { value: '#80BFFF', name: '--s-primary-color-50', help: 'Не используется' },
            { value: '#66B2FF', name: '--s-primary-color-60', help: 'Наведение при выборе языка' },
            {
              value: '#4DA5FF',
              name: '--s-primary-color-70',
              help: 'Обычное состояние основных кнопок',
            },
            {
              value: '#3398FF',
              name: '--s-primary-color-80',
              help: 'Цвет телефона и e-mail в блоке контактов',
            },
            {
              value: '#1A8BFF',
              name: '--s-primary-color-90',
              help: 'Цвет черты выделения активного пункта меню',
            },
            {
              value: '#007EFF',
              name: '--s-primary-color',
              help:
                'Hover and active состояния ссылок, кнопок, чекбоксов и радиобаттонов, активная иконка корзина',
            },
            {
              value: 'rgba(45, 140, 240, 0.2)',
              name: '--s-primary-box-shadow',
              help: 'Тень при наведении на основную кнопку',
            },
          ],
          black: [
            { value: '#F9F9FA', name: '--s-black-color-0', help: 'Основной Фон' },
            {
              value: '#F9F9FA',
              name: '--s-black-color-5',
              help: 'Цвет фона для элементов, текст disabled кнопки',
            },
            { value: '#E8E8E8', name: '--s-black-color-10', help: 'Разделители в меню' },
            {
              value: '#DBDDE0',
              name: '--s-black-color-20',
              help: 'Цвет disabled кнопки, иконка корзины в магазине',
            },
            { value: '#CACCCF', name: '--s-black-color-40', help: 'Граница тултипа смены языка' },
            {
              value: '#A0A4A8',
              name: '--s-black-color-60',
              help:
                'Название мероприятия, неактивное состояние элементов, цвет подсказок, цвет кнопки cancel',
            },
            {
              value: '#52575C',
              name: '--s-black-color-80',
              help: 'Основной цвет текстов, наведение кнопки закрыть',
            },
            {
              value: '#25282B',
              name: '--s-black-color',
              help: 'Тексты заголовков, подписи, active и hover поля ввода',
            },
            {
              value: 'rgba(0, 0, 0, 0.15)',
              name: '--s-black-box-shadow',
              help: 'Тень при наведении на кнопку cancel',
            },
          ],
          white: [{ value: '#FFF', name: '--s-white-color', help: 'Фон блоков' }],
          warning: [
            { value: '#F6A609', name: '--s-warning-color', help: 'Иконки в алертах' },
            { value: '#E89806', name: '--s-warning-color-darker', help: 'Текст в алерте' },
            { value: '#FFBC1F', name: '--s-warning-color-medium', help: 'Не используется' },
            { value: '#FFF2D2', name: '--s-warning-color-light', help: 'Фон текста в алерте' },
            {
              value: 'rgb(246, 166, 9, 0.2)',
              name: '--s-warning-box-shadow',
              help: 'Не используется',
            },
          ],
          success: [
            { value: '#2AC769', name: '--s-success-color', help: 'Иконка успешного действия' },
            {
              value: '#1AB759',
              name: '--s-success-color-darker',
              help: 'Текст успешного действия',
            },
            { value: '#40DD7F', name: '--s-success-color-medium', help: 'Не используется' },
            {
              value: '#B8FED3',
              name: '--s-success-color-light',
              help: 'Фон для текста успешного действия',
            },
            {
              value: 'rgba(45, 140, 240, 0.2)',
              name: '--s-success-box-shadow',
              help: 'Не используется',
            },
          ],
          error: [
            {
              value: '#FB4E4E',
              name: '--s-error-color',
              help: 'Иконка ошибки, удаления в магазине, ошибка в форме',
            },
            { value: '#E93C3C', name: '--s-error-color-darker', help: 'Текст ошибки' },
            {
              value: '#FF6262',
              name: '--s-error-color-medium',
              help: 'Иконка удаления всех товаров из корзины',
            },
            { value: '#FADBDC', name: '--s-error-color-light', help: 'Фон для текста ошибки' },
            {
              value: 'rgba(45, 140, 240, 0.2)',
              name: '--s-error-box-shadow',
              help: 'Не используется',
            },
          ],
        },
        fonts: {
          regular: { value: 'Roboto', name: '--s-regular-font' },
          medium: { value: 'Roboto', name: '--s-medium-font' },
          semiBold: { value: 'Roboto', name: '--s-semi-bold-font' },
        },
      },
    }
  },
  computed: {
    variables() {
      const colors = Object.entries(this.theme.colors)
        .map((part) => part[1])
        .reduce((acc, cur) => [...acc, ...cur], [])
        .reduce((acc, cur) => {
          acc[cur.name] = `${cur.value} !important`
          return acc
        }, {})

      const fonts = Object.entries(this.theme.fonts)
        .map((part) => part[1])
        .reduce((acc, cur) => {
          acc[cur.name] = `${cur.value} !important`
          return acc
        }, {})

      return { ...colors, ...fonts }
    },
  },
  methods: {
    async createTheme(type) {
      const valid = await this.validateForm()

      if (valid) {
        this.loading = true

        const theme = await createTheme({
          name: this.formModel.name,
          css: { ':root': { ...this.variables } },
        }).catch((e) => {
          this.loading = false
          this.$Message.error('Ошибка при создании темы')
          throw new Error(e)
        })

        this.loading = false

        this.$Message.success('Тема создана')

        if (type === 'save') {
          this.$router.push({ path: '/themes' })
        }

        if (type === 'accept') {
          this.$router.push({ path: `/themes/edit/${theme.data.id}` })
        }
      }
    },
    async validateForm() {
      return this.$refs['themeCreate'].validate()
    },
  },
}
</script>

<style lang="less">
.theme-create {
  .ivu-select-dropdown {
    left: 0 !important;
  }
}
</style>
