<template>
  <div v-if="productForm" class="product-form">
    <div class="product-form__content">
      <h3 class="product-form__title">{{ productForm.name }}</h3>
      <Form
        v-if="productForm"
        ref="productForm"
        :model="productForm"
        :rules="formRules"
        label-position="top"
      >
        <Row type="flex">
          <i-col span="24">
            <FormItem
              class="product-form__item"
              prop="name"
              label="Название"
              placeholder="Введите название товара"
            >
              <Input v-model="productForm.name" />
            </FormItem>
          </i-col>
          <i-col span="24">
            <FormItem
              class="product-form__item"
              prop="description"
              label="Описание товара"
              placeholder="Описание товара"
            >
              <Input v-model="productForm.description" type="textarea" autosize />
            </FormItem>
          </i-col>
          <i-col v-if="productForm.isRateBlocked" span="24">
            <div class="product-form__item rate-blocked">
              <div class="rate-blocked__text">
                Курс валют менялся слишком быстро, поэтому мы автоматически заблокировали все
                манипуляции с ценами. Чтобы разблокировать их нажмите на кнопку ниже
              </div>
              <Button type="error" long @click="unBlockProduct(productForm)">
                Разблокировать этот товар и пересчитать его цену по текущему курсу
              </Button>
            </div>
          </i-col>
        </Row>
        <Disabled :disabled="productForm.isRateBlocked">
          <Row>
            <i-col span="24">
              <FormItem prop="isCurrencyAllowed" class="product-form__item">
                <template #label>
                  <div style="text-align: left; line-height: 1.6">
                    Разрешить конвертировать цены в валюту по курсу ЦБ РФ
                  </div>
                  <div style="text-align: left; color: #8c8c8c; line-height: 1.6">
                    {{ usd ? `1 USD = ${usd} RUB` : '' }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                      eur ? `1 EUR = ${eur} RUB` : ''
                    }}
                  </div>
                </template>
                <i-switch
                  v-model="productForm.isCurrencyAllowed"
                  size="large"
                  :disabled="productForm.isRateBlocked"
                  @on-change="onCurrencyAllowedChange($event)"
                >
                  <span slot="open">Да</span>
                  <span slot="close">Нет</span>
                </i-switch>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="8">
              <FormItem
                class="product-form__item"
                prop="price"
                label="Стоимость"
                placeholder="Укажите цену"
              >
                <InputNumber
                  v-model="productForm.price"
                  :disabled="productForm.isRateBlocked"
                  @input="changePriceRub()"
                />
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem class="product-form__item" prop="currency">
                <template #label>
                  <div style="height: 12px"></div>
                </template>
                <Select
                  v-model="productForm.currency"
                  :disabled="!productForm.isCurrencyAllowed || productForm.isRateBlocked"
                  @input="changePriceRub()"
                >
                  <Option v-for="cur in currencies" :key="cur.label" :value="cur.label">
                    {{ cur.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <div class="product-form__item currency">
                <div class="currency__rub">
                  {{ productForm.priceRub + ' ' + CURRENCY_SYMBOL_ENUM.RUB }}
                </div>
                <div v-if="productForm.currency !== CURRENCY_ENUM.RUB" class="currency__cur">
                  {{ 0 + productForm.price + ' ' + CURRENCY_SYMBOL_ENUM[productForm.currency] }}
                </div>
              </div>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <div class="product-form__item convert">
                Если конвертация в валюте включена, то пользователь видит на сайте две цены: сначала
                в рублях, затем в выбранной валюте конвертации. Задать стоимость можно в любой
                валюте, конвертация произойдёт автоматически по текущему курсу ЦБ РФ. При
                выключенной конвертации, указание цены доступно только в рублях и у пользователя
                будет выводится только цена в рублях
              </div>
            </i-col>
          </Row>
        </Disabled>
        <Row>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              prop="type"
              label="Тип товара"
              placeholder="Выберите тип"
            >
              <Select v-model="productForm.type">
                <Option value="ticket"> {{ PRODUCT_TYPE_MAP.ticket }}</Option>
                <Option value="other"> {{ PRODUCT_TYPE_MAP.other }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              label="Максимальное кол-во товара в 1 заказе"
              placeholder=""
            >
              <Input
                v-model="productForm.orderLimitCount"
                :disabled="productForm.type === PRODUCT_TYPE_ENUM.TICKET"
              ></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              prop="limitCount"
              label="Общее количество товаров"
              placeholder=""
            >
              <Input v-model="productForm.limitCount" type="number"></Input>
            </FormItem>
          </i-col>
          <i-col span="12">
            <p class="convert" style="margin-top: 25px">
              Доступное для покупки кол-во товаров, будет видно всем пользователям сервиса
            </p>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              prop="sort"
              label="Сортировка"
              placeholder="Больше - вперед"
            >
              <Input v-model="productForm.sort" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem class="product-form__item" prop="active" label="Отображать в ЛК">
              <i-switch v-model="productForm.active" size="large">
                <span slot="open">Да</span>
                <span slot="close">Нет</span>
              </i-switch>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              prop="sellingStartedAt"
              label="Дата начала продажи"
            >
              <Input
                v-model="productForm.sellingStartedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="12-01-2020 18:00"
                style="width: 100%; text-align: center !important"
              />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem
              class="product-form__item"
              prop="sellingClosedAt"
              label="Дата окончания продажи"
            >
              <Input
                v-model="productForm.sellingClosedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="24-01-2020 18:00"
                style="width: 100%; text-align: center !important"
              />
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="productForm.id" class="product-form__access-event" :gutter="16">
          <i-col span="17">
            <FormItem prop="startSellingAt" label="Выдача доступа к:">
              <Select v-model="productForm.accessPages" multiple>
                <Option v-for="(page, i) in pages" :key="i" :value="page.id">
                  {{ page.title }}</Option
                >
              </Select>
            </FormItem>
          </i-col>
          <i-col span="7">
            <p class="convert">
              Удаление товара или выключение его активности, не влияет на уже выданные доступы
            </p>
          </i-col>
        </Row>
      </Form>
    </div>
    <div v-if="productForm" class="product-form__footer">
      <div class="product-form__btn-block">
        <div>
          <Button
            v-if="productForm.id"
            class="product-form__btn-save"
            type="primary"
            @click="updateProduct(productForm)"
          >
            Сохранить
          </Button>
          <Button
            v-else
            class="product-form__btn-save"
            type="primary"
            @click="createProduct(productForm)"
          >
            Создать
          </Button>
          <Button @click="cancelEdit"> Отменить </Button>
        </div>
        <div>
          <Button
            v-if="productForm.id"
            type="error"
            class="product-form__btn-del"
            @click="deleteProduct(productForm)"
          >
            Удалить
          </Button>
        </div>
        <Spin v-if="load" fix />
      </div>
    </div>
  </div>
</template>

<script>
import {
  CURRENCY_ENUM,
  CURRENCY_SYMBOL_ENUM,
  PRODUCT_TYPE_ENUM,
  PRODUCT_TYPE_MAP,
} from '@/libs/constants'
import { createProduct, updateProduct, deleteProduct } from '@/api/products'
import { fromStringToISO } from '@/libs/util'
const DATE_FORMAT = 'dd-MM-yyyy HH:mm'
const DATE_FIELD_NAMES = ['sellingClosedAt', 'sellingStartedAt']

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    usd: { type: String, default: '' },
    eur: { type: String, default: '' },
    pages: { type: Array, default: () => [] },
    load: { type: Boolean },
    currencies: { type: Array, default: () => [] },
  },
  data() {
    return {
      CURRENCY_ENUM,
      CURRENCY_SYMBOL_ENUM,
      PRODUCT_TYPE_ENUM,
      PRODUCT_TYPE_MAP,
    }
  },
  computed: {
    // todo: мутация компьютед свойства без сеттера
    productForm() {
      return this.product
    },
    formRules() {
      return {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        price: [
          { required: true, message: 'Это поле обязательно!' },
          {
            validator: (rule, value) => value > 0,
            message: 'Цена должна быть больше 0',
          },
        ],
        sort: [{ required: true, message: 'Это поле обязательно!' }],
        type: [{ required: true, message: 'Это поле обязательно!' }],
        sellingStartedAt: [
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        sellingClosedAt: [
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
      }
    },
  },
  watch: {
    'productForm.type'(val) {
      if (val === PRODUCT_TYPE_ENUM.TICKET) {
        this.productForm.orderLimitCount = 1
      }
    },
  },
  methods: {
    async updateProduct() {
      const valid = await this.$refs.productForm.validate()
      if (valid) {
        try {
          await updateProduct(this.productForm.id, this.covertStrDateToISO(this.productForm))
          this.$Message.success('Продукт успешно обновлен')
          this.$emit('update', this.productForm)
          this.cancelEdit()
        } catch (e) {
          console.error(e)
        }
      } else {
        this.$Message.error('Заполните обязательные поля')
      }
    },
    async createProduct() {
      const valid = await this.$refs.productForm.validate()
      if (valid) {
        try {
          await createProduct(this.covertStrDateToISO(this.productForm))
          this.$Message.success('Продукт успешно создан')
          this.$emit('update', this.productForm)
          this.cancelEdit()
        } catch (e) {
          console.error(e)
        }
      } else {
        this.$Message.error('Заполните обязательные поля')
      }
    },
    async deleteProduct() {
      try {
        await deleteProduct(this.productForm.id)
        this.$Message.success('Продукт успешно удален')
        this.$emit('update', this.productForm)
        this.cancelEdit()
      } catch (e) {
        console.error(e)
      }
    },

    cancelEdit() {
      this.$emit('cancel')
    },
    covertStrDateToISO(entity) {
      return Object.fromEntries(
        Object.entries(entity).map(([key, value]) => {
          if (DATE_FIELD_NAMES.includes(key) && value) {
            return [key, fromStringToISO(value)]
          }
          return [key, value]
        })
      )
    },
    unBlockProduct() {
      this.productForm.isRateBlocked = false
      this.$emit('unblock')
    },
    changePriceRub() {
      const currentCurrency = this.currencies.find((c) => c.label === this.productForm.currency)

      if (currentCurrency && currentCurrency.value) {
        this.productForm.priceRub = (this.productForm.price * currentCurrency.value).toFixed(2)
      }
    },
    onCurrencyAllowedChange($event) {
      if (!$event) {
        this.productForm.currency = CURRENCY_ENUM.RUB
        this.changePriceRub(this.productForm)
      }
    },
  },
}
</script>
