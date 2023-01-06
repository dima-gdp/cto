<template>
  <div class="stores-page content-info">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push(`/events/edit/${eventId}`)">
          Назад
        </Button>
      </i-col>
    </Row>
    <StoreForm
      v-model="store"
      :legal-entities="legalEntities"
      :payment-providers="paymentProviders"
      :load="load.store"
      @on-submit="runAction"
      @on-delete="startDeleteStore"
      @change-lang="changeLang"
    >
      <template #rateAlert>
        <Card
          v-if="isRateAlertCanBeShown && isSomeProductsBlocked"
          :padding="0"
          class="rate-blocked-card"
        >
          <template #extra>
            <Icon
              type="md-close-circle"
              color="#ff4d4f"
              size="14px"
              @click="isRateAlertCanBeShown = !isRateAlertCanBeShown"
            />
          </template>
          <div class="rate-blocked-card__title">
            Все товары с валютными ценами заблокированы из-за сильных скачков валютных курсов
          </div>
          <div class="rate-blocked-card__body">
            Курсы валют на сайте ЦБ РФ менялись слишком сильно, поэтому мы автоматически
            заблокировали все товары, цены для которых были привязаны к курсу доллара или евро.
            Чтобы разблокировать их, нажмите на кнопку ниже.
          </div>
          <div class="">
            <Button type="error" long @click="unblockAll">
              Разблокировать товары и пересчитать их цены по текущему курсу
            </Button>
          </div>
        </Card>
      </template>
      <template #products>
        <Products
          v-model="products"
          :load="load.store"
          :store-id="store.id"
          :pages="eventPages"
          @on-valid="setProductsValid"
          @on-update="updateProduct"
          @unblock="runAction([store, 'accept', 'update'])"
        />
      </template>
    </StoreForm>
  </div>
</template>

<script>
// todo: нужен рефакторинг магазина
import StoreForm from './StoreForm'
import Products from './Products'

import { getStores, createStore, updateStore, deleteStore } from '@/api/stores'
import { getAllLegalEntities } from '@/api/legalEntities'
import {getProducts, updateProduct} from '@/api/products'
import { getAllPaymentProviders } from '@/api/payments'
import { fromStringToISO, fromISOToString, compareId } from '@/libs/util'

import {
  getEventPages,
  getEventPagesAccessIssuance,
  createEventPageAccessIssuance,
  deleteEventPageAccessIssuance,
} from '@/api/event-page'

// TODO: переименовать на беке поле event_store.closedSellingAt
const DATE_FIELD_NAMES = ['sellingClosedAt', 'sellingStartedAt']

