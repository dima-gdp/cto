<template>
  <div>
    <Card class="product-item__card">
      <div class="product-item__top-info">
        <h3 class="product-item__title">{{ product.name }}</h3>
        <p class="product-item__description">{{ product.description }}</p>
        <div class="product-item__info">
          <div class="product-item__row">
            <div class="product-item__info-title">Тип товара</div>
            <div class="product-item__info-value">{{ PRODUCT_TYPE_MAP[product.type] }}</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Товаров в 1 заказе</div>
            <div v-if="product.orderLimitCount" class="product-item__info-value">
              {{ product.orderLimitCount }}
            </div>
            <div v-else class="product-item__info-value">Не ограничено</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Общее кол-во товаров</div>
            <div class="product-item__info-value">{{ product.limitCount }}</div>
          </div>
          <div v-if="product.sellingCount" class="product-item__row">
            <div class="product-item__info-title">Куплено</div>
            <div
              class="product-item__info-value"
              :class="
                product.limitCount && product.sellingCount > product.limitCount
                  ? 'product-item__info-value_danger'
                  : ' '
              "
            >
              {{ product.sellingCount }}
            </div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Сортировка</div>
            <div class="product-item__info-value">{{ product.sort }}</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Разрешить конвертацию</div>
            <div v-if="product.isCurrencyAllowed" class="product-item__info-value">Да</div>
            <div v-else class="product-item__info-value">Нет</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Отображать в ЛК</div>
            <div v-if="product.active" class="product-item__info-value">Да</div>
            <div v-else class="product-item__info-value">Нет</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Начало продаж</div>
            <div class="product-item__info-value">{{ product.sellingStartedAt }}</div>
          </div>
          <div class="product-item__row">
            <div class="product-item__info-title">Окончание продаж</div>
            <div class="product-item__info-value">{{ product.sellingClosedAt }}</div>
          </div>
        </div>
      </div>
      <div class="product-item__bottom-info">
        <div class="product-item__price-block">
          <div class="product-item__price">{{ price }} {{ CURRENCY_SYMBOL_ENUM.RUB }}</div>
          <div v-if="product.currency !== CURRENCY_ENUM.RUB" class="product-item__usd">
            {{ 0 + product.price + ' ' + CURRENCY_SYMBOL_ENUM[product.currency] }}
          </div>
        </div>
        <Button type="text" class="product-item__btn" @click="openDetail(product.id)">
          Изменить</Button
        >
      </div>
    </Card>
  </div>
</template>
<script>
import { CURRENCY_SYMBOL_ENUM, PRODUCT_TYPE_MAP, CURRENCY_ENUM } from '@/libs/constants'

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    usd: { type: String, default: '' },
    eur: { type: String, default: '' },
    currencies: { type: Array, default: () => [] },
  },
  data() {
    return {
      CURRENCY_SYMBOL_ENUM,
      PRODUCT_TYPE_MAP,
      CURRENCY_ENUM,
    }
  },
  computed: {
    price() {
      const currentCurrency = this.currencies.find((c) => c.label === this.product.currency)
      if (currentCurrency) {
        const price = (this.product.price * currentCurrency.value).toFixed(2)
        return price
      }
      return null
    },
  },
  methods: {
    openDetail(id) {
      this.$emit('edit', id)
    },
  },
}
</script>
<style lang="less">
.product-item {
  &__card {
    .ivu-card-body {
      min-height: 376px;
      display: flex;
      height: 100%;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  &__title {
    margin-bottom: 10px;
  }

  &__description {
    margin-bottom: 10px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &__info-title {
    font-weight: bold;
  }

  &__info {
    margin-bottom: 10px;
  }

  &__price {
    font-weight: bold;
    font-size: 24px;
  }

  &__bottom-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    margin-right: 20px;
  }

  &__usd {
    margin-right: 10px;
  }

  &__usd,
  &__eur {
    color: #adb5bd;
  }

  &__price-block {
    display: flex;
    align-items: center;
  }

  &__btn {
    color: #0d6efd;
  }

  &__info-value {
    &_danger {
      color: #ed4014;
    }
  }

  margin-bottom: 16px;
}
</style>
