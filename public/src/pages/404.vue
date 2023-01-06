<template>
  <div>
    <div>
      <div class="s-card error">
        <div class="error__code">404</div>
        <div class="error__body">
          <p class="error__text">
            {{ $tr('error.text.caption.404') }}
          </p>
          <p class="error__text error__text--fuzzy">
            {{ $tr('error.text.description.404') }}
          </p>
        </div>
        <div class="error__button">
          <Button :disabled="isLoading" type="primary" @click="backToSafePage">
            {{ $tr('error.button') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventService from '@/domain/services/event-service'
import LangService from '@/domain/services/lang-service'

export default {
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    async backToSafePage() {
      if (this.$isLoggedIn) {
        this.isLoading = true
        const event = this.$store.state.event.data
        const pages = this.$store.state.pages.data
        const startPagePath = EventService.defineStartPagePath(event, pages)
        this.isLoading = false
        await LangService.toLocalePath({ path: startPagePath })
      } else {
        await LangService.toLocalePath({ path: '/login' })
      }
    },
  },
}
</script>

<style lang="scss">
.error {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__code {
    margin-top: 8px;
    font-size: 86px;
    font-weight: 500;
    color: var(--s-primary-color-70);

    @include media-breakpoint-up(lg) {
      font-size: 92px;
    }
  }

  &__body {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.5;
  }

  &__text {
    padding: 4px 0px;
    font-size: 14px;
    color: var(--s-black-color-80);
    font-family: var(--s-medium-font);
    font-weight: 500;

    &--fuzzy {
      font-weight: 400;
      font-family: var(--s-regular-font);
    }
  }

  &__button {
    margin-top: 28px;
  }
}
</style>
