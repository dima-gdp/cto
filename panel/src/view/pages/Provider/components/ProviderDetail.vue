<template>
  <div class="provider-page">
    <Row :gutter="15">
      <i-col span="6">
        <Card title="Провайдер оплаты" class="provider-page__card" icon="ios-card">
          <Form ref="form" :model="form" :rules="ruleValidate" label-position="top">
            <FormItem label="Название:" prop="name">
              <Input v-model="form.name" placeholder="Введите название"></Input>
            </FormItem>
            <FormItem label="Тип провайдера:" prop="provider">
              <Select
                v-model="form.provider"
                placeholder="выберите провайдера"
                clearable
                @on-change="changeProvider"
                @on-clear="clearProvider"
              >
                <Option v-for="item in payments" :key="item.provider" :value="item.value">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </Form>
          <Spin v-if="load" fix></Spin>
        </Card>
        <div class="provider-page__btn-block">
          <Button type="primary" long @click="handleSave(true, 'save')"> Сохранить </Button>
          <Button long @click="handleSave(false, 'accept')">Применить</Button>
          <Button v-if="edit" type="error" ghost long @click="handleDelete"> Удалить </Button>
        </div>
      </i-col>
      <i-col v-if="currentProvider" span="10">
        <Form
          ref="formProvider"
          :model="formProvider"
          :rules="providerValidate"
          label-position="top"
        >
          <Card
            v-if="currentProvider.value === 'yandex' || currentProvider.provider === 'yandex'"
            :title="currentProvider.name"
            icon="ios-settings-outline"
          >
            <Row :gutter="15">
              <i-col span="12">
                <FormItem label="ID магазина" prop="shop_id">
                  <Input
                    v-model.number="formProvider.shop_id"
                    placeholder="введите id магазина в я.кассе"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Секретный ключ" prop="secret_key">
                  <Input
                    v-model="formProvider.secret_key"
                    placeholder="введите секретный ключ"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Способы оплаты" prop="payment_methods">
                  <Select
                    v-model="formProvider.payment_methods"
                    placeholder="выберите способы  оплаты"
                    clearable
                    multiple
                  >
                    <Option v-for="(item, key) of payment_methods" :key="key" :value="item.key">
                      {{ item.title }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
          </Card>
          <Card
            v-if="currentProvider.value === 'invoice' || currentProvider.provider === 'invoice'"
            :title="currentProvider.name"
            icon="ios-settings-outline"
          >
            <Row :gutter="15">
              <i-col span="12">
                <FormItem label="ИНН" prop="inn">
                  <Input v-model="formProvider.inn" placeholder="введите ИНН"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="КПП" prop="kpp">
                  <Input v-model="formProvider.kpp" placeholder="введите КПП"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="БИК" prop="bik">
                  <Input v-model="formProvider.bik" placeholder="введите БИК"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Кор.счет" prop="correspondent_account">
                  <Input
                    v-model="formProvider.correspondent_account"
                    placeholder="введите Кор.счет"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Расчетный счет" prop="checking_account">
                  <Input
                    v-model="formProvider.checking_account"
                    placeholder="введите Расчетный счет"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Название банка" prop="bank_name">
                  <Input
                    v-model="formProvider.bank_name"
                    placeholder="введите Название банка"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Адрес юр.лица" prop="address">
                  <Input v-model="formProvider.address" placeholder="введите Адрес юр.лица"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Номер телефона" prop="phone">
                  <Input v-model="formProvider.phone" placeholder="введите Номер телефона"></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="ФИО генерального директора" prop="general_director_fullname">
                  <Input
                    v-model="formProvider.general_director_fullname"
                    placeholder="введите ФИО генерального директора"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="Название компании" prop="company_name">
                  <Input
                    v-model="formProvider.company_name"
                    placeholder="введите название компании"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="НДС (есть/нет)" prop="nds">
                  <Checkbox v-model="formProvider.nds"></Checkbox>
                </FormItem>
              </i-col>
            </Row>
          </Card>
        </Form>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { getTypeProviders, infoPayment } from '@/api/payments'
export default {
  props: {
    edit: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      payments: null,
      form: {
        name: '',
        provider: '',
        legal_entity_id: this.$route.params.id,
      },
      ruleValidate: {
        name: [{ required: true, message: 'Не может быть пустым полем', trigger: 'blur' }],
        provider: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
      },
      formProvider: {
        nds: false,
      },
      providerValidate: {},
      providerRules: {
        yandexValidate: {
          provider: [{ required: true, message: 'Не может быть пустым полем', trigger: 'change' }],
          name: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          shop_id: [
            {
              required: true,
              message: 'Имя не может быть пустым',
              trigger: 'blur',
              type: 'number',
            },
          ],
          secret_key: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          payment_methods: [
            { required: true, message: 'Не может быть пустым', trigger: 'change', type: 'array' },
          ],
        },
        invoiceValidate: {
          type: [{ required: true, message: 'Не может быть пустым полем', trigger: 'change' }],
          technicalName: [
            { required: true, message: 'Имя не может быть пустым', trigger: 'change' },
          ],
          inn: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          kpp: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          bik: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          correspondent_account: [
            { required: true, message: 'Имя не может быть пустым', trigger: 'blur' },
          ],
          checking_account: [
            { required: true, message: 'Имя не может быть пустым', trigger: 'blur' },
          ],
          bank_name: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          address: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          phone: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
          general_director_fullname: [
            { required: true, message: 'Имя не может быть пустым', trigger: 'blur' },
          ],
          company_name: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
        },
      },
      load: false,
      currentProvider: null,
      payment_methods: [],
    }
  },
  created() {
    this.getPayments()
    this.getProvider()
  },
  methods: {
    getPayments() {
      this.loading = true
      getTypeProviders()
        .then((res) => {
          // todo api не по спецификациии
          this.payments = res.data.data
          this.load = false
          this.payment_methods = this.payments.yandex.meta.availablePaymentMethods
        })
        .catch((e) => {
          console.error(e)
        })
    },
    changeProvider() {
      for (const index in this.payments) {
        const item = this.payments[index]
        if (this.form.provider === item.value) {
          this.currentProvider = item
          this.currentProvider.settings = item.meta.availablePaymentMethods
          if (this.form.provider === 'yandex') {
            this.providerValidate = this.providerRules.yandexValidate
          } else if (this.form.provider === 'invoice') {
            this.providerValidate = this.providerRules.invoiceValidate
          }
        }
      }
    },
    clearProvider() {
      this.currentProvider = null
    },
    getProvider() {
      if (this.edit) {
        this.load = true
        infoPayment(this.$route.params.id)
          .then((res) => {
            this.form = res.data
            this.currentProvider = res.data
            this.formProvider = res.data.settings
            // здесь покится костыль т.к. данные приходят не по спецификации из сторки (209) от этого места
            // Берем ключ обьекта и форматируем его из CamelCase  в camel_case функцией formatKey
            const formProviderFormat = {}
            for (const key in this.formProvider) {
              formProviderFormat[this.formatKey(key)] = this.formProvider[key]
              // delete this.formProvider[key]
            }
            this.formProvider = { ...formProviderFormat }
            // до этого
            if (this.currentProvider.provider === 'yandex') {
              this.providerValidate = this.providerRules.yandexValidate
              this.formProvider.shop_id = +this.formProvider.shop_id
            } else if (this.currentProvider.provider === 'invoice') {
              this.providerValidate = this.providerRules.invoiceValidate
            }
            this.load = false
          })
          .catch((e) => {
            console.error(e)
          })
      }
    },
    handleSave(redirect, action) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs['formProvider'].validate((valid) => {
            if (valid) {
              this.form.settings = this.formProvider
              if (this.form.provider === 'invoice') {
                this.form.settings.payment_methods = ['invoice']
              }
              this.$emit('on-save', this.form, redirect, action)
            } else {
              this.$Message.error('В форме есть ошибки!')
            }
          })
        } else {
          this.$Message.error('В форме есть ошибки!')
        }
      })
    },
    formatKey(key) {
      const arr = key.split('')
      const resultArr = arr.map((char) => {
        if (char !== char.toLocaleLowerCase()) {
          return `_${char.toLowerCase()}`
        }
        return char
      })
      return resultArr.join('')
    },
    handleDelete() {
      this.$Modal.confirm({
        title: 'Удаление',
        content: '<p>Вы уверены что хотите удалить Провайдера ?</p><p>Это действие необратимо!</p>',
        onOk: () => {
          this.$emit('on-delete', this.form)
        },
      })
    },
  },
}
</script>
