<template>
  <div class="my-orders">
    <div v-if="orders && orders.length" class="my-orders__list">
      <div v-for="(item, index) in orders" :key="index" class="">
          <div class="my-orders__item order-item">
            <div class="order-item__table">
              <div class="order-item__row">
                <div class="order-item__head-title">
                  {{ $tr('orders.orderCard.order') }}
                </div>
                <div class="order-item__content-title order-item__content-title--medium">
                  {{ item.id }}
                </div>
              </div>
              <div class="order-item__row">
                <div class="order-item__head-title">
                  {{ $tr('orders.orderCard.date') }}
                </div>
                <div class="order-item__content-title">
                  {{ timeFormat(+item.createdAt) }}
                </div>
              </div>
              <div class="order-item__row">
                <div class="order-item__head-title">
                  {{ $tr('orders.orderCard.sum') }}
                </div>
                <div class="order-item__content-title">{{ item.cost }} ₽</div>
              </div>
              <div class="order-item__row">
                <div class="order-item__head-title">
                  {{ $tr('orders.orderCard.status') }}
                </div>
                <div class="order-item__content-title">
                  <div
                    :class="`order-item__status--${status(item.status).style}`"
                    class="order-item__status"
                  >
                    {{ status(item.status).text }}
                  </div>
                </div>
              </div>
              <div class="order-item__row">
                <div class="order-item__head-title">
                  {{ $tr('orders.orderCard.payment') }}
                </div>
                <div class="order-item__content-title">
                  <div
                    :class="`order-item__status--${paid(item.paid).style}`"
                    class="order-item__status"
                  >
                    {{ paid(item.paid).text }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.status !== 'canceled'" class="order-item__btn-block">
              <router-link
                :to="localePath({ path: `/event/${$route.params.eventId}/orders/${item.id}` })"
                class="order-item__btn ivu-btn ivu-btn-primary ivu-btn-primary-light ivu-btn-small"
              >
                {{ $tr('orders.btn.detail') }}
              </router-link>
            </div>
          </div>
        </div>
    </div>
    <div v-if="orders && orders.length < 1" class="my-orders__list my-orders__list--empty">
      <div class="row">
        <div class="col-l-6">
          <div class="order-item order-item--empty">
            {{ $tr('orders.emptyOrders.text') }}
          </div>
          <router-link
            :to="localePath({ path: `/event/${$route.params.id}/store` })"
            class="order-item order-item--empty"
          >
            {{ $tr('orders.emptyOrders.link') }}
          </router-link>
        </div>
      </div>
    </div>
    <Button
      v-if="ordersMeta && ordersMeta.currentPage < ordersMeta.pageCount"
      class="ivu-btn-more"
      @click="loadMoreOrders"
    >
      <feather size="22" type="chevron-down" stroke="var(--s-black-color-80)" />
      {{ $tr('orders.btn.more') }}
    </Button>
  </div>
</template>
<script>
import useShop from '@/domain/composables/shop/use-shop'
import { mapGetters, mapState } from 'vuex'
import { timeFormat } from '@/utils'
import { ORDER_STATUS_ENUM, ORDER_PAID_ENUM } from '@/utils/constants'

export default {
  data() {
    return {
      orders: null,
      store: null,
      ordersMeta: null,
    }
  },
  computed: {
    ...mapGetters('shop', ['shopId']),
    ...mapState({
      event: (state) => state.event.data,
      auth: (state) => state.auth,
    }),
  },
  created() {
    this.getOrderData()
  },
  methods: {
    timeFormat,
    status(status) {
      if (status === 'canceled') {
        return { text: this.$tr(ORDER_STATUS_ENUM.CANCELED), style: 'error' }
      } else if (status === 'created') {
        return { text: this.$tr(ORDER_STATUS_ENUM.CREATED), style: 'success' }
      }
    },
    paid(status) {
      if (status) {
        return { text: this.$tr(ORDER_PAID_ENUM.PAID), style: 'success' }
      } else {
        return { text: this.$tr(ORDER_PAID_ENUM.UNPAID), style: 'error' }
      }
    },

    async getOrders(userId, storeId) {
      const { orders, ordersMeta } = await useShop().getOrders(userId, storeId)
      this.orders = orders
      this.ordersMeta = ordersMeta
    },
    async loadMoreOrders() {
      const { orders, ordersMeta } = await useShop().loadMoreOrders(
        this.$store.state.auth.userId,
        this.shopId,
        this.ordersMeta,
      )
      this.orders = [...this.orders, ...orders]
      this.ordersMeta = ordersMeta
    },
    async getOrderData() {
      try {
        await this.getOrders(this.$store.state.auth.userId, this.shopId)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/orders.scss';
@import '~@/styles/blocks/order-item.scss';
</style>
