<template>
  <div class="shop-ticket__price">
    <div class="shop-ticket__price-rub">
      {{ priceInRub }}
    </div>
    <div v-if="priceInCurrency" class="shop-ticket__price-cur">
      <span style="margin-right: 5px">
        {{ priceInCurrency }}
      </span>
      <Poptip :content="popTipText" width="270" placement="top">
        <div class="shop-ticket__price-help">
          <feather
            style="position: relative; top: 2px"
            type="help-circle"
            size="16"
            stroke="var(--s-black-color-80)"
          />
        </div>
      </Poptip>
    </div>
  </div>
</template>
<script>
import { CURRENCY_ENUM, CURRENCY_SYMBOL_ENUM } from '@/utils/constants'

export default {
  props: {
    priceRub: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  computed: {
    priceInRub() {
      return `${this.priceRub} ${CURRENCY_SYMBOL_ENUM.RUB}`
    },
    priceInCurrency() {
      if (this.currency !== CURRENCY_ENUM.RUB) {
        return `${this.price} ${CURRENCY_SYMBOL_ENUM[this.currency]}`
      }
      return null
    },
    popTipText() {
      const currSymbol = CURRENCY_SYMBOL_ENUM[this.currency]
      const rubSymbol = CURRENCY_SYMBOL_ENUM[CURRENCY_ENUM.RUB]

      return (
        this.$tr('shop.product.helpText') +
        ` 1${currSymbol} = ${this.upToDateCurrency} ${rubSymbol}`
      )
    },
    upToDateCurrency() {
      const currencies = this.$store.state.shop.currencies
      if (currencies?.length) {
        const curr = currencies.find((c) => c.label === this.currency)
        if (!curr) {
          return ''
        }
        return curr.value
      }
      return ''
    },
  },
}
</script>
