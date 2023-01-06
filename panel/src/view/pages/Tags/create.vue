<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание тега</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/tags/list')"> Назад </Button>
      </i-col>
    </Row>
    <CreateForm :load="load" @on-submit="createTag" />
  </div>
</template>

<script>
import CreateForm from './components/CreateForm'
import { createTag } from '@/api/tags'

export default {
  name: 'CreateTag',
  components: { CreateForm },
  data() {
    return {
      load: false,
    }
  },
  methods: {
    async createTag([data, action]) {
      this.load = true
      try {
        const res = await createTag(data),
          { id } = res.data

        this.$Message.success('Тег успешно создан')

        if (action === 'save') {
          this.$router.push({ path: '/tags/list' })
        }
        if (action === 'accept') {
          this.$router.push({ path: `/tags/edit/${id}` })
        }

        this.load = false
      } catch (e) {
        console.error(e)
        this.load = false
      }
    },
  },
}
</script>
