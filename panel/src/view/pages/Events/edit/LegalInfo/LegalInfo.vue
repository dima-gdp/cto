<template>
  <div class="content-info">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${$route.params.id}`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <LegalInfoForm
      v-model="content"
      :load="load"
      :available-langs="availableLangs"
      @change-lang="changeLang"
      @submit="updateLegalInfo"
      @delete="deleteContent"
    />
  </div>
</template>

<script>
import { getContentList, updateContent, createContent, deleteContent } from '@/api/content'
import { getEvent } from '@/api/event'

import LegalInfoForm from './LegalInfoForm'

export default {
  components: {
    LegalInfoForm,
  },
  data() {
    return {
      load: false,
      availableLangs: [],
      content: [
        {
          name: '',
          content: '',
          active: true,
        },
      ],
      event: null,
      lang: 'ru',
    }
  },
  created() {
    this.getLegalInfo(this.$route.params.id)
  },
  methods: {
    async getLegalInfo(id, lang = 'ru') {
      const params = {
        filter: {
          'entity-id': id,
          type: 'juridical',
        },
        'per-page': 0,
        lang: lang,
      }

      this.load = true
      try {
        const [contentRes, eventRes] = await Promise.all([
          getContentList(params),
          getEvent(this.$route.params.id),
        ])

        this.content = contentRes.data.reverse()
        this.availableLangs = eventRes.data.availableLanguages

        this.load = false
      } catch (e) {
        console.error(e)
        this.load = false
      }
    },
    async updateLegalInfo(data) {
      const [content, action] = data

      const update = content.filter((c) => c.hasOwnProperty('id'))
      const create = content.filter((c) => !c.hasOwnProperty('id'))

      try {
        await Promise.all([this.updateContent(update), this.createContent(create)])

        this.$Message.success('Информация успешно обновлена')
        if (action === 'save') {
          await this.$router.push({ path: `/events/edit/${this.$route.params.id}` })
        }
      } catch (e) {
        console.error(e)
        this.$Message.error('Ошибка обновления')
      }

      await this.getLegalInfo(this.$route.params.id)
    },
    async updateContent(data) {
      if (data) {
        const promiseArr = []

        for (const item of data) {
          promiseArr.push(updateContent(item.id, item))
        }

        await Promise.all(promiseArr)
      }
    },
    async createContent(data) {
      if (data) {
        const promiseArr = []

        for (const item of data) {
          promiseArr.push(createContent(item))
        }

        await Promise.all(promiseArr)
      }
    },
    async deleteContent(id) {
      await deleteContent(id)
      await this.getLegalInfo(this.$route.params.id)
    },
    changeLang(lang) {
      this.getLegalInfo(this.$route.params.id)
    },
  },
}
</script>

<style lang="less">
.tabs {
  margin-left: 20px;
}

.ivu-tabs-bar {
  border-bottom: 0px;
  margin-bottom: 1px;
}
</style>
