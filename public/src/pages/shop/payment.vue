<template>
  <div class="payment-result">
    <div v-if="order" class="payment-result__content s-card">
      <div
        :class="
          order.paid ? 'payment-result__order-title--success' : 'payment-result__order-title--error'
        "
        class="payment-result__order-title s-h3"
      >
        {{
          order.paid
            ? this.$tr('payment.success.text', [order.id])
            : this.$tr('payment.error.text', [order.id])
        }}
      </div>
      <div class="payment-result__orders">
        <div
          v-for="(orderItem, index) in order.orderItems"
          :key="index"
          class="payment-result__item order-item"
        >
          <div class="order-item__table">
            <div class="order-item__row">
              <div class="order-item__head-title">
                {{ $tr('payment.orderCard.name') }}
              </div>
              <div class="order-item__content-title">
                {{ orderItem.item.name }}
              </div>
            </div>
            <div class="order-item__row">
              <div class="order-item__head-title">
                {{ $tr('payment.orderCard.quantity') }}
              </div>
              <div class="order-item__content-title">
                {{ orderItem.count }} {{ $tr('payment.orderCard.thing') }}
              </div>
            </div>
            <div class="order-item__row">
              <div class="order-item__head-title">
                {{ $tr('payment.orderCard.price') }}
              </div>
              <div class="order-item__content-title">{{ orderItem.item.priceRub }} ₽</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!order.paid" class="payment-result__info">
        <p>
          {{ $tr('payment.error.info.text') }}
          <router-link :to="localePath({ path: `/event/${eventId}/orders/${orderId}` })">
            {{ $tr('payment.error.info.order') }}
          </router-link>
        </p>
      </div>
    </div>
    <div v-if="pay && !order.paid" class="payment-result__btn">
      <Button :to="`${pay}`" type="primary" target="_blank">
        {{ $tr('payment.btn.repeatPay') }}
      </Button>
    </div>
  </div>
</template>

<script>
import useShop from '@/domain/composables/shop/use-shop'
import {CURRENCY_ENUM, CURRENCY_SYMBOL_ENUM} from '@/utils/constants';
export default {
  data() {
    return {
      pay: '',
      order: null,
      orderId: this.$route.params.orderId,
      eventId: this.$route.params.eventId,
    }
  },
  computed: {
    priceInCurrency() {
      if (this.order.item.currency !== CURRENCY_ENUM.RUB) {
        return `${this.order.item.price} ${CURRENCY_SYMBOL_ENUM[this.order.item.currency]}`
      }
      return null
    },
  },
  created() {
    try {
      this.getOrder(this.orderId)
    } catch (e) {
      console.error(e)
    }
  },
  mounted() {
    if (this.order && !this.order.paid) {
      this.test()
    }
  },
  methods: {
    async test() {
      const payment = this.getPayment(this.order.id, 'bank_card')

      this.pay = payment.confirmation
    },
    async getOrder(id) {
      const { order } = await useShop().getOrder(id)
      this.order = order
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/payment-result.scss';
@import '~@/styles/blocks/order-item.scss';
</style>
