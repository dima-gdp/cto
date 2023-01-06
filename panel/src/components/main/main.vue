<template>
  <Layout style="height: 100%" class="main">
    <Sider
      v-model="collapsed"
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      class="left-sider"
      :style="{ overflow: 'hidden' }"
    >
      <SideMenu
        ref="sideMenu"
        accordion
        :active-name="$route.name"
        :collapsed="collapsed"
        :menu-list="menuList"
        @on-select="turnToPage"
      >
        <br />
        <!--        <div class="logo-con">-->
        <!--          <img v-show="!collapsed" src="@/assets/images/logo-cto.svg" key="max-logo" />-->
        <!--          <img v-show="collapsed" src="@/assets/images/logo-cto.svg" key="min-logo" />-->
        <!--        </div>-->
      </SideMenu>
    </Sider>
    <Layout>
      <Header v-if="role === 'manager'" class="header-con">
        <HeaderBar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <ErrorStore
            v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
            :has-read="hasReadErrorPage"
            :count="errorCount"
          ></ErrorStore>
          <!-- <user  :user-name="userName"/> -->
          <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/> -->
        </HeaderBar>
      </Header>
      <Header v-else class="header-con">
        <Row type="flex" align="middle" justify="space-between" class-name="admin-header">
          <i-col span="1">
            <Badge :count="countReports">
              <router-link to="/reports/list">
                <Icon type="ios-notifications-outline" size="21"></Icon>
              </router-link>
            </Badge>
          </i-col>
          <i-col span="1" class="header-bar__logout">
            <div @click="logout()">
              <Icon type="ios-log-out" color="#ed4014" :size="21" />
            </div>
          </i-col>
        </Row>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <STitle v-if="!$route.meta.hasOwnProperty('hideInMenu')" :value="$route.meta.title" />
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <ABackTop :height="100" :bottom="30" :left="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Spin v-if="isEventLoading" size="large" fix></Spin>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import ABackTop from './components/a-back-top'
import ErrorStore from './components/error-store'
import STitle from '@/components/STitle'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual, delPermissions, delEventId } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    ErrorStore,
    ABackTop,
    STitle,
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
    }
  },
  computed: {
    ...mapGetters(['isEventLoading', 'role']),
    ...mapGetters('reports', ['countReports']),
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    tagRouter() {
      return this.$store.state.app.tagRouter
    },
    userName() {
      return this.$store.state.user.userName
    },
    cacheList() {
      const list = [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter((item) => !(item.meta && item.meta.notCache))
              .map((item) => item.name)
          : []),
      ]
      return list
    },
    menuList() {
      return this.$store.getters.menuList
    },
    local() {
      return this.$store.state.app.local
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage
    },
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push',
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    },
  },
  created() {
    this.loading = true
    // this.getReports();
    // setInterval(this.getReports, 30000)
  },
  beforeDestroy() {
    // clearInterval(this.getReports)
  },
  mounted() {
    this.loading = false
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta },
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName,
      })
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag',
    ]),
    ...mapActions(['handleLogin', 'handleLogOut']),
    ...mapActions('reports', ['getReports']),
    turnToPage(route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query,
      })
    },
    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick(item) {
      this.turnToPage(item)
    },
    logout() {
      delEventId()
      delPermissions()
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login',
        })
      })
    },
  },
}
</script>

<style>
/* перебиваю айвью-стиль */
.content-wrapper {
  height: calc(100vh - 140px);
}
.filter-area__remove-btn i.ivu-icon.ivu-icon-md-close {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
