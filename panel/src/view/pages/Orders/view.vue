<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Просмотр заказа</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/orders/list')"> Назад </Button>
      </i-col>
    </Row>
    <Row type="flex" class-name="view-content">
      <i-col span="8">
        <!-- Order info -->
        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные о заказе id {{ orderId }}</h3>
              <Row v-if="!load" type="flex">
                <i-col span="12" class-name="view-card-item">
                  <span v-show="order.createdAt" class="view-card-item__title">Дата создания:</span>
                  <p class="view-card-item__content">
                    {{ formatDate(order.createdAt * 1000) }}
                  </p>
                </i-col>
                <i-col v-if="order.status" span="12">
                  <span class="view-card-item__title">Статус:</span>
                  <p class="view-card-item__content">
                    {{ orderStatus }}
                  </p>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <!-- User data -->
        <div class="card-wrap card-wrap--left">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные пользователя</h3>
              <Row v-if="order.user && !load" type="flex">
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">ФИО</span>
                  <p class="view-card-item__content">
                    {{ formatUserName }}
                  </p>
                </i-col>
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">Email</span>
                  <p class="view-card-item__content">
                    {{ order.user.email }}
                  </p>
                </i-col>
                <i-col span="12" class-name="view-card-item">
                  <span class="view-card-item__title">Телефон</span>
                  <p class="view-card-item__content">
                    {{ order.user.phone }}
                  </p>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <!-- Comments -->
        <div class="card-wrap card-wrap--left">
          <!-- Comments data -->
          <Card v-if="comment && !commentVisible" :bordered="false" class="view-card">
            <h3 class="view-card__title">Комментарий:</h3>
            <Row type="flex">
              <i-col span="24">
                <p class="view-card-item__content">
                  {{ comment }}
                </p>
              </i-col>
            </Row>
          </Card>

          <!-- Comments component -->
          <Card v-if="commentVisible" :bordered="false" class="view-card">
            <SingleComment
              v-model="comment"
              @save-comment="updateComment"
              @cancel="commentVisible = false"
            />
            <Spin v-if="loadComments" fix></Spin>
          </Card>
        </div>

        <div class="card-wrap card-wrap--left">
          <!-- Comments actions -->
          <Button v-if="!commentVisible && !load" long @click="commentVisible = true">
            {{ comment ? 'Редактировать комментарий' : 'Добавить комментарий' }}
          </Button>
        </div>
      </i-col>

      <i-col span="16">
        <!-- Orders actions -->
        <div class="card-wrap card-wrap--right view-actions view-actions--inline">
          <div class="view-actions__btn">
            <Button long type="primary" @click="orderStatusModal = true">
              Изменить статус заказа
            </Button>
          </div>
          <div class="view-actions__btn">
            <Button long type="primary" @click="paymentStatusModal = true">
              Изменить статус оплаты
            </Button>
          </div>
          <div class="view-actions__btn">
            <Button long type="primary" :disabled="order.paid" @click="paymentMethodModal = true">
              Способ оплаты
            </Button>
          </div>
        </div>

        <!-- Order status modal -->
        <Modal
          v-model="orderStatusModal"
          title="Изменение статуса заказа"
          ok-text="Применить"
          cancel-text="Отмена"
          width="350"
          @on-ok="changeOrderStatus(order.status)"
        >
          <Select v-model="order.status">
            <Option v-for="(name, status) in statusesMap" :key="status" :value="status">
              {{ name }}
            </Option>
          </Select>
        </Modal>

        <!-- Payment status modal -->
        <Modal
          v-model="paymentStatusModal"
          title="Изменение статуса оплаты"
          ok-text="Применить"
          cancel-text="Отмена"
          width="350"
          @on-ok="changePaymentStatus(order.paid)"
        >
          <Row type="flex" justify="space-between">
            <i-switch v-model="order.paid" />
            <Tag v-if="order.paid" color="green"> Оплачен </Tag>
            <Tag v-if="!order.paid" color="red"> Не оплачен </Tag>
          </Row>
        </Modal>

        <!-- Payment method modal -->
        <Modal
          v-model="paymentMethodModal"
          title="Изменение метода оплаты"
          ok-text="Применить"
          cancel-text="Отмена"
          width="350"
          @on-ok="changePaymentMethod(paymentMethod)"
        >
          <Select v-model="paymentMethod">
            <Option
              v-for="provider in providers"
              :key="provider.id"
              :value="provider.settings.paymentMethods[0]"
            >
              {{ provider.name }}
            </Option>
          </Select>
        </Modal>

        <!-- Order data -->
        <div class="card-wrap card-wrap--right">
          <Card :bordered="false" class="view-card">
            <div>
              <h3 class="view-card__title">Данные заказа</h3>
              <Row v-if="!load" type="flex">
                <i-col span="24" class-name="view-card-item">
                  <div class="order-items">
                    <Row type="flex" class-name="order-items-header">
                      <i-col span="12" class-name="order-items-header__item"> Товар: </i-col>
                      <i-col span="6" class-name="order-items-header__item"> Количество: </i-col>
                      <i-col span="6" class-name="order-items-header__item"> Цена штуки: </i-col>
                    </Row>
                    <Row
                      v-for="(item, index) in order.orderItems"
                      :key="index"
                      type="flex"
                      class-name="order-items-body"
                    >
                      <i-col span="12" class-name="order-items-body__item">
                        {{ item.item.name }}
                      </i-col>
                      <i-col span="6" class-name="order-items-body__item">
                        {{ `${item.count} шт.` }}
                      </i-col>
                      <i-col span="6" class-name="order-items-body__item">
                        {{ formatCurrency(item) }}
                      </i-col>
                    </Row>
                    <Row type="flex" justify="end" class-name="order-items-footer">
                      <i-col span="6" class-name="order-items-footer__item">
                        {{ `Итого: ${orderItemsSumm}` }}
                      </i-col>
                    </Row>
                  </div>
                </i-col>
                <i-col span="12">
                  <span class="view-card-item__title">Способ оплаты:</span>
                  <p v-if="order.payments" class="view-card-item__content">
                    {{ formatPaymentsName(order.payments.paymentMethod) }}
                  </p>
                </i-col>
                <i-col span="12">
                  <span class="view-card-item__title">Статус оплаты:</span>
                  <p class="view-card-item__content">
                    <Tag v-if="order.paid" color="green"> Оплачен </Tag>
                    <Tag v-else color="red"> Не оплачен </Tag>
                  </p>
                </i-col>
              </Row>
            </div>
            <Spin v-if="load" fix></Spin>
          </Card>
        </div>

        <!-- Delere order -->
        <div v-if="!load && deleteAccess.includes(role)" class="card-wrap card-wrap--right">
          <Row type="flex">
            <i-col span="12" offset="12">
              <Button
                :disabled="!deleteAccess.includes(role)"
                type="error"
                ghost
                long
                @click="startDeleteOrder"
              >
                Удалить заказ
              </Button>
            </i-col>
          </Row>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurrentOrder, updateOrder, deleteOrder } from '@/api/orders'
