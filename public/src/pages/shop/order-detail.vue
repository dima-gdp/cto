<template>
  <div v-if="order" class="order-detail">
    <div class="order-detail__content s-card">
      <div class="order-detail__info">
        <div class="order-detail__date-block">
          {{ $tr('order.date') }}:
          <div class="order-detail__date">
            <!--            todo: разобраться с форматами-->
            {{ timeFormat(+order.createdAt) }}
          </div>
        </div>
        <div class="order-detail__informer-tag">
          <div
            v-if="order.status"
            :class="`order-tag--${status(order.status).style}`"
            class="order-detail__tag order-tag"
          >
            {{ status(order.status).text }}
          </div>
          <div
            v-if="order"
            :class="`order-tag--${paid(order.paid).style}`"
            class="order-detail__tag order-tag"
          >
            {{ paid(order.paid).text }}
          </div>
        </div>
      </div>
      <h3 class="order-detail__sub-title">{{ $tr('order.compositionOrder') }} № {{ order.id }}</h3>
      <div class="order-detail__orders">
        <div
          v-for="(item, index) in order.orderItems"
          :key="index"
          class="order-detail__item order-item"
        >
          <div class="order-item__table">
            <div class="order-item__row">
              <div class="order-item__head-title">
                {{ $tr('order.orderCard.name') }}
              </div>
              <div class="order-item__content-title">
                {{ item.item.name }}
              </div>
            </div>
            <div class="order-item__row">
              <div class="order-item__head-title">
                {{ $tr('order.orderCard.price') }}
              </div>
              <div class="order-item__content-title">{{ item.item.priceRub }} ₽</div>
            </div>
            <div class="order-item__row">
              <div class="order-item__head-title">{{ $tr('order.orderCard.quantity') }}</div>
              <div class="order-item__content-title">
                {{ item.count }}
              </div>
            </div>
            <div class="order-item__row">
              <div class="order-item__head-title">{{ $tr('order.orderCard.available') }}</div>
              <div class="order-item__content-title">
                <template v-if="isOrderItemAvailable(item.status)">
                  {{ orderItemStatusText(item.status) }}
                </template>
                <template v-else>
                  <span style="color: var(--s-warning-color-darker)">
                    {{ orderItemStatusText(item.status) }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 class="order-detail__sub-title">
        {{ $tr('order.paymentOrder') }}
      </h3>
      <div class="row">
        <div class="col-lg-8 col-md-12">
          <Form :model="formStore" label-position="top">
            <FormItem :label="$tr('order.selectLabel')" class="order-detail__custom-item-form">
              <Select
                v-model="formStore.paymentMethod"
                :disabled="order.paid || order.status === 'canceled'"
                :placeholder="$tr('order.selectPlaceholder')"
                @on-change="providerChange"
              >
                <Option v-for="(item,idx) in paymentMethods" :key="idx" :value="item">
                  {{ translateProviders(item) }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </div>
      <Alert v-if="store && isShopClosedByTime" :type="alertStatus" banner>
        {{ alertInfo }}
      </Alert>
    </div>
    <div class="order-detail__footer">
      <div class="order-detail__sum">
        {{ $tr('order.orderPrice') }}:
        <div class="order-detail__price">{{ order.cost }} ₽</div>
      </div>
      <div class="order-detail__footer-btn">
        <Button v-if="order.status !== 'canceled' && !order.paid" size="large" @click="cancelOrder">
          {{ $tr('order.btn.canceled') }}
        </Button>
        <Button
          v-if="isPaymentAvailable && payment.confirmation"
          :to="`${payment.confirmation}`"
          type="primary"
          size="large"
          target="_blank"
        >
          {{ $tr('order.btn.payment') }}
        </Button>
        <Button
          v-else-if="isPaymentAvailable && payment.file"
          :to="`${payment.file.base_url}${payment.file.path}`"
          type="primary"
          size="large"
          target="_blank"
        >
          {{ $tr('order.btn.invoice') }}
        </Button>
      </div>
    </div>
    <Modal
      v-model="orderCancel"
      :title="$tr('order.modalCanceledOrder.title')"
      class="order-detail__modal-cancel"
      width="480"
    >
      <p>
        {{ $tr('order.modalCanceledOrder.text') }}
        <span class="order-detail__order-id"
          >{{ $tr('order.modalCanceledOrder.order') }} №{{ order.id }}</span
        >
        ?
      </p>
      <div slot="footer">
        <Button @click="cancel">
          {{ $tr('order.modalCanceledOrder.btn.close') }}
        </Button>
        <Button type="error" @click="ok">
          {{ $tr('order.modalCanceledOrder.btn.yes') }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import useShop from '@/domain/composables/shop/use-shop'
import { timeFormat } from '@/utils'
import { TIME_STATUSES, ENUM_PRODUCT_STATUS, ENUM_PRODUCT_STATUS_I18N } from '@/utils/constants'
import { mapGetters } from 'vuex'
import LangService from '@/domain/services/lang-service'
import ShopService from '@/domain/services/shop-service'
import OrderService from "@/domain/services/order-service"

export default {
  data() {
    return {
      formStore: {
        provider: '',
      },
      payment: null,
      orderCancel: false,
      loading: false,
      order: null,
      paymentMethods: [],
      store: null,
    }
  },
  computed: {
    ...mapGetters('shop', ['shopId']),
    alertInfo() {
      return ShopService.getShopDateStatusMessage(this.$i18n.locale, this.store)
    },
    alertStatus() {
      if (this.store.sellingTimeStatus === TIME_STATUSES.ENDED) {
        return 'warning'
      }
      return 'success'
    },
    isShopClosedByTime() {
      return this.store.sellingTimeStatus === TIME_STATUSES.ENDED
    },
    isAllItemsAvailable() {
      if (!this.order && !this.order.orderItems) {
        return false
      }

      return this.order.orderItems.every((item) => this.isOrderItemAvailable(item.status))
    },
    isPaymentAvailable() {
      return (
        this.payment &&
        this.store.sellingTimeStatus === TIME_STATUSES.IN_PROGRESS &&
        this.isAllItemsAvailable
      )
    },
  },
  created() {
    this.getOrderData()
  },
  methods: {
    timeFormat,
    translateProviders(paymentMethod) {
      const key = `order.providerTypes.${paymentMethod}`
      return this.$tr(key)
    },
    status(status) {
      // todo: статусы  в константы
      if (status === 'canceled') {
        return { text: this.$tr('order.status.canceled'), style: 'error' }
      } else if (status === 'created') {
        return { text: this.$tr('order.status.created'), style: 'success' }
      }
    },
    paid(status) {
      if (status) {
        return { text: this.$tr('order.payment.paid'), style: 'success' }
      } else {
        return { text: this.$tr('order.payment.unpaid'), style: 'error' }
      }
    },
    providerChange() {
      try {
        this.getPayment(this.order.id, this.formStore.paymentMethod)
      } catch (e) {
        console.error(e)
      }
    },

    cancelOrder() {
      this.orderCancel = true
    },
    async ok() {
      this.order.status = 'canceled'
      await this.orderUpdate(this.order.id, this.order)
      this.orderCancel = false
      this.$Message.success(this.$tr('order.alerts.canceledOrder'))
      await this.$router.push(this.localePath({ path: `/event/${this.store.eventId}/orders` }))
    },
    cancel() {
      this.orderCancel = false
    },
    isOrderItemAvailable(status) {
      if (status === ENUM_PRODUCT_STATUS.AVAILABLE) {
        return true
      } else if (status === ENUM_PRODUCT_STATUS.SELLING_IS_CLOSE) {
        return false
      } else if (status === ENUM_PRODUCT_STATUS.RATE_IS_BLOCKED) {
        return false
      }

      throw new Error(`Неизвестный статус элемента заказа: ${status}`)
    },
    orderItemStatusText(status) {
      if (status === ENUM_PRODUCT_STATUS.AVAILABLE) {
        return this.$tr(ENUM_PRODUCT_STATUS_I18N.AVAILABLE)
      } else if (status === ENUM_PRODUCT_STATUS.SELLING_IS_CLOSE) {
        return this.$tr(ENUM_PRODUCT_STATUS_I18N.SELLING_IS_CLOSE)
      } else if (status === ENUM_PRODUCT_STATUS.RATE_IS_BLOCKED) {
        return this.$tr(ENUM_PRODUCT_STATUS_I18N.RATE_IS_BLOCKED)
      }

      throw new Error(`Неизвестный статус элемента заказа: ${status}`)
    },
    async getOrderData() {
      // todo: если пользователь сделал заказ в эту сессию - заказ брать из vuex
      try {
        await Promise.all([
          this.getOrder(this.$route.params.orderId),
          this.getProviders(this.shopId),
          this.getShop(this.shopId),
        ])
      } catch (e) {
        console.error(e)
        await LangService.toLocalePath({ path: '/404' })
      }
    },
    async orderUpdate(orderId, data) {
      await useShop().updateOrder(orderId, data)
    },
    async getPayment(id, type) {
      const { payment } = await useShop().getPayment(id, type)
      this.payment = payment
    },

    async getOrder(id) {
      const { order } = await useShop().getOrder(id)
      this.order = order
    },

    async getProviders(shopId) {
      const providers = await useShop().getProviders(shopId)
      this.paymentMethods = OrderService.getPaymentMethods(providers)
    },

    async getShop(shopId) {
      this.store = await useShop().getEventStore(shopId)
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/pages/order-detail.scss';
@import '~@/styles/blocks/order-item.scss';
</style>
