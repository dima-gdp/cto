<template>
  <div v-if="cardData" class="card-info">
    <div class="card-info-section card-info-section--for-spliny">
      <Row type="flex" :gutter="15">
        <i-col span="4">
          <h2 class="card-info-section__title">ID: {{ cardData.id }}</h2>
        </i-col>
        <i-col span="6">
          <h2 class="card-info-section__title">
            {{ cardData.email }}
          </h2>
        </i-col>
      </Row>
      <Row type="flex" :gutter="15">
        <i-col span="6">
          <div class="card-info-section-item">Дата создания:</div>
        </i-col>
        <i-col span="6">
          <div class="card-info-section-item">
            {{ getDate(cardData.createdAt) }}
          </div>
        </i-col>
        <i-col span="6">
          <div class="card-info-section-item">Первый источник:</div>
        </i-col>
        <i-col span="6">
          <div class="card-info-section-item">
            {{ earliestRegAuthGroup.name || 'не определен' }}
          </div>
        </i-col>
      </Row>
      <Row type="flex" :gutter="15">
        <i-col span="6">
          <div class="card-info-section-item">Дата последнего обновления:</div>
        </i-col>
        <i-col span="6">
          <div v-if="cardData.updatedAt" class="card-info-section-item">
            {{ getDate(cardData.updatedAt) }}
          </div>
          <div v-else class="card-info-section-item">Нет данных</div>
        </i-col>
      </Row>
      <Divider />
      <CardProfile :profile="cardData.cardProfile" />
    </div>
    <Divider />
    <div class="card-info-section card-info-section--for-spliny">
      <h2 class="card-info-section__title">Ценность</h2>
      <Row type="flex" :gutter="15">
        <i-col span="6">
          <div class="card-info-section-item-label">Кол-во анкет:</div>
          <div v-if="cardData.registrations" class="card-info-section-item">
            {{ cardData.registrations.length }}
          </div>
          <div v-else class="card-info-section-item">Нет данных</div>
        </i-col>
        <i-col span="6">
          <div class="card-info-section-item-label">Сумма купленных товаров:</div>
          <div class="card-info-section-item">{{ paidSum }} руб.</div>
        </i-col>
      </Row>
    </div>
    <Divider />
    <div
      v-for="(group, key) in dataByAuthGroups"
      :key="key"
      class="card-info-section card-info-section--for-spliny"
      style="margin-bottom: 15px"
    >
      <p style="font-size: 16px; margin-bottom: 15px">
        Пользователь <b>{{ cardData.email }}</b> из базы <b>{{ key }}</b>
      </p>
      <Tabs :animated="false">
        <TabPane label="Анкеты">
          <Table :data="sortById(group.registrations)" :columns="registrationsCols" size="small" />
        </TabPane>
        <TabPane label="Заказы">
          <Table :data="sortById(group.orders)" :columns="ordersCols" size="small" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { getDate } from '@/libs/tools'
import CardProfile from '../card-profile'

