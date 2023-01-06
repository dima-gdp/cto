<template>
  <div>
    <AppHeaderMobileMenu
      v-if="typeDevice === $options.TYPES_DEVICE.MOBILE"
      :menu="menu"
      :is-menu-open="isMenuOpen"
      menu-btn-selector=".header__menu-btn"
      @close-menu="isMenuOpen = false"
    />
    <AppHeaderTabletMenu
      v-if="typeDevice === $options.TYPES_DEVICE.TABLET"
      :menu="menu"
      :is-menu-open="isMenuOpen"
      menu-btn-selector=".header__menu-btn"
      @close-menu="isMenuOpen = false"
    />

    <header class="header">
      <div
        v-if="typeDevice === $options.TYPES_DEVICE.DESKTOP"
        class="header__preloader"
        :class="{ 'header__preloader--active': isLoading }"
      >
        <img src="@/assets/graphics/app-preloader.svg" alt="" />
      </div>

      <div
        class="header__container _container"
        :class="{ 'header__container--padding': typeDevice !== $options.TYPES_DEVICE.DESKTOP }"
      >
        <div
          v-if="typeDevice !== $options.TYPES_DEVICE.DESKTOP"
          ref="menuBtn"
          class="header__menu-btn"
        >
          <AppHeaderMenuBtn :is-menu-open="isMenuOpen" @click-menu-btn="isMenuOpen = !isMenuOpen" />
        </div>

        <div class="header__logo">
          <template v-if="logoUrl">
            <a v-if="externalLink" :href="externalLink" target="_blank">
              <img v-if="logoUrl" :src="logoUrl" alt="logo" />
            </a>
            <img v-else :src="logoUrl" alt="logo" />
          </template>
        </div>

        <nav v-if="typeDevice === $options.TYPES_DEVICE.DESKTOP" class="header__nav">
          <AppHeaderDesktopMenu :menu="menu" :window-with="windowWith" />
        </nav>

        <div class="header__helper"></div>

        <div
          v-if="typeDevice === $options.TYPES_DEVICE.DESKTOP"
          ref="manager"
          class="header__manager manager"
          @mouseover="isManagerOpen = true"
          @mouseleave="isManagerOpen = false"
        >
          <button class="manager__btn">
            <IconUser
              :style="`color: ${
                isManagerOpen ? 'var(--s-primary-color)' : 'var(--s-black-color-80)'
              }`"
            />
          </button>
          <div :class="{ 'manager__info--active': isManagerOpen }" class="manager__info">
            <AppHeaderManager />
          </div>
        </div>

        <div v-if="typeDevice !== $options.TYPES_DEVICE.MOBILE" class="header__actions">
          <AppHeaderActions />
        </div>
      </div>
    </header>
    <div class="_container">
      <div v-if="$store.getters['isActiveEventIsChild']" class="header-back" @click="toEventList">
        <div class="header-back__content s-card s-card--no-padding">
          <span class="header-back__back-icon">
            <DirectionLeftIcon />
          </span>
          <span class="header-back__text s-subtitle-secondary">
            {{ $tr('sideBar.backToEvents') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeaderActions from '@/components/base/header/app-header-actions'
import AppHeaderMenuBtn from '@/components/base/header/app-header-menu-button.vue'
import AppHeaderDesktopMenu from '@/components/base/header/app-header-desktop-menu.vue'
import AppHeaderManager from '@/components/base/header/app-header-manager.vue'
import AppHeaderTabletMenu from '@/components/base/header/app-header-tablet-menu.vue'
import AppHeaderMobileMenu from '@/components/base/header/app-header-mobile-menu.vue'
import EventService from '@/domain/services/event-service'
import LangService from '@/domain/services/lang-service'
import useEvent from '@/domain/composables/use-event'
import DirectionLeftIcon from '@/components/themed-icons/direction-left'
import IconUser from '@/components/themed-icons/icon-user'

export default {
  TYPES_DEVICE: {
    DESKTOP: 'desktop',
    TABLET: 'tablet',
    MOBILE: 'mobile',
  },

  components: {
    AppHeaderActions,
    AppHeaderMenuBtn,
    AppHeaderDesktopMenu,
    AppHeaderManager,
    AppHeaderTabletMenu,
    AppHeaderMobileMenu,
    DirectionLeftIcon,
    IconUser,
  },
  data() {
    return {
      isManagerOpen: false,
      isMenuOpen: false,
      windowWith: null,
      isLoading: false,
      menu: [],
    }
  },

  inject: ['loadFullEvent'],

  computed: {
    logoUrl() {
      return EventService.extractLogoUrl(this.$store.state.event.data)
    },

    externalLink() {
      return this.$store.state.event.data.formLink?.externalUrl || ''
    },

    typeDevice() {
      if (this.windowWith < 768) {
        return this.$options.TYPES_DEVICE.MOBILE
      }
      if (this.windowWith < 1399) {
        return this.$options.TYPES_DEVICE.TABLET
      }
      return this.$options.TYPES_DEVICE.DESKTOP
    },
  },

  watch: {
    '$route.path': {
      handler() {
        this.isMenuOpen = false
      },
    },

    isMenuOpen(val) {
      // refactor: лучше иметь два метода this.openMenu() и this.closeMenu()
      val === true ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = '')
    },
  },
  async mounted() {
    this.isLoading = true
    this.windowWith = window.innerWidth

    this.menu = await this.getMenu()
    this.isLoading = false
  },

  methods: {
    async getMenu() {
      const eventId = this.$store.getters['event/currentEventId']
      const userId = this.$store.state.auth.userId
      const menu = await useEvent().getEventMenu(eventId, userId)

      return menu
    },

    async toEventList() {
      try {
        this.$store.commit('SET_APP_IS_LOADING', true)
        await this.loadFullEvent(this.$store.getters['domain/parentEventId'])
        await LangService.toLocalePath({ path: '/events' })
      } catch (e) {
        console.error(e)
      } finally {
        this.$store.commit('SET_APP_IS_LOADING', false)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header.scss';
@import '~@/styles/blocks/header-back.scss';
</style>
