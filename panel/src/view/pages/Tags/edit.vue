<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование тега</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/tags/list')"> Назад </Button>
      </i-col>
    </Row>
    <EditForm :tag="tag" :load="load" @on-submit="updateTag" />
  </div>
</template>

<script>
import EditForm from './components/EditForm'
import { updateTag, getCurrentTag } from '@/api/tags'

export default {
  name: 'EditTag',
  components: { EditForm },
  data() {
    return {
      load: false,
      tag: null,
    }
  },
  computed: {
    tagId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getTag()
  },
  methods: {
    async getTag() {
      this.load = true
      try {
        const { data } = await getCurrentTag(this.tagId)
        this.tag = data
      } catch (e) {
        console.error(e)
        this.load = false
      }
      this.load = false
    },
    async updateTag([data, action]) {
      this.load = true

      try {
        await updateTag(this.tagId, data)
        this.$Message.success('Тег успешно обновлен!')
      } catch (e) {
        console.error(e)
        this.load = false
      }

      if (action === 'save') {
        this.$router.push({ path: '/tags/list' })
      }
      this.load = false
    },
  },
}
</script>
