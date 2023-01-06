<template>
  <div v-if="hallGroup" class="stream-page">
    <div class="stream-page__content s-card">
      <div class="stream-page__nav">
        <Select
          v-if="halls.length > 1"
          :value="streamId"
          class="stream-page__select-stream"
          @on-change="loadStream"
        >
          <Option v-for="item in halls" :key="item.id" :value="item.streamId">
            {{ item.name }}
          </Option>
        </Select>
        <a
          v-if="hallGroup.programFile"
          target="_blank"
          class="stream-page__link-programs"
          :href="`${hallGroup.programFile.baseUrl}${hallGroup.programFile.path}`"
        >
          <feather
            class="stream-page__icon-link"
            stroke="var(--s-primary-color)"
            type="download-cloud"
            size="24"
          />
          <span> Программа<span class="hide-on-mob"> мероприятия</span> </span>
        </a>
      </div>
      <div class="stream-page__stream">
        <transition name="slide-fade">
          <div v-if="showErrorAlert">
            <Alert type="error" closable>
              {{ $tr('stream.errorMessage') }}
            </Alert>
          </div>
        </transition>
        <div
          :class="{ 'stream-page__stream--uploaded-height': !isLoading }"
          class="stream-page__stream"
        >
          <div v-show="!isLoading" id="s-stream-root" style="height: 100%"></div>
          <Spin v-show="isLoading" size="large" fix></Spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useStream from '@/domain/composables/use-stream'
import LangService from '@/domain/services/lang-service'

export default {
  data() {
    return {
      stream: null,
      isLoading: true,
      showErrorAlert: false,
      hallGroup: null,
      halls: [],
      currentStreamId: this.$route.query.currentStreamId,
    }
  },
  computed: {
    hallGroupId() {
      return this.$route.params.hallGroupId
    },
    streamId() {
      if (this.$route.query.streamId) {
        return this.$route.query.streamId
      }

      const [current] = this.halls
      return current.streamId
    },
  },
  watch: {
    '$route.params.hallGroupId': {
      handler() {
        this.init()
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      try {
        await this.createScriptSDK()

        const { halls, hallGroup } = await useStream().getHallGroupWithHalls(this.hallGroupId)
        this.halls = halls
        this.hallGroup = hallGroup

        await this.loadStream(this.streamId)
      } catch (e) {
        await LangService.toLocalePath({ path: '/404' })
        console.error(e)
      }
    },
    async createScriptSDK() {
      if (window.StreamSDK) {
        return
      } // если скрипт уже загружен, не запрашивать его заново

      const streamSDK = document.createElement('script')
      streamSDK.setAttribute('src', 'https://med.studio/js/stream-sdk.bundle.js')
      streamSDK.setAttribute('id', 'stream-sdk')
      document.head.appendChild(streamSDK)
      const streamSDKScript = document.querySelector('#stream-sdk')

      return new Promise((resolve) => {
        streamSDKScript.addEventListener('load', () => {
          resolve()
        })
      })
    },

    async initSDK(streamId) {
      if (!streamId) {
        console.error('Не найдено id трансляции')
        return
      }
      const userData = this.$store.state.auth.userData

      const credentials = {
        material_id: streamId,
        email: userData.email,
        firstname: userData.firstName,
        lastname: userData.lastName,
        middlename: userData.middleName,
      }

      const sdk = new window.StreamSDK({
        credentials,
        rootId: 's-stream-root',
      })

      await sdk.init()
      this.addLoadListenerToIframe()
    },
    addLoadListenerToIframe() {
      const iframeElement = document.querySelector('#s-stream-root>iframe')
      if (!iframeElement) {
        this.isLoading = false
        this.showErrorAlert = true
        console.warn('Что-то пошло не так при загрузке встроенной трансляции')
        // this.$sentry.captureMessage('iframeElement is null ' + JSON.stringify(this.stream));
        return
      }
      iframeElement.addEventListener('load', () => {
        this.isLoading = false
        this.showErrorAlert = false
      })
    },
    async loadStream(streamId) {
      if (this.$route.query.streamId !== streamId) {
        await this.$router.replace({ ...this.$route, query: { ...this.$route.query, streamId } })
      }
      await this.initSDK(streamId)
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/stream-page.scss';
</style>
