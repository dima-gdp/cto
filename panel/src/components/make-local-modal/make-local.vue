<!--TODO: Поправить мутации пропсов-->
<!--eslint-disable vue/no-mutating-props -->
<template>
  <Modal
    v-model="showModal"
    :title="modalTitle"
    ok-text="Сохранить"
    cancel-text="Отменить"
    :width="1200"
    @on-ok="onOk()"
    @on-cancel="onCancel()"
  >
    <div class="make-local">
      <h3 class="make-local__title">Поле</h3>
      <Form ref="fieldCreate" :model="field" :rules="formRules" label-position="top">
        <Row type="flex" :gutter="15">
          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Название" prop="name">
              <Input v-model="field.name" placeholder="Введите название поля" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Тип поля" prop="type">
              <Select
                v-model="field.type"
                :disabled="lang === 'en'"
                placeholder="Выберите тип поля"
              >
                <template v-for="(item, index) in types">
                  <Option :key="index" :value="item.value">
                    {{ item.name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Подсказка" prop="help">
              <Input v-model="field.help" placeholder="Введите подсказку" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Заполнитель" prop="placeholder">
              <Input v-model="field.placeholder" placeholder="Заполнитель по умолчанию" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Tag" prop="tag">
              <Select
                v-if="showModal"
                v-model="field.tag"
                :disabled="lang === 'en'"
                filterable
                remote
                :remote-method="debounce(remoteTagSearch, 800)"
                :loading="tagLoading"
                placeholder="Выберите тег"
              >
                <template v-for="(item, index) in tags">
                  <Option :key="index" :value="item.value">
                    {{ item.name }}
                  </Option>
                </template>
              </Select>
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="make-local__item" label="Активность" prop="active">
              <Checkbox v-model="field.active"></Checkbox>
            </FormItem>
          </i-col>
        </Row>
      </Form>

      <template v-if="canHaveValues">
        <h3 class="make-local__title">Опции</h3>
        <div class="make-local-options">
          <Row type="flex" :gutter="15" style="margin-bottom: 15px">
            <i-col span="16">
              <Input
                ref="optionInput"
                v-model="newValue.value"
                placeholder="Введите значение"
                @on-enter="addValue(newValue)"
              />
            </i-col>
            <i-col span="4">
              <Button type="primary" long @click="addValue(newValue)"> Добавить значение </Button>
            </i-col>
            <i-col span="2">
              <Button long icon="md-arrow-round-up" @click="$emit('sort-asc')"> А - Я </Button>
            </i-col>
            <i-col span="2">
              <Button long icon="md-arrow-round-down" @click="$emit('sort-desc')"> Я - А </Button>
            </i-col>
          </Row>
          <draggable
            :list="field.values"
            handle=".make-local-options__handle"
            v-bind="{ animation: 150 }"
          >
            <!--  TODO: переменная value уже объявлена в props-->
            <!-- eslint-disable-next-line vue/no-template-shadow -->
            <div v-for="(value, index) in field.values" :key="value.id">
              <Row type="flex" :gutter="10" class-name="make-local-row">
                <i-col
                  span="1"
                  class-name="make-local-options__item make-local-options__handle c-move"
                >
                  <Icon type="ios-menu" size="20" class="handle" />
                </i-col>
                <i-col span="13" class-name="make-local-options__item">
                  <Input v-model="value.value" />
                </i-col>
                <i-col span="9" class-name="make-local-options__item">
                  <Checkbox
                    v-model="value.default"
                    @on-change="selectDefaultOption($event, field.values, index)"
                  >
                    По-умолчанию
                  </Checkbox>
                </i-col>
                <i-col span="1" class-name="make-local-options__item">
                  <Icon
                    type="ios-close"
                    size="20"
                    color="#ed4014"
                    class="c-pointer"
                    @click="deleteValue(value, index)"
                  />
                </i-col>
              </Row>
            </div>
          </draggable>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script>
// TODO: Поправить мутации пропсов
/* eslint-disable vue/no-mutating-props */
import cloneDeep from 'lodash.clonedeep'
import draggable from 'vuedraggable'
import { getTags } from '@/api/tags'
import { debounce } from '@/libs/util'
import { fieldTypes } from '@/filter-models/FormFields'
import { deleteValue } from '@/api/forms'

export default {
  components: {
    draggable,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    field: {
      type: Object,
      required: true,
    },
    lang: {
      type: String,
      default: 'ru',
    },
  },
  data() {
    return {
      types: fieldTypes,
      tags: [],
      newValue: { value: '' },
      tagLoading: false,
      f: {},
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        type: [{ required: true, message: 'Это поле обязательно!' }],
        tag: [{ required: true, message: 'Это поле обязательно!' }],
      },
    }
  },
  computed: {
    showModal: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    isLocal() {
      return this.field.location === 'local'
    },
    modalTitle() {
      return this.isLocal ? 'Редактирование локального поля' : 'Создание локального поля'
    },
    canHaveValues() {
      const { type } = this.field

      return ['select', 'multiselect', 'checkbox', 'radio'].includes(type)
    },
  },
  watch: {
    field: {
      deep: true,
      handler(newValue) {
        if (newValue.values) {
          newValue.values.forEach((val, index) => {
            val.sort = index
          })
        }
      },
    },
  },
  methods: {
    async onOk() {
      const valid = await this.$refs['fieldCreate'].validate()
      if (valid) {
        const copyField = cloneDeep(this.field)
        this.$emit('on-save', copyField)
      }
      // this.$emit('input', false)
    },
    onCancel() {
      console.info('cancel')
    },
    async getTags(query) {
      const params = {
        'per-page': 0,
        filter: [
          {
            slug: {
              ilike: query,
            },
          },
        ],
      }
      this.tagLoading = true
      const { data } = await getTags(params)
      this.tags = data.map((item) => {
        return { name: item.slug, value: item.slug }
      })
      this.tagLoading = false
    },
    async remoteTagSearch(query) {
      const trimedQuery = query.trim()

      if (trimedQuery !== '') {
        this.getTags(trimedQuery)
      }
    },
    debounce(fn, time) {
      return debounce(fn, time)
    },
    addValue(value, event) {
      const cpValue = cloneDeep({ ...value, fieldId: +this.field.id, default: false })

      if (!this.field.hasOwnProperty('values')) {
        this.$set(this.field, 'values', [])
      }

      if (value.value !== '') {
        this.field.values.push(cpValue)
        value.value = ''
        this.$refs.optionInput.focus()
      }

      console.info(this.field)
    },
    removeValue(index) {
      const removed = this.values.find((item, pos) => pos === index)

      if (removed.id) {
        this.$emit('remove-value', removed.id)
      }

      this.values.splice(index, 1)
    },
    selectDefaultOption(value, values, index) {
      values = values.map((val, pos) => {
        if (index === pos) {
          val.default = value
        } else {
          val.default = false
        }

        return val
      })
    },
    async deleteValue(value, index) {
      const { location } = this.field
      const { id } = value

      if (location === 'global') {
        this.field.values.splice(index, 1)
        return
      }

      if (id) {
        await deleteValue(id)
      }
      this.field.values.splice(index, 1)
    },
  },
}
</script>

<style lang="less">
@import 'make-local';
</style>
