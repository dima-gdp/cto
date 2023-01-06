<template>
  <div class="content-info">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование мероприятия</span>
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

    <Row type="flex" class-name="requests-list">
      <transition-group name="requests" tag="ul">
        <i-col v-if="!load" :key="'uniq'" span="8" class-name="requests-list-item">
          <div
            class="requests-list-tile requests-list-tile--add"
            @click="$router.push({ path: `requests/create` })"
          >
            <Icon type="ios-add" />
            <p>Добавить материал</p>
          </div>
        </i-col>
        <i-col v-for="item in requestsList" :key="item.id" span="8" class-name="requests-list-item">
          <Card>
            <div class="requests-list-item__info">
              Название: <span class="text-bold">{{ item.name }}</span>
            </div>
            <div v-if="item.category" class="requests-list-item__info">
              Категория: <span class="text-bold">{{ formatCategoryName(item.category) }}</span>
            </div>
            <div class="requests-list-item__info">
              Язык: <span class="text-bold">{{ item.lang.toUpperCase() }}</span>
            </div>
            <div class="requests-list-item__action">
              <Button @click="$router.push(`requests/edit/${item.id}`)"> Редактировать </Button>
            </div>
          </Card>
        </i-col>
      </transition-group>
    </Row>
  </div>
</template>

<script>
import { getRequests } from '@/api/requests'
import { requestCategories } from './requestCategories'

export default {
  data() {
    return {
      requestsList: [],
      requestCategories,
      load: false,
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getRequests()
  },
  methods: {
    formatCategoryName(value) {
      return this.requestCategories.find((item) => item.value === value).name
    },
    async getRequests() {
      this.load = true

      const params = {
        filter: { entity: 'event', entity_id: this.eventId },
        'per-page': 0,
      }

      const { data: requestsData } = await getRequests(params)
      this.requestsList = requestsData.sort((a, b) => b.createdAt - a.createdAt)
      this.load = false
    },
  },
}
</script>

<style lang="less">
@import './Requests.less';
</style>
