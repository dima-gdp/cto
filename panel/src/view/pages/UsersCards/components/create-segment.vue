<template>
  <div>
    <!-- <div class="filter-values">
      <h3>Значения фильтров</h3>
      <pre>{{ decodedFilterObject }}</pre>
    </div>
    <Divider /> -->
    <div class="create-segment-form">
      <Form
        ref="createSegmentForm"
        :model="createForm"
        :rules="createFormRules"
        label-position="top"
      >
        <FormItem label="Название" prop="name">
          <Input v-model="createForm.name" type="text" />
        </FormItem>
        <FormItem label="Тип" prop="type">
          <Select v-model="createForm.type" type="text">
            <Option value="call_center"> Коллцентр </Option>
            <Option value="marketing"> Маркетинг </Option>
            <Option value="other"> Другое </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" :disabled="isCreateInProgress" @click="createSegment">
            Создать
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { createSegment, applyFilterToSegment } from '@/api/segments'

export default {
  props: {
    filter: {
      type: [Object, Array],
      default: () => ({}),
    },
  },
  data() {
    return {
      isCreateInProgress: false,
      createForm: {
        name: '',
        type: '',
      },
      createFormRules: {
        name: [{ required: true, message: 'Название - обязательное поле' }],
        type: [{ required: true, message: 'Тип - обязательное поле' }],
      },
    }
  },
  computed: {
    decodedFilterObject() {
      console.info(this.filter)
      return decodeURIComponent(JSON.stringify(this.filter, null, '  '))
    },
  },
  methods: {
    async createSegment() {
      const isValid = await this.$refs['createSegmentForm'].validate()

      if (isValid) {
        this.isCreateInProgress = true

        try {
          const { data: segment } = await createSegment({ ...this.createForm })
          await applyFilterToSegment(segment.id, {
            data: { filter: JSON.parse(this.decodedFilterObject) },
          })

          this.$Message.success('Сегмент успешно создан')
          this.isCreateInProgress = false

          this.$emit('segment-created')
        } catch (e) {
          console.error(e)
          this.$Message.error('В процессе создания произошла ошибка')
          this.isCreateInProgress = false
        }
      }
    },
  },
}
</script>

<style>
.filter-values {
  font-size: 14px;
}
</style>
