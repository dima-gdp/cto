<template>
  <div class="form-fields-wrap">
    <Row v-if="!isLocal && Object.keys(field).length > 0" type="flex">
      <Tabs v-model="tab" :animated="false" class="tabs" @on-click="changeFormLang">
        <TabPane label="RU"></TabPane>
        <TabPane label="EN"></TabPane>
      </Tabs>
    </Row>

    <Card class="form-fields-create">
      <h3 class="form-fields-create__title">Данные поля</h3>
      <Form ref="fieldCreate" :model="form" :rules="formRules" label-position="top">
        <Row type="flex">
          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Название" prop="name">
              <Input v-model="form.name" placeholder="Введите название поля" />
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Тип поля" prop="type">
              <Select v-model="form.type" :disabled="lang === 'en'" placeholder="Выберите тип поля">
                <template v-for="(type, index) in types">
                  <Option :key="index" :value="type.value">
                    {{ type.name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Подсказка" prop="help">
              <Input v-model="form.help" placeholder="Введите подсказку" />
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Заполнитель" prop="placeholder">
              <Input v-model="form.placeholder" placeholder="Заполнитель по умолчанию" />
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Tag" prop="tag">
              <Select
                v-model="form.tag"
                :disabled="lang === 'en'"
                filterable
                remote
                :remote-method="debounce(remoteTagSearch, 800)"
                :loading="tagLoading"
                placeholder="Выберите тег"
              >
                <template v-for="(tag, index) in tags.filter((i) => i)">
                  <Option :key="index" :value="tag.value">
                    {{ tag.name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-fields-create__item" label="Активность" prop="active">
              <Checkbox v-model="form.active"></Checkbox>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Spin v-if="load" fix></Spin>
    </Card>

    <transition name="fade">
      <Card v-if="optionSelected" class="form-fields-create">
        <h3 class="form-fields-create__title">Опции</h3>
        <Row type="flex">
          <i-col span="24">
            <Row type="flex" :gutter="10">
              <i-col span="16">
                <Input
                  ref="optionInput"
                  v-model="value.value"
                  placeholder="Введите значение"
                  @on-enter="addValue(value)"
                />
              </i-col>
              <i-col span="4">
                <Button type="primary" long @click="addValue(value)"> Добавить значение </Button>
              </i-col>
              <i-col span="2">
                <Button long icon="md-arrow-round-up" @click="sortAsc"> А - Я </Button>
              </i-col>
              <i-col span="2">
                <Button long icon="md-arrow-round-down" @click="sortDesc"> Я - А </Button>
              </i-col>
            </Row>
          </i-col>
          <Container
            class="w-100 field-values"
            :get-child-payload="getPayload"
            drag-handle-selector=".handle"
            lock-axis="y"
            @drop="onDrop"
          >
            <Draggable v-for="(fieldValue, index) in values" :key="index">
              <i-col span="24">
                <Row type="flex" :gutter="10" class-name="field-values-row">
                  <i-col span="1" class-name="field-values__item field-values-row__handle c-move">
                    <Icon type="ios-menu" size="20" class="handle" />
                  </i-col>
                  <i-col span="13" class-name="field-values__item">
                    <Input v-model="fieldValue.value" />
                  </i-col>
                  <i-col span="9" class-name="field-values__item">
                    <Checkbox
                      v-model="fieldValue.default"
                      @on-change="selectDefaultOption($event, index)"
                    >
                      По-умолчанию
                    </Checkbox>
                  </i-col>
                  <i-col span="1" class-name="field-values__item">
                    <Icon
                      type="ios-close"
                      size="20"
                      color="#ed4014"
                      class="c-pointer"
                      @click="removeValue(index)"
                    />
                  </i-col>
                </Row>
              </i-col>
            </Draggable>
          </Container>
        </Row>
        <Spin v-if="load" fix></Spin>
      </Card>
    </transition>

    <Row type="flex" justify="end">
      <i-col :lg="3" :sm="6" class-name="form-fields-create-actions">
        <Button
          :disabled="load"
          class="form-fields-create-actions__btn"
          long
          @click="submitForm('fieldCreate', 'accept')"
        >
          Применить
        </Button>
      </i-col>
      <i-col v-if="!isLocal" :lg="3" :sm="6" class-name="form-fields-create-actions">
        <Button
          :disabled="load"
          type="primary"
          class="form-fields-create-actions__btn"
          long
          @click="submitForm('fieldCreate', 'save')"
        >
          Сохранить
        </Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { fieldTypes } from '@/filter-models/FormFields'
import { getTags } from '@/api/tags'
import { getAllValues } from '@/api/forms'
import { debounce } from '@/libs/util'
import { applyDrag } from './helpers'

export default {
  components: { Container, Draggable },
  props: {
    field: {
      type: Object,
      default: () => {
        return {}
      },
    },
    load: {
      type: Boolean,
      default: false,
    },
    isLocal: {
      type: Boolean,
      default: false,
    },
    localLang: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      types: fieldTypes,
      tagLoading: false,
      tags: [],
      values: [],
      tab: 0,
      availableLangs: ['ru', 'en'],
      value: {
        value: '',
        default: false,
        sort: 0,
        fieldId: null,
      },
      form: {
        name: '',
        type: '',
        help: '',
        placeholder: '',
        tag: '',
        active: '',
        location: 'global',
      },
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        type: [{ required: true, message: 'Это поле обязательно!' }],
        tag: [{ required: true, message: 'Это поле обязательно!' }],
      },
    }
  },
  computed: {
    optionSelected() {
      const possibleValues = ['checkbox', 'radio', 'select', 'multiselect']

      return possibleValues.includes(this.form.type)
    },
    lang() {
      if (this.localLang) {
        return this.localLang
      }
      return this.availableLangs[this.tab]
    },
  },
  watch: {
    values: {
      deep: true,
      handler(value) {
        if (value) {
          this.values.map((val, pos) => {
            val.sort = pos
          })
        }
      },
    },
    field: {
      immediate: true,
      async handler(value) {
        if (Object.keys(value).length > 0) {
          this.form = { ...value }

          if (value.hasOwnProperty('values')) {
            this.values = value.values || []
          } else {
            const params = { filter: { fieldId: value.id } }
            const { data } = await getAllValues(params)

            this.values = data
          }

          this.values.sort((a, b) => (a && b ? a.sort - b.sort : 0))
        }
      },
    },
  },
  methods: {
    selectDefaultOption(value, index) {
      this.values = this.values.map((val, pos) => {
        if (index === pos) {
          val.default = value
        } else {
          val.default = false
        }
        return val
      })
    },
    async validateForm(name) {
      const valid = await this.$refs[name].validate()
      return valid
    },
    async submitForm(formRef, action) {
      const valid = await this.validateForm(formRef)
      if (valid) {
        this.$emit('on-submit', [this.form, this.values, this.lang, action])
      }
    },
    async getTags(query) {
      this.tagLoading = true

      try {
        const params = {
          filter: [
            {
              slug: {
                ilike: query,
              },
            },
          ],
        }

        const { data } = await getTags(params)
        this.tags = data.map((item) => {
          return { name: item.slug, value: item.slug }
        })
        this.tagLoading = false
      } catch (e) {
        console.error(e)
        this.tagLoading = false
        throw new Error(e)
      }
    },
    addValue(value) {
      const cpValue = { ...value }

      if (cpValue.value !== '') {
        this.values.push(cpValue)
        this.value.value = ''
        this.$refs.optionInput.focus()
      }
    },
    removeValue(index) {
      const removed = this.values.find((item, pos) => pos === index)

      if (removed.id) {
        this.$emit('remove-value', removed.id)
      }

      this.values.splice(index, 1)
    },
    getPayload(index) {
      const item = this.values.find((item, pos) => index === pos)

      return item
    },
    onDrop(dropResult) {
      this.values = applyDrag(this.values, dropResult)
    },
    async remoteTagSearch(query) {
      const trimmedQuery = query.trim()

      if (trimmedQuery !== '') {
        await this.getTags(trimmedQuery)
      }
    },
    debounce(fn, time) {
      return debounce(fn, time)
    },
    changeFormLang() {
      this.$emit('change-lang', this.lang)
    },
    sortAsc() {
      const arr = [...this.values]
      arr.sort(({ value: a }, { value: b }) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
      let sort = 0
      this.values = arr.map((i) => ({ ...i, sort: sort++ }))
    },
    sortDesc() {
      const arr = [...this.values]
      arr.sort(({ value: a }, { value: b }) => (a.toLowerCase() < b.toLowerCase() ? 1 : -1))
      let sort = 0
      this.values = arr.map((i) => ({ ...i, sort: sort++ }))
    },
  },
}
</script>

<style lang="less">
@import './styles/Constructor.less';
</style>
