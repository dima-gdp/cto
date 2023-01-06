<template>
  <Row type="flex" class-name="products-list" :gutter="16">
    <i-col v-for="(item, index) in products" :key="index" span="8">
      <ProductCard
        :product="item"
        :usd="usdRate"
        :eur="eurRate"
        :currencies="currencies"
        class="products-list__item product-item"
        @edit="openDetail"
      >
      </ProductCard>
    </i-col>
    <i-col span="8" style="display: flex">
      <div class="products-list-item-add" @click="addProduct">
        <Icon type="ios-add" />
        <h3>Добавить товар</h3>
        <Spin v-if="load" fix />
      </div>
    </i-col>
    <Drawer v-model="showDetail" :closable="true" width="640">
      <ProductForm
        v-if="currentProduct"
        :product="currentProduct"
        :usd="usdRate"
        :eur="eurRate"
        :pages="pages"
        :load="load"
        :currencies="currencies"
        @update="updateStore"
        @cancel="cancelEdit"
        @unblock="unBlockProduct"
      >
      </ProductForm>
    </Drawer>
  </Row>
</template>

<script>
import { getCurrencies } from '@/api/stores'
import ProductCard from './product-card'
import ProductForm from './product-form'
import { CURRENCY_ENUM, CURRENCY_SYMBOL_ENUM, PRODUCT_TYPE_ENUM } from '@/libs/constants'

export default {
  components: {
    ProductCard,
    ProductForm,
  },
  props: {
    value: { type: Array, required: true },
    load: { type: Boolean },
    storeId: { type: [String, Number], required: true },
    pages: { type: Array, default: () => [] },
  },
  data() {
    return {
      productModel: {
        name: '',
        description: '',
        storeId: this.storeId,
        price: 0,
        priceRub: 0,
        currency: CURRENCY_ENUM.RUB,
        isCurrencyAllowed: false,
        isRateBlocked: false,
        sort: 100,
        active: false,
        type: PRODUCT_TYPE_ENUM.TICKET,
        sellingStartedAt: '',
        sellingClosedAt: '',
        accessPages: [],
        orderLimitCount: 1,
      },
      currencies: [{ id: 0, label: CURRENCY_ENUM.RUB, value: 1 }],
      CURRENCY_ENUM,
      CURRENCY_SYMBOL_ENUM,
      showDetail: false,
      currentProduct: null,
      oldStateProducts: null,
      currentId: null,
    }
  },

  computed: {
    usdRate() {
      const rate = this.currencies.find((c) => c.label === CURRENCY_ENUM.USD)
      return rate ? rate.value.toFixed(2) : ''
    },
    eurRate() {
      const rate = this.currencies.find((c) => c.label === CURRENCY_ENUM.EUR)
      return rate ? rate.value.toFixed(2) : ''
    },
    products() {
      return this.value
    },
  },
  mounted() {
    this.getCurrencies()
  },
  methods: {
    async getCurrencies() {
      const { data } = await getCurrencies()
      this.currencies = [...this.currencies, ...data]
    },

    addProduct() {
      this.showDetail = true
      this.currentProduct = { ...this.productModel, storeId: this.storeId }
    },
    openDetail(productId) {
      this.currentId = productId
      const currentProduct = this.products.find((item) => item.id === productId)
      this.currentProduct = Object.assign({}, currentProduct)
      this.showDetail = !this.showDetail
    },
    cancelEdit() {
      this.showDetail = false
    },

    updateStore(product) {
      this.$emit('on-update', product)
      this.showDetail = false
    },

    unBlockProduct() {
      this.$emit('unblock')
    },
  },
}
</script>

<style lang="less">
@import './Products.less';

.ivu-input-number {
  width: 100%;
}

.convert {
  font-size: 12px;
  color: #8c8c8c;
}

.currency {
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: max-content max-content;

  &__rub {
    font-size: 30px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
  }

  &__cur {
    font-size: 30px;
    color: #8c8c8c;
    font-weight: bold;
  }
}

.rate-blocked {
  &__text {
    font-size: 12px;
    color: #ff4d4f;
    padding-bottom: 10px;
  }
}

.product-form__access-event {
  display: flex;
  align-items: center;
}

.product-form {
  position: relative;
  display: flex;
  flex-direction: column;
  &__content {
    height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
  }

  &__title {
    margin-bottom: 20px;
  }

  &__footer {
    display: flex;
    height: 60px;
    width: 100%;
    align-items: center;
  }

  &__btn-block {
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
  }

  &__btn-save {
    margin-right: 10px;
  }
}
</style>