import { makePayment } from '@/api/payments'
import {getCurrencies, getCurrentStore} from '@/api/stores'

import SingleComment from '_c/single-comment'

import dayjs from 'dayjs'
import {CURRENCY_ENUM} from "@/libs/constants";
export default {
  components: {
    SingleComment,
  },
  data() {
    return {
      order: {},
      fields: [],
      orderData: [],
      comment: null,
      commentVisible: false,
      load: false,
      loadComments: false,
      orderStatusModal: false,
      paymentStatusModal: false,
      paymentMethodModal: false,
      statusesMap: {
        created: 'Создан',
        canceled: 'Отменен',
      },
      paymentMethod: null,
      providers: null,
      currencies: [{ id: 0, label: CURRENCY_ENUM.RUB, value: 1 }],
    }
  },
  computed: {
    ...mapGetters(['role']),
    deleteAccess() {
      return ['it', 'administrator']
    },
    orderId() {
      return this.$route.params.id
    },
    orderStatus() {
      const { status } = this.order

      switch (status) {
        case 'created':
          return 'Создан'
        case 'canceled':
          return 'Отменен'
        default:
          return ''
      }
    },
    orderItemsSumm() {
      if (!this.order.orderItems) {
        return ''
      }

      const orderCost = this.order.orderItems.reduce((prev, curr) => {
        if (curr.currency === CURRENCY_ENUM.EUR) {
          return prev + (curr.cost * +this.eurRate)
        } else if (curr.currency === CURRENCY_ENUM.USD){
          return prev + (curr.cost * +this.usdRate)
        } else {
          return prev + curr.cost
        }
      }, 0)


      return this.formatCostCurrency(this.order.currency, orderCost)
    },
    formatUserName() {
      if (this.order.user) {
        const { firstName, middleName, lastName } = this.order.user

        if (firstName && middleName && lastName)
          return `${lastName} ${firstName[0]}.${middleName[0]}.`
        if (firstName && lastName) return `${lastName} ${firstName[0]}.`
      }

      return ''
    },
    usdRate() {
      const rate = this.currencies.find((c) => c.label === CURRENCY_ENUM.USD)
      return rate ? rate.value.toFixed(2) : ''
    },
    eurRate() {
      const rate = this.currencies.find((c) => c.label === CURRENCY_ENUM.EUR)
      return rate ? rate.value.toFixed(2) : ''
    },
  },
  created() {
    this.getDependencies(this.orderId)
    this.getCurrencies()
  },

  methods: {
    async changeOrderStatus(status) {
      const params = { status }

      await updateOrder(this.orderId, params)
      await this.getDependencies(this.orderId)
    },
    async changePaymentStatus(paid) {
      const params = { paid }

      await updateOrder(this.orderId, params)
      await this.getDependencies(this.orderId)
    },
    async changePaymentMethod(paymentMethod) {
      const params = {
        order_id: this.orderId,
        payment_method: paymentMethod,
      }

      await makePayment(params)
      await this.getDependencies(this.orderId)
    },
    async getDependencies(id) {
      this.load = true

      const orderParams = {
        include: 'order-items,payments,user',
      }

      try {
        const { data } = await getCurrentOrder(id, orderParams)
        this.order = data

        const storeParams = { include: 'providers' }
        const storeRes = await getCurrentStore(this.order.storeId, storeParams)
        this.providers = storeRes.data.providers

        this.comment = data.managerComment
      } catch (e) {
        this.load = false
        throw new Error(e)
      }

      this.load = false
    },
    formatCurrency(item) {
      const { currency  } = item

      return this.formatCostCurrency(currency, item.item.price)
    },

    formatCostCurrency(currency, cost) {
      switch (currency) {
        case CURRENCY_ENUM.RUB:
          return `${cost} руб`
        case CURRENCY_ENUM.EUR:
          return `${cost * (+this.eurRate) } руб`
        case CURRENCY_ENUM.USD:
          return `${cost * (+this.usdRate)} руб`
        default:
          return ''
      }
    },

    formatDate(date) {
      if (date) return dayjs(date).format('DD-MM-YYYY HH:MM')
      else return ''
    },
    async updateComment(value) {
      this.loadComments = true
      try {
        const comment = { managerComment: value }
        const { data } = await updateOrder(this.orderId, comment)

        this.comment = data.managerComment
        this.loadComments = false
        this.commentVisible = false

        this.$Notice.success({
          title: 'Комментарий успешно изменен',
        })
      } catch (e) {
        console.error(e)
        this.loadComments = false
        throw new Error(e)
      }
    },
    startDeleteOrder(e, id = this.orderId) {
      this.$Modal.confirm({
        title: 'Удаление заказа',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить заказ: id${id} ?</p>`,
        onOk: () => {
          this.deleteOrder(id)
        },
      })
    },
    async deleteOrder(id) {
      try {
        await deleteOrder(id)
        this.$Message.success('Заказ успешно удален')
        this.$router.push({ path: '/orders/list' })
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },
    formatPaymentsName(paymentMethod) {
      switch (paymentMethod) {
        case 'bank_card':
          return 'ЮKassa'
        case 'invoice':
          return 'По счету'
        default:
          break
      }
    },
    async getCurrencies() {
      const { data } = await getCurrencies()
      this.currencies = [...this.currencies, ...data]
    },
  },
}
</script>

<style lang="less">
@import './view.less';
</style>
