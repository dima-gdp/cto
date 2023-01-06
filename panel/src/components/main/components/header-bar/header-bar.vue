<template>
  <div class="header-bar">
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <Row type="flex" align="middle">
      <i-col span="1" class="header-bar__notify">
        <Badge :count="countReports">
          <router-link to="/reports/list">
            <Icon type="ios-notifications-outline" size="21"></Icon>
          </router-link>
        </Badge>
      </i-col>

      <i-col span="22">
        <div class="header-bar-wrap">
          <div class="header-bar-info">
            <div class="header-bar-info__desc">
              <span>Вы работаете с мероприятием:</span>
            </div>
            <h2 class="header-bar-info__title">
              <span v-if="eventName">{{ eventName }}</span>
            </h2>
          </div>
          <div class="header-change-event">
            <Button @click="changeEvent"> Сменить </Button>
          </div>
        </div>
      </i-col>
      <i-col span="1" class="header-bar__logout">
        <div @click="logout()">
          <Icon type="ios-log-out" color="#ed4014" :size="21" />
        </div>
      </i-col>
    </Row>
    <!-- <div class="custom-content-con">
      <slot></slot>
    </div> -->
  </div>
</template>
<script>
import { delPermissions, delEventId } from '@/libs/util'
import { mapActions, mapGetters } from 'vuex'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  props: {
    collapsed: Boolean,
  },
  computed: {
    ...mapGetters('reports', ['countReports']),
    ...mapGetters({
      eventName: 'eventName',
      breadCrumbList: 'breadCrumbList',
    }),
  },
  created() {
    // this.getReports();
    // setInterval(this.getReports, 30000)
  },
  beforeDestroy() {
    // clearInterval(this.getReports)
  },
  methods: {
    ...mapActions('reports', ['getReports']),
    ...mapActions(['handleLogOut', 'handleSelectedEvent']),
    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state)
    },
    changeEvent() {
      delPermissions()
      delEventId()
      this.handleSelectedEvent('')
      this.$router.push({ path: '/select-event' })
    },
    logout() {
      delPermissions()
      delEventId()
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login',
        })
      })
    },
  },
}
</script>
