<template>
  <div class="shop-page__item-ticket shop-ticket s-card">
    <AppTextEllipsis :text="product.name" :lines="2" class="shop-ticket__title" />
    <AppTextEllipsis :text="product.description" :lines="2" class="shop-ticket__description" />
    <AppShopPriceView
      :currency="product.currency"
      :price="product.price"
      :price-rub="product.priceRub"
    />
    <!--    todo: возможно стоит разбить на два компонента - для билета и другого-->
    <template v-if="isTicket">
      <div class="shop-ticket__btn-block">
        <Button
          :disabled="isTicketNotAvailableToPurchase"
          class="ivu-btn-primary-light shop-ticket__btn"
          :type="isThisItemSelected ? 'error' : 'primary'"
          long
          @click="updateTicketAmount"
        >
          {{ isThisItemSelected ? $tr('shop.btn.delete') : $tr('shop.btn.order') }}
        </Button>
      </div>
    </template>

    <template v-else>
      <div v-if="isThisItemSelected" class="shop-ticket__btn-block">
        <InputNumber
          :value="amount"
          :editable="false"
          controls-outside
          :min="0"
          :max="userCanBuyCount"
          @input="$emit('change-amount', $event)"
        ></InputNumber>
      </div>

      <div v-else class="shop-ticket__btn-block">
        <Button
          :disabled="userCanBuyCount <= 0"
          class="ivu-btn-primary-light shop-ticket__btn"
          type="primary"
          long
          @click="$emit('change-amount', 1)"
        >
          {{ $tr('shop.btn.order') }}
        </Button>
      </div>
    </template>

    <AppShopAppBasketIcon :is-highlighted="isThisItemSelected" />

    <template v-if="isTicket">
      <div class="shop-ticket__bottom-info">
        <!--        todo: много условий, нужно провести рефакторинг-->
        <template v-if="userCanBuyCount <= 0">
          <div>{{ $tr('shop.product.other.outOfStock') }}</div>
        </template>
        <template v-else-if="!isSomeTicketSelected || isThisItemSelected">
          <div class="shop-ticket__basket-info">
            {{ `${$tr('shop.product.inBasket')}: ${amount}` }}
          </div>
          <div v-if="maxQuantityLimited" class="shop-ticket__access-info">
            {{ `${$tr('shop.product.available')}: ${userCanBuyCount - amount}` }}
          </div>
        </template>
        <template v-else>
          <div>{{ $tr('shop.product.ticket.alreadySelected') }}</div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="shop-ticket__bottom-info">
        <template v-if="userCanBuyCount > 0">
          <div class="shop-ticket__basket-info">
            {{ `${$tr('shop.product.inBasket')}: ${amount}` }}
          </div>
          <div v-if="maxQuantityLimited" class="shop-ticket__access-info">
            {{ `${$tr('shop.product.available')}: ${userCanBuyCount - amount}` }}
          </div>
        </template>
        <template v-else>
          <div>{{ $tr('shop.product.other.outOfStock') }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import AppTextEllipsis from '@/components/common/app-text-ellipsis'
import AppShopPriceView from '@/components/common/shop/app-shop-price-view'
import AppShopAppBasketIcon from '@/components/common/shop/app-shop-basket-icon'
import { mapState, mapGetters } from 'vuex'
import ShopService from '@/domain/services/shop-service'
import ProductService from '@/domain/services/product-service'

export default {
  components: { AppTextEllipsis, AppShopPriceView, AppShopAppBasketIcon },
  props: {
    product: { type: Object, required: true },
  },
  computed: {
    ...mapGetters({
      isSomeTicketSelected: 'shop/isSomeTicketSelected',
    }),
    ...mapState('shop', ['productsInBasket']),
    userCanBuyCount() {
      return ShopService.getRemainsByProduct(this.product)
    },
    amount() {
      return ShopService.getAmountItemById(this.product.id, this.productsInBasket)
    },
    isTicket() {
      return ProductService.isTicket(this.product)
    },
    isThisItemSelected() {
      return ShopService.isItemAlreadySelected(this.product.id, this.productsInBasket)
    },
    maxQuantityLimited() {
      return this.userCanBuyCount !== Infinity
    },
    isTicketNotAvailableToPurchase() {
      return (this.isSomeTicketSelected && !this.isThisItemSelected) || this.userCanBuyCount <= 0
    },
  },
  methods: {
    updateTicketAmount() {
      if (this.isThisItemSelected) {
        // если билет выбран - убрать, если не выбран - добавить
        this.$emit('change-amount', 0)
      } else {
        this.$emit('change-amount', 1)
      }
    },
  },
}
</script>

<style scoped></style>
