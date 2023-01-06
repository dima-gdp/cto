<template>
  <div v-if="productsInBasket.length" class="shop-page__orders-block orders-block">
    <div class="orders-block__left-block">
      <div class="orders-block__selected-item">
        <feather
          class="orders-block__icon"
          type="shopping-bag"
          size="20"
          stroke="var(--s-black-color-80)"
        />

        <!-- Hidden mobile start -->
        <div class="orders-block__selected-text label-primary d-none d-lg-flex">
          {{ $tr('shop.orderBar.selected') }} {{ productsInBasket.length }}
          {{ $tr('shop.orderBar.product') }}
        </div>
        <!-- Hidden mobile end -->

        <!-- Only mobile start -->
        <div class="orders-block__selected-text label-primary d-lg-none">
          {{ totalAmount }}
        </div>
        <!-- Only mobile end -->

        <feather
          class="orders-block__icon-cancel"
          type="x"
          size="20"
          stroke="var(--s-black-color-80)"
          @click="clearProducts"
        />
      </div>
      <div class="orders-block__sum">
        {{ $tr('shop.orderBar.sum') }}:
        <div class="orders-block__sum-number">{{ sum }} ₽</div>
      </div>
    </div>
    <Alert v-if="isShopNotAvailableByTime" :type="alertStatus" class="orders-block__alert" banner>
      {{ alertInfo }}
    </Alert>
    <Button v-else class="orders-block__btn" type="primary" @click="createOrder">
      {{ $tr('shop.btn.makeOrder') }}
    </Button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { TIME_STATUSES } from '@/utils/constants'
import ShopService from '@/domain/services/shop-service'
export default {
  props: {
    shop: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapState({
      productsInBasket: (state) => state.shop.productsInBasket,
    }),

    alertInfo() {
      if (!this.shop) {
        return
      }
      return ShopService.getShopDateStatusMessage(this.$i18n.locale, this.shop)
    },

    alertStatus() {
      if (!this.shop) {
        return
      }
      if (this.shop.sellingTimeStatus === TIME_STATUSES.ENDED) {
        return 'warning'
      }
      return 'success'
    },
    isShopNotAvailableByTime() {
      if (!this.shop) {
        return
      }
      return this.shop.sellingTimeStatus !== TIME_STATUSES.IN_PROGRESS
    },

    sum() {
      const sum = this.productsInBasket.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.product.priceRub * currentValue.amount,
        0,
      )
      return +sum.toFixed(2)
    },

    totalAmount() {
      return this.productsInBasket.reduce((acc, curr) => acc + curr.amount, 0)
    },
  },
  methods: {
    clearProducts() {
      this.$store.commit('shop/CLEAR_BASKET')
    },
    createOrder() {
      this.$emit('create-order')
    },
  },
}
</script>

<style scoped></style>
