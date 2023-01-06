<template>
  <div class="shop-page">
    <AppInfoBlock v-if="shop" :limit="85" :description="shop.description" class="shop-page__info">
      <template v-slot:alert>
        <Alert :type="alertStatus" banner>
          {{ alertInfo }}
        </Alert>
      </template>
      <template v-slot:text>
        <AppMarkdown :text="shop.description"></AppMarkdown>
      </template>
    </AppInfoBlock>
    <div class="shop-page__tickets">
      <div class="row">
        <div v-for="(item, index) in tickets" :key="index" class="col-xxl-1 col-xl-2 col-lg-3 col-md-6">
          <AppProductCard
            class="shop-page__item-ticket"
            :product="item.product"
            @change-amount="addProductToBasket(item, $event)"
          />
        </div>
      </div>
    </div>
    <div class="shop-page__other">
      <h4 v-if="others && others.length" class="shop-page__sub-title">
        {{ $tr('shop.products.additionally') }}
      </h4>
      <div class="row">
        <div v-for="(item, index) in others" :key="index" class="col-xxl-1 col-xl-2 col-lg-3 col-md-6">
          <AppProductCard
            :product="item.product"
            @change-amount="addProductToBasket(item, $event)"
          />
        </div>
      </div>
    </div>
    <AppShopBasket :shop="shop" @create-order="createOrder"></AppShopBasket>
  </div>
</template>
<script>
// IMPORTANT! сущность store (таблица store) на фронте используется под именем shop (чтобы не было пересечения с vuex)
import AppInfoBlock from '@/components/common/app-info-block'
import AppMarkdown from '@/components/common/app-markdown'
import AppProductCard from '@/components/common/app-product-card'
import AppShopBasket from '@/components/common/shop/app-shop-basket'
import { mapGetters, mapState } from 'vuex'
import { TIME_STATUSES } from '@/utils/constants'
import useShop from '@/domain/composables/shop/use-shop'
import ShopService from '@/domain/services/shop-service.js'

export default {
  components: {
    AppInfoBlock,
    AppMarkdown,
    AppProductCard,
    AppShopBasket,
  },
  data() {
    return {
      test: 0,
      tickets: null,
      others: null,
      shop: null,
    }
  },
  computed: {
    ...mapGetters('event', ['currentEventId']),
    ...mapGetters('shop', ['shopId']),
    ...mapState('shop', ['productsInBasket']),
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
  },
  async mounted() {
    await this.getShopData()
  },
  methods: {
    addProductToBasket(orderItem, newAmount) {
      this.$store.commit('shop/UPDATE_AMOUNT_IN_BASKET', { orderItem, newAmount })
    },
    async getShopData() {
      const methods = [
        this.getShop(this.shopId),
        this.getProducts(this.shopId),
        this.getCurrencies(),
      ]
      try {
        await Promise.all(methods)
      } catch (e) {
        console.error(e)
      }
    },
    async createOrder() {
      const orders = this.productsInBasket.map((item) => ({
        id: item.product.id,
        count: item.amount,
      }))
      try {
        const res = await useShop().createOrder(orders, this.shopId)

        if (res.id) {
          this.$Message.success(this.$tr('shop.alerts.successOrder'))

          this.$store.commit('shop/CLEAR_BASKET')

          await this.$router.push(
            this.localePath({
              path: `/event/${this.currentEventId}/orders/${res.id}`,
            }),
          )
        }
      } catch (e) {
        if (e.message) {
          this.$Message.error(e.message)
        }
        console.error(e)
      }
    },
    async getCurrencies() {
      const currencies = await useShop().getCurrencies()
      this.$store.commit('shop/SET_CURRENCIES', currencies)
    },
    async getShop(storeId) {
      this.shop = await useShop().getEventStore(storeId)
    },
    async getProducts(storeId) {
      const { tickets, others } = await useShop().getProducts(storeId)

      this.tickets = tickets?.map((ticket) => ({ product: ticket, amount: 0 }))

      this.others = others?.map((other) => ({ product: other, amount: 0 }))
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/pages/shop.scss';
</style>
