<template>
  <div class="content-info">
    <Row
      v-if="role !== 'manager'"
      type="flex"
      justify="center"
      align="middle"
      class-name="view-header"
    >
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Трансляции</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${$route.params.id}`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <Card>
      <Row type="flex" class-name="hall-group-list" :gutter="30">
        <transition-group name="hall-group" tag="div">
          <i-col
            v-if="role === 'administrator' || role === 'it'"
            key="uniq"
            span="8"
            class-name="hall-group-list__col"
          >
            <div
              v-if="!isLoading"
              class="add-button-big"
              @click="$router.push({ path: `hall-group/create` })"
            >
              <Icon type="ios-add" />
              <p>Добавить трансляцию</p>
            </div>
          </i-col>
          <i-col
            v-for="hallGroup in hallGroupsList"
            :key="hallGroup.id"
            span="8"
            class-name="hall-group-list__col"
          >
            <div
              class="hall-group-list-item"
              :class="{ 'hall-group-list-item--active': hallGroup.active }"
            >
              <h3 class="hall-group-list-item__title">{{ hallGroup.name }}</h3>
              <div
                v-if="hallGroup.autoActiveEndedAt || hallGroup.autoActiveStartedAt"
                class="hall-group-list-item__dates hall-group-dates"
              >
                <div v-if="hallGroup.autoActiveStartedAt" class="hall-group-dates__col">
                  <span class="hall-group-dates__title">Начало</span>
                  <span class="hall-group-dates__time">{{ hallGroup.autoActiveStartedAt }}</span>
                </div>
                <div v-if="hallGroup.autoActiveEndedAt" class="hall-group-dates__col">
                  <span class="hall-group-dates__title">Окончание</span>
                  <span class="hall-group-dates__time">{{ hallGroup.autoActiveEndedAt }}</span>
                </div>
              </div>
              <div class="hall-group-list-item__bottom">
                <Button
                  v-if="role === 'administrator' || role === 'it'"
                  class="hall-group-list-item__btn"
                  icon="md-create"
                  @click="$router.push(`hall-group/edit/${hallGroup.id}`)"
                >
                  Редактировать
                </Button>
                <Button
                  v-if="
                    role === 'administrator' ||
                    role === 'it' ||
                    permissions.includes('downloadHallGroupReport')
                  "
                  icon="md-download"
                  class="hall-group-list-item__btn"
                  @click="createReport(hallGroup.id)"
                >
                  Скачать отчет
                </Button>
              </div>
            </div>
          </i-col>
        </transition-group>
      </Row>
    </Card>

    <Spin v-if="isLoading" fix />
  </div>
</template>

<script>
import { getHallGroupList, getHallGroupReport } from '@/api/hall-group'
import { convertISOToStrDate } from '@/libs/util'
import { DATE_FIELD_NAMES_HALLS } from '@/libs/constants'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      hallGroupsList: [],
      eventId: this.$route.params.id,
    }
  },

  computed: {
    ...mapGetters({
      role: 'role',
      permissions: 'permissions',
      getEventId: 'getEventId',
    }),
  },

  async mounted() {
    await this.getHallGroups()
  },

  methods: {
    async getHallGroups() {
      this.loading = true
      try {
        const params = {
          filter: { eventId: this.eventId || this.getEventId },
          sort: ['-sort', '-id'].join(','),
          'per-page': 0,
        }
        const { data: hallGroups } = await getHallGroupList(params)
        this.hallGroupsList = hallGroups.map((hallGroup) =>
          convertISOToStrDate(hallGroup, DATE_FIELD_NAMES_HALLS)
        )
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createReport(id) {
      const params = {
        filter: {
          id,
        },
        download: 'xlsx',
      }
      try {
        await getHallGroupReport(params)
        this.$Message.success('Вы успешно сформировали отчет')
      } catch (e) {
        this.$Message.error('Ошибка')
        throw new Error(e)
      }
    },
  },
}
</script>

<style lang="less">
@import './HallGroup.less';
</style>