export default {
  components: { CardProfile },
  props: {
    cardData: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      ordersCols: [
        {
          title: 'ID',
          key: 'id',
          type: 'integer',
          maxWidth: 70,
        },
        {
          title: 'Статус',
          key: 'status',
          type: 'string',
          maxWidth: 100,
          render: (h, params) => {
            if (params.row.status) {
              return h('span', `${params.row.status === 'created' ? 'Создан' : 'Отменен'}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'ФИО',
          key: 'name',
          type: 'string',
          minWidth: 50,
          render: (h, { row }) => {
            const orderUserId = row.userId
            const user = this.cardData.users.find((u) => +u.id === +orderUserId)
            if (user) {
              return h('span', `${user.lastName} ${user.firstName} ${user.middleName}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Тех. название мероприятия',
          key: 'event.technicalName',
          type: 'string',
          minWidth: 100,
          render: (h, params) => {
            const eventName = params.row.hasOwnProperty('event')
              ? params.row.event.technicalName
              : ''

            if (params.row.event) {
              return h('span', eventName)
            } else {
              return null
            }
          },
        },
        {
          title: 'Сумма',
          key: 'cost',
          type: 'string',
          sortable: true,
          align: 'center',
          maxWidth: 100,
          render: (h, params) => {
            if (params.row.cost) {
              return h('span', { class: 'table-orders__cost' }, `${params.row.cost}`)
            } else {
              return null
            }
          },
        },
        {
          title: 'Оплата',
          key: 'paid',
          type: 'string',
          align: 'center',
          maxWidth: 200,
          render: (h, params) => {
            if (params.row.hasOwnProperty('paid')) {
              return h(
                'Tag',
                {
                  attrs: {
                    color: params.row.paid ? 'green' : 'red',
                  },
                },
                `${params.row.paid ? 'Оплачен' : 'Не оплачен'}`
              )
            } else {
              return null
            }
          },
        },
        {
          title: 'Дата создания',
          key: 'createdAt',
          render: (h, params) => {
            if (params.row.hasOwnProperty('createdAt')) {
              return h('span', getDate(params.row.createdAt))
            } else {
              return null
            }
          },
        },
      ],
      registrationsCols: [
        {
          key: 'id',
          title: 'ID',
          maxWidth: 70,
        },
        {
          key: 'email',
          title: 'E-mail',
          minWidth: 20,
        },
        {
          key: 'phone',
          title: 'Телефон',
          maxWidth: 120,
        },
        {
          key: 'fullName',
          title: 'ФИО',
        },
        {
          key: 'event',
          title: 'Тех. название мероприятия',
          render(h, params) {
            return h('span', params.row.event.technicalName)
          },
        },
        {
          key: 'comment',
          title: 'Комментарий',
        },
        {
          title: 'Дата регистрации',
          key: 'createdAt',
          render: (h, params) => {
            if (params.row.hasOwnProperty('createdAt')) {
              return h('span', getDate(params.row.createdAt))
            } else {
              return null
            }
          },
        },
        {
          title: ' ',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.$router.push(`/worksheets/${params.row.id}`)
                    },
                  },
                },
                'Перейти к анкете'
              ),
            ])
          },
        },
      ],
    }
  },
  computed: {
    paidSum() {
      if (!this.cardData.orders) {
        return 0
      }

      return this.cardData.orders.reduce((acc, curr) => {
        if (curr.paid) {
          acc = curr.cost + acc
        }

        return acc
      }, 0)
    },
    registrationsByAuthGroups() {
      if (!this.cardData.registrations) {
        return null
      }

      return this.cardData.registrations.reduce((acc, curr) => {
        // undefined по умолчанию потому что +undefined = NaN, a +null = 0
        const { authGroupId = undefined } = this.cardData.users.find((u) => +u.id === +curr.userId)
        const authGroup = this.cardData.authGroups.find((g) => +g.id === +authGroupId)

        if (!authGroup) {
          return acc
        }

        const registrationWithPhone = this.hardcodePhoneToRegistration(curr)

        if (!acc[authGroup.name]) {
          acc[authGroup.name] = [registrationWithPhone]
        } else {
          acc[authGroup.name].push(registrationWithPhone)
        }

        return acc
      }, {})
    },
    ordersByAuthGroups() {
      if (!this.cardData.orders) {
        return null
      }

      return this.cardData.orders.reduce((acc, curr) => {
        const { authGroupId = undefined } = this.cardData.users.find((u) => +u.id === +curr.userId)
        const authGroup = this.cardData.authGroups.find((g) => +g.id === +authGroupId)

        if (!authGroup) {
          return acc
        }

        if (!acc[authGroup.name]) {
          acc[authGroup.name] = [curr]
        } else {
          acc[authGroup.name].push(curr)
        }

        return acc
      }, {})
    },
    dataByAuthGroups() {
      if (this.cardData.authGroups.length === 0) {
        return []
      }

      return this.cardData.authGroups.reduce((acc, curr) => {
        if (!acc[curr.name]) {
          acc[curr.name] = { orders: [], registrations: [] }

          if (
            this.registrationsByAuthGroups !== null &&
            this.registrationsByAuthGroups[curr.name]
          ) {
            acc[curr.name].registrations = [...this.registrationsByAuthGroups[curr.name]]
          }

          if (this.ordersByAuthGroups !== null && this.ordersByAuthGroups[curr.name]) {
            acc[curr.name].orders = [...this.ordersByAuthGroups[curr.name]]
          }
        }

        return acc
      }, {})
    },
    earliestReg() {
      const currRegsInAuthGroups = this.cardData ? this.cardData.users : []
      return currRegsInAuthGroups.reduce(
        (acc, curr) => {
          acc = acc.createdAt < curr.createdAt ? { ...acc } : { ...curr }
          return acc
        },
        { createdAt: Number.MAX_SAFE_INTEGER }
      )
    },
    earliestRegAuthGroup() {
      return this.cardData.authGroups.find((ag) => +ag.id === this.earliestReg.authGroupId)
    },
    phoneFields() {
      // TODO: захардкожен id поля с телефоном так же, как и в листинге анкет
      const phoneFieldId = 43
      return this.cardData.records.filter((r) => r.fieldId === phoneFieldId)
    },
    cardProfiles() {
      if (!this.cardData.cardProfile) {
        return []
      }

      return Object.entries(this.cardData.cardProfile)
        .map(([key, value]) => ({ key, value }))
        .filter((p) => p.value) // выкинуть пустые
        .filter((p) => !['cardId', 'id'].includes(p.key)) // не отображаать id
    },
  },
  methods: {
    getDate,

    sortById(data) {
      return [...data].sort((a, b) => +b.id - +a.id)
    },

    hardcodePhoneToRegistration(registration) {
      const phoneFieldOnThisEvent = this.phoneFields.find(
        (field) => field.entity === 'registration' && +field.entityId === +registration.id
      )

      if (phoneFieldOnThisEvent) {
        return { ...registration, phone: phoneFieldOnThisEvent.value }
      }

      return { ...registration }
    },
  },
}
</script>

<style lang="less">
.card-info {
  padding: 10px 15px 15px 15px;

  .ivu-table-cell {
    word-break: normal;
  }

  .ivu-table-small td {
    font-size: 11px;
  }
}

.card-info-section {
  &__title {
    margin-bottom: 15px;
  }

  &--for-spliny {
    padding: 15px;
  }
}

.card-info-section-row {
  display: flex;
}

.card-info-section-item {
  font-size: 15px;
}

.card-info-section-item-label {
  font-size: 15px;
  font-weight: bold;
}
</style>
