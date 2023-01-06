<template>
  <div class="request-item">
    <div class="request-item__table">
      <div class="request-item__row">
        <div class="request-item__head">ID</div>
        <div class="request-item__content">
          {{ data.requestId }}
        </div>
      </div>
      <div class="request-item__row">
        <div class="request-item__head">
          {{ $tr(getRequestI18n('requestType')) }}
        </div>
        <div class="request-item__content">
          {{ data.name }}
        </div>
      </div>
      <div class="request-item__row">
        <div class="request-item__head">
          {{ $tr(getRequestI18n('requestAlertStatus')) }}
        </div>
        <div class="request-item__content">
          <div class="request-item__status" :class="statusClass(data.status)">
            {{ statusText(data.status) }}
          </div>
        </div>
      </div>
      <div v-if="data.comment" class="request-item__row">
        <div class="request-item__head">
          {{ $tr('request.comment') }}
        </div>
        <div class="request-item__content">
          {{ data.comment }}
        </div>
      </div>
      <div class="request-item__row">
        <div class="request-item__head">
          {{ $tr(getRequestI18n('requestDate')) }}
        </div>
        <div class="request-item__content">
          {{ fromISOToString(data.createdAt) }}
        </div>
      </div>
    </div>
    <div v-if="!dateExpired" class="card-list-item__btn-block">
      <span class="sent-requests__remove s-pointer" @click="deleteUserRequest">
        <feather type="trash-2" stroke="#FF6262" size="24" />
      </span>
    </div>
  </div>
</template>
<script>
import { fromISOToString } from '@/utils'
import { REQUESTS_TYPE_MAP, REQUESTS_TYPE_COLOR_MAP } from '@/utils/constants'

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    category: {type: String, default: ''},
    dateExpired: {type: Boolean, default: false},
  },
  methods: {
    fromISOToString,
    getRequestI18n(key) {
      return `request.${this.category}.` + key
    },
    statusClass(type) {
      return `request-item__status--${REQUESTS_TYPE_COLOR_MAP[type]}`
    },
    statusText(status) {
      return this.$tr(`request.status.${REQUESTS_TYPE_MAP[status]}`)
    },
    deleteUserRequest() {
      this.$emit('del-request', this.data.requestId)
    },
  },
}
</script>
<style lang="scss">
.request-item {
  display: flex;
  position: relative;
  margin-bottom: 15px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  overflow: hidden;
  word-break: break-word;

  &__table {
    text-align: left;
    width: 100%;
    @include media-breakpoint-down(sm) {
      padding: 6px 0px;
    }
  }

  &__row {
    display: flex;

    &:first-child {
      > .card-list-item__head {
        padding: 16px 24px 0 24px;
        border-radius: 5px 0 0 0;
      }

      > .card-list-item__content {
        padding: 16px 24px 0 24px;
      }
    }

    &:last-child {
      > .card-list-item__head {
        padding: 0 24px 16px 24px;
        border-radius: 0 0 0 5px;
      }

      > .card-list-item__content {
        padding: 0 24px 16px 24px;
      }
    }

    @include media-breakpoint-down(sm) {
      flex-direction: column;
      padding: 5px 18px;
    }
  }

  &__head {
    min-width: 220px;
    background-color: var(--s-black-color-5);
    padding: 14px 20px;
    letter-spacing: 0.1px;
    font-family: var(--s-semi-bold-font-font);
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    @include media-breakpoint-down(sm) {
      min-width: initial;
      background-color: #fff;
      padding: 0;
    }
  }

  &__content {
    flex-grow: 1;
    white-space: normal;
    padding: 14px 20px;
    color: var(--var-black-80);
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    font-family: var(--s-regular-font);
    font-weight: 400;
    @include media-breakpoint-down(sm) {
      padding: 0;
    }
  }

  &__btn-block {
    position: absolute;
    right: 24px;
    top: 16px;
  }

  &__status {
    &--warning {
      color: var(--s-warning-color);
    }

    &--danger {
      color: var(--s-error-color);
    }

    &--success {
      color: var(--s-success-color);
    }
  }
}
</style>
