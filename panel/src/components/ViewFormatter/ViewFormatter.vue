<template>
  <Row v-if="!load" type="flex">
    <i-col
      v-for="(item, index) in formatData(data)"
      :key="index"
      span="12"
      class-name="view-card-item"
    >
      <template v-if="item.type === 'file'">
        <span class="view-card-item__title">{{ item.name }}</span>
        <p v-if="item.value" class="view-card-item__content">
          <a
            v-for="(val, i) in item.value"
            :key="i"
            target="_blank"
            :href="`${val.baseUrl}${val.path}`"
            style="margin-right: 15px"
            >Скачать файл</a
          >
        </p>
      </template>

      <template v-else-if="item.type === 'location'">
        <span class="view-card-item__title">{{ item.name }}</span>
        <p class="view-card-item__content">
          {{ `${item.value.city}${item.value.region ? ',' : ''}` }}
          <span style="font-weight: normal">{{ item.value.region || '' }}</span>
        </p>
      </template>

      <template v-else-if="item.type === 'country'">
        <span class="view-card-item__title">{{ item.name }}</span>
        <p class="view-card-item__content">
          <span v-if="item.value && item.value.country">{{ item.value.country }}</span>
        </p>
      </template>

      <template v-else>
        <span class="view-card-item__title">{{ item.name }}</span>
        <p class="view-card-item__content">
          {{ item.value }}
        </p>
      </template>
    </i-col>
  </Row>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    load: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    formatData(data) {
      return data.map((item) => {
        return { type: item.field.type, name: item.field.name, value: item.value }
      })
    },
  },
}
</script>

<style></style>
