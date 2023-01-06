<template>
  <div>
    <!-- Form header -->
    <Row type="flex" class-name="store-form-header">
      <i-col>
        <Tabs
          v-model="tab"
          :animated="false"
          class="store-form-header__item"
          @on-click="changeFormLang"
        >
          <TabPane label="RU" :disabled="load"></TabPane>
          <TabPane label="EN" :disabled="load"></TabPane>
        </Tabs>
      </i-col>
    </Row>

    <!-- Main form -->
    <Row type="flex" class-name="store-form">
      <i-col span="24">
        <Card>
          <Row type="flex" justify="space-between" class-name="store-form__title">
            <h3 v-if="value.id">Редактирование магазина</h3>
            <h3 v-else>Создание магазина</h3>
            <Button v-if="type === 'update'" type="error" size="small" ghost @click="deleteStore">
              <Icon type="ios-trash-outline" />
            </Button>
          </Row>

          <!-- Form -->
          <Form ref="storeForm" :model="form" :rules="formRules" label-position="top">
            <Row type="flex" :gutter="12">
              <i-col :lg="8" :md="24" :sm="24">
                <FormItem label="Дата начала продаж" prop="sellingStartedAt">
                  <Input
                    v-model="form.sellingStartedAt"
                    v-mask="'##-##-#### ##:##'"
                    type="text"
                    placeholder="Введите дату начала"
                    style="width: 100%; text-align: center !important"
                  />
                </FormItem>
              </i-col>

              <i-col :lg="8" :md="24" :sm="24">
                <FormItem label="Дата окончания продаж" prop="sellingClosedAt">
                  <Input
                    v-model="form.sellingClosedAt"
                    v-mask="'##-##-#### ##:##'"
                    type="text"
                    placeholder="Введите дату окончания"
                    style="width: 100%; text-align: center !important"
                  />
                </FormItem>
              </i-col>

              <i-col :lg="8" :md="24" :sm="24">
                <FormItem label="Юридическое лицо" prop="legalEntity">
                  <Select
                    v-model="form.legalEntity"
                    placeholder="Выберите юр.лицо"
                    filterable
                    not-found-text="Ничего не найдено"
                    @on-change="clearProviders"
                  >
                    <Option v-for="item in legalEntities" :key="item.id" :value="+item.id">
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>

              <i-col :lg="8" :md="24" :sm="24">
                <FormItem class="store-form__item" label="Провайдеры оплат" prop="paymentProviders">
                  <Select
                    v-model="form.paymentProviders"
                    multiple
                    placeholder="Выберите провайдеров"
                  >
                    <Option v-for="item in providers" :key="item.id" :value="+item.id">
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>

              <i-col :lg="4" :md="24" :sm="24">
                <FormItem class="store-form__item" label="Отображать в лк" prop="active">
                  <i-switch v-model="form.active" size="large">
                    <span slot="open">Да</span>
                    <span slot="close">Нет</span>
                  </i-switch>
                </FormItem>
              </i-col>

              <i-col :lg="24" :md="24" :sm="24">
                <FormItem
                  class="store-form__item"
                  label="Текстовое описание магазина"
                  prop="description"
                >
                  <MarkdownEditor v-model="form.description" autoinit />
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
    </Row>

    <slot name="rateAlert"></slot>

    <slot v-if="type === 'update'" name="products"></slot>

    <!-- Actions -->
    <Row type="flex" justify="end">
      <SavePanel @save="submitStoreForm('save')" @apply="submitStoreForm('accept')"> </SavePanel>
    </Row>
  </div>
</template>

<script>
import MarkdownEditor from '_c/markdown'
import SavePanel from '@/components/save-panel/save-panel'

export default {
  components: {
    MarkdownEditor,
    SavePanel,
  },
  props: {
    value: { type: Object, required: true },
    legalEntities: { type: Array, default: () => [] },
    paymentProviders: { type: Array, default: () => [] },
    load: { type: Boolean },
  },
  data() {
    return {
      form: {
        sellingStartedAt: '',
        sellingClosedAt: '',
        paymentProviders: [],
        active: true,
        description: '',
        legalEntity: '',
        lang: 'ru',
        currency: 'RUB',
        eventId: this.$route.params.id,
      },
      formRules: {
        // TODO: лучше провалидировать даты
        sellingStartedAt: [
          { required: true, message: 'Это поле обязательно!' },
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        sellingClosedAt: [
          { required: true, message: 'Это поле обязательно!' },
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        paymentProviders: [{ required: true, message: 'Это поле обязательно!' }],
        active: [{ required: true, message: 'Это поле обязательно!' }],
        legalEntity: [{ required: true, message: 'Это поле обязательно!' }],
      },
      tab: 0,
      availableLangs: ['ru', 'en'],
    }
  },
  computed: {
    type() {
      if (this.value.hasOwnProperty('id')) {
        return 'update'
      } else {
        return 'create'
      }
    },
    lang() {
      return this.availableLangs[this.tab]
    },
    providers() {
      return this.paymentProviders
        ? this.paymentProviders.filter((i) => i.legalEntityId === this.form.legalEntity)
        : []
    },
    eventId() {
      return this.$route.params.id
    },
  },
  watch: {
    lang(value) {
      if (value) {
        this.$emit('change-lang', this.availableLangs[this.tab])
      }
    },
    value: {
      handler: function (value) {
        if (value) {
          this.initForm()
        }
      },
    },
    'value.providers': {
      handler(newValue) {
        if (this.value.providers) {
          this.form.legalEntity = newValue.find((item) => item.legalEntityId).legalEntityId
        }
      },
    },
  },
  methods: {
    async submitStoreForm(action, type = this.type) {
      const isStoreValid = await this.$refs.storeForm.validate()

      if (isStoreValid) {
        this.$emit('on-submit', [this.form, action, type])
      }
    },
    clearProviders() {
      this.form.paymentProviders = []
    },
    deleteStore() {
      this.$emit('on-delete', this.value.id)
    },
    changeFormLang(selected) {
      this.form.lang = this.availableLangs[selected]
    },
    fromStamp(stamp) {
      return this.$luxon.DateTime.fromSeconds(+stamp).toFormat('dd-MM-yyyy HH:mm')
    },
    initForm() {
      if (this.type === 'update') {
        // TODO: переписать декларативнее
        for (const key in this.value) {
          this.form[key] = this.value[key]

          switch (key) {
            case 'sellingStartedAt':
              this.$set(this.form, 'storeDateStart', this.fromStamp(this.value[key]))
              break
            case 'sellingClosedAt':
              this.$set(this.form, 'storeDateEnd', this.fromStamp(this.value[key]))
              break
            default:
              break
          }
        }
      }
    },
  },
}
</script>

<style lang="less">
@import './StoreForm.less';
</style>
