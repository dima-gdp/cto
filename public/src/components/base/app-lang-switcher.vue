<template>
  <Poptip
    v-if="availableLanguages.length > 1"
    v-model="langPoptipVisible"
    width="230"
    :placement="placement"
  >
    <div :class="{ 's-card--blue': langPoptipVisible }" class="s-card s-card--no-padding">
      <div class="header-actions__item">
        <span class="s-subtitle-secondary">{{ capitalize(currentLang) }}</span>
      </div>
    </div>
    <div slot="content" class="lang-list">
      <div class="lang-list__close" @click="closePoptip">
        <feather type="x" size="24" stroke="var(--s-black-color-80)" />
      </div>
      <div
        v-for="(lang, index) in availableLocales"
        :key="index"
        :class="{ 'lang-list__item--active': lang.code === currentLang }"
        class="lang-list__item"
        @click="switchLang(lang.code)"
      >
        <span v-show="lang.code === currentLang" class="lang-list__check">
          <feather type="check" size="24" stroke="var(--s-black-color-80)" />
        </span>
        <span class="lang-list__item-name">
          {{ lang.name }}
        </span>
      </div>
    </div>
  </Poptip>
</template>

<script>
import { mapState } from 'vuex'
import AppLoadService from '@/domain/services/app-load-service'
import LogicError from '@/domain/errors/logic-error'
import { checkAccessByRoute } from '@/domain/services/page-service'
import AccessError from '@/domain/errors/access-error'
import LangService from '@/domain/services/lang-service'
import EventService from '@/domain/services/event-service'

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom-end',
    },
  },
  data() {
    return {
      langPoptipVisible: false,
    }
  },
  inject: ['loadFullEvent'],

  computed: {
    ...mapState({
      availableLanguages: (state) => state.event.data?.availableLanguages || [],
    }),
    availableLocales() {
      return this.availableLanguages.map((l) => ({
        name: this.formatLangName(l),
        code: l.toLowerCase(),
      }))
    },

    currentLang() {
      return this.$i18n.locale
    },
  },
  methods: {
    closePoptip() {
      this.langPoptipVisible = false
    },
    async switchLang(langCode) {
      const eventId = this.$store.getters['event/currentEventId']
      this.$store.commit('SET_APP_IS_LOADING', true)
      try {
        await AppLoadService.saveLangInApp(langCode)
        await this.loadFullEvent(eventId)

        // Если страница с одним языком
        if (this.$route.meta.isSingleLang) {
          const event = this.$store.state.event.data
          const pages = this.$store.state.pages.data
          const startPagePath = EventService.defineStartPagePath(event, pages)
          await this.$router.replace(this.localePath({ path: startPagePath }))
          return
        }

        // Если нет доступа к странице
        const isAccess = checkAccessByRoute(this.$route)
        if (!isAccess) {
          throw new AccessError()
        }
      } catch (e) {
        console.error(e)
        await LangService.toLocalePath({ path: '/404' })
      } finally {
        this.$store.commit('SET_APP_IS_LOADING', false)
      }
    },
    formatLangName(langCode) {
      if (langCode === 'ru') {
        return 'Русский (Ru)'
      } else if (langCode === 'en') {
        return 'English (En)'
      }
      throw new LogicError(`Неизвестная локаль - '${langCode}'`)
    },
    capitalize(str) {
      return str[0].toUpperCase() + str.slice(1)
    },
  },
}
</script>

<style scoped lang="scss">
.lang-list {
  position: relative;
  padding-top: 15px;

  &__close {
    position: absolute;
    height: 24px;
    width: 24px;
    top: 0;
    right: -6px;
    cursor: pointer;
  }

  &__item {
    position: relative;
    margin-bottom: 15px;
    margin-left: 15px;
    padding-left: 24px;

    &--active {
      font-family: var(--s-semi-bold-font);
      font-weight: 600;
    }
  }

  &__item-name {
    font-family: inherit;
    color: var(--s-black-color-80);
    cursor: pointer;
    text-decoration: none;

    &:hover,
    &:active {
      color: var(--s-primary-color-60);
      text-decoration: underline;
    }
  }

  &__check {
    position: absolute;
    left: -5px;
    top: 1px;
  }
}
</style>
