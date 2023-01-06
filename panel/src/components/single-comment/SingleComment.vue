<template>
  <div class="single-comment">
    <h3 class="single-comment__title">
      {{ title }}
    </h3>
    <Row type="flex">
      <i-col span="24">
        <Input
          :value="value"
          class="single-comment__area"
          type="textarea"
          :autosize="{ minRows: minRows }"
          :placeholder="placeholder"
          @input="$emit('input', $event)"
        />
        <div class="single-comment-actions">
          <Button class="single-comment-actions__btn" type="success" long @click="saveComment">
            {{ saveBtnLabel }}
          </Button>
          <!-- <Button
            v-if="showCancel"
            @click="cancel"
            class="single-comment-actions__btn"
            long>{{ cancelBtnLabel }}</Button> -->
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Комментарий',
    },
    saveBtnLabel: {
      type: String,
      default: 'Сохранить комментарий',
    },
    cancelBtnLabel: {
      type: String,
      default: 'Отмена',
    },
    placeholder: {
      type: String,
      default: 'Введите комментарий...',
    },
    minRows: {
      type: Number,
      default: 3,
    },
    // TODO: Поставить значения по-умолчанию у пропсов
    /* eslint-disable vue/require-default-prop */
    maxRows: {
      type: Number,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, null],
    },
    /* eslint-enable vue/require-default-prop */
  },
  methods: {
    saveComment() {
      this.$emit('save-comment', this.value)
    },
    // cancel () {
    //   this.$emit('cancel')
    // }
  },
}
</script>

<style lang="less">
@import './SingleComment.less';
</style>