export default {
  components: {
    StoreForm,
    Products,
  },
  data() {
    return {
      store: {},
      products: [],
      load: {
        store: false,
      },
      lang: 'ru',
      legalEntities: null,
      paymentProviders: null,
      productsValid: true,
      isRateAlertCanBeShown: true,
      eventPages: null,
      currentAccess: null,
      eventPageAccessIssuance: null,
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
    isSomeProductsBlocked() {
      return this.products.some((product) => product.isRateBlocked === true)
    },
  },
  created() {
    this.init()
  },
  methods: {
    setProductsValid(valid) {
      this.productsValid = valid
    },
    async getStores(lang) {
      this.load.store = true
      const params = {
        filter: {
          'event-id': this.eventId,
          lang: lang,
        },
        include: 'providers',
      }

      try {
        const { data } = await getStores(params)
        const [store] = data

        if (data.length > 0) {
          this.store = this.convertISOToStrDate(store)

          const { data: products } = await getProducts({
            filter: {
              storeId: store.id,
            },
            sort: '-sort,-id',
            'per-page': 0,
          })

          if (products.length) {
            this.products = products.map((p) => this.convertISOToStrDate(p))
            await this.setCurrentAccessPages()
          } else {
            this.products = []
          }
        } else {
          this.store = {}
          this.products = []
        }

        this.load.store = false
      } catch (e) {
        console.error(e)
        this.load.store = false
      }
    },

    async updateStore(store) {
      try {
        const data = this.covertStrDateToISO(store)
        await updateStore(this.store.id, data)
      } catch (e) {
        console.error(e)
      }
    },
    async createStore(store) {
      try {
        const data = this.covertStrDateToISO(store)
        await createStore(data)
        this.$Message.success('Магазин успешно создан')
      } catch (e) {
        console.error(e)
      }
    },

    startDeleteStore(id) {
      this.$Modal.confirm({
        title: 'Удаление магазина',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить магазин: id${id} ?</p>`,
        onOk: () => {
          this.deleteStore(id)
        },
      })
    },
    async deleteStore(id) {
      try {
        await deleteStore(id)
        this.$Message.success('Магазин успешно удален')
        await this.getStores(this.lang)
      } catch (e) {
        console.error(e)
        this.$Message.error('В процессе удаления произошла ошибка')
      }
    },

    async runAction([store, action, type]) {
      this.load.store = true
      switch (type) {
        case 'update':
          await this.updateStore(store)
          break
        case 'create':
          await this.createStore(store)
          break
        default:
          break
      }

      await this.updatePagesAccess()

      if (action === 'save') {
        await this.$router.push({ path: `/events/edit/${this.eventId}` })
      }

      await this.getStores(this.lang)
    },

    async updateProduct(product) {
      const changedProductIndex = this.products.findIndex((p) => compareId(p.id, product.id))
      // очень плохо - но это самый быстрый способ обновить, не переписывая компонент
      // (изменения в accessPages не трекаются, из-за чего новые связи не создаются)
      this.$set(this.products, changedProductIndex, product)
      await this.updatePagesAccess()
      await this.getStores(this.lang)
    },

    async getLegalEntities() {
      // todo: per-page - не лучшая идея, асинхронный поиск лучше
      try {
        const { data } = await getAllLegalEntities({ 'per-page': 0 })
        this.legalEntities = data
      } catch (e) {
        console.error(e)
      }
    },
    async getPaymentProviders() {
      // todo: per-page - не лучшая идея, нужен фильтр по выбранным legalEntities
      // (сейчас компонент StoreForm сам фильтрует нужные
      try {
        const { data } = await getAllPaymentProviders({ 'per-page': 0 })
        this.paymentProviders = data
      } catch (e) {
        console.error(e)
      }
    },
    async changeLang(lang) {
      this.lang = lang
      await Promise.all([this.getStores(lang), this.getEventPages()])
    },
    async unblockAll() {
      this.products.forEach((product) => {
        product.isRateBlocked = false
      })
      await Promise.all(this.products.map(product => updateProduct(product.id, { isRateBlocked: false })))
      //this.runAction([this.store, 'accept', 'update'])
    },

    // TODO: вынести все функции для работы с датами глобальнее (они постоянно дублируются)
    /**
     * Преобразовывает поля с датами из ISO к нужному формату
     * @param {object} entity
     * @returns {object}
     *
     */
    convertISOToStrDate(entity) {
      return Object.fromEntries(
        Object.entries(entity).map(([key, value]) => {
          if (DATE_FIELD_NAMES.includes(key) && value) {
            return [key, fromISOToString(value)]
          }

          return [key, value]
        }),
      )
    },
    /**
     * Преобразовывает поля с датами из строки к ISO
     * @param {object} entity
     * @returns {object}
     *
     */
    covertStrDateToISO(entity) {
      return Object.fromEntries(
        Object.entries(entity).map(([key, value]) => {
          if (DATE_FIELD_NAMES.includes(key) && value) {
            return [key, fromStringToISO(value)]
          }
          return [key, value]
        }),
      )
    },

    async init() {
      try {
        await Promise.all([
          this.getStores(this.lang),
          this.getLegalEntities(),
          this.getPaymentProviders(),
          this.getEventPages(),
        ])
      } catch (e) {
        console.error(e)
      }
    },

    // Доступ к страницам через товары
    async setCurrentAccessPages() {
      const idProducts = this.products.map((item) => item.id)
      this.eventPageAccessIssuance = await this.getEventPagesAccessIssuance(idProducts.join(','))

      this.products = this.products.map((item) => {
        const accessPage = this.eventPageAccessIssuance.filter(
          (access) => access.productId === +item.id,
        )
        if (accessPage.length) {
          return {
            ...item,
            accessPages: accessPage.map((item) => item.eventPageId),
          }
        } else {
          return {
            ...item,
            accessPages: [],
          }
        }
      })

      this.currentAccess = this.products.map((item) => {
        return {
          id: item.id,
          pagesId: item.accessPages,
        }
      })
    },
    async updatePagesAccess() {
      const newPagesAccessList = this.products.map((item) => {
        return {
          id: item.id,
          pagesId: item.accessPages,
        }
      })

      newPagesAccessList.forEach((newPageAccess) => {
        if (!this.currentAccess) return

        const [pageAccess] = this.currentAccess.filter((item) => item.id === newPageAccess.id)
        if (pageAccess) {
          const createPagesId = newPageAccess.pagesId.filter((i) => !pageAccess.pagesId.includes(i))

          const deletePagesId = pageAccess.pagesId.filter((i) => !newPageAccess.pagesId.includes(i))

          // Create event-page-access-issuance
          if (createPagesId.length) {
            createPagesId.forEach((page) => {
              this.createEventPageAccessIssuance(page, pageAccess.id)
            })
          }
          // Delete event-page-access-issuance
          if (deletePagesId.length) {
            deletePagesId.forEach((page) => {
              this.deleteEventPageAccessIssuance(page)
            })
          }
        }
      })
    },
    async getEventPages() {
      const params = {
        perPage: 0,
        filter: { eventId: this.eventId, lang: this.lang },
      }
      try {
        const { data } = await getEventPages(params)

        this.eventPages = data.filter(
          (eventPage) =>
            !['store', 'user_profile', 'user_orders', 'event_list'].includes(eventPage.type),
        )
      } catch (e) {
        console.error(e)
      }
    },
    async getEventPagesAccessIssuance(productsId) {
      const params = {
        filter: {
          productId: productsId,
        },
      }
      try {
        const { data } = await getEventPagesAccessIssuance(params)
        return data
      } catch (e) {
        console.error(e)
      }
    },
    async createEventPageAccessIssuance(eventPageId, productId) {
      const data = {
        eventPageId: eventPageId,
        productId: productId,
      }
      try {
        await createEventPageAccessIssuance(data)
      } catch (e) {
        console.error(e)
      }
    },
    async deleteEventPageAccessIssuance(eventPageId) {
      const pageAccess = this.eventPageAccessIssuance.find(
        (item) => item.eventPageId === eventPageId,
      )
      await deleteEventPageAccessIssuance(pageAccess.id)
    },
  },
}
</script>

<style lang="less">
@import './Stores.less';
</style>
