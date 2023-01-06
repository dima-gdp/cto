<template>
  <div class="event-documents">
    <div class="event-documents__header">
      <Row type="flex" justify="center" align="middle" class-name="view-header">
        <i-col class-name="view-header__divider">
          <Divider orientation="left">
            <span style="font-size: 36px">Документы</span>
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
    </div>
    <div class="event-documents__filter-lang">
      <h3>Выберите язык:</h3>
      <RadioGroup
        v-model="language"
        type="button"
        button-style="solid"
        class="event-documents__filter-toggle"
      >
        <Radio label="ru"></Radio>
        <Radio label="en"></Radio>
      </RadioGroup>
    </div>
    <div class="event-documents__content">
      <div class="event-documents__creat-document" @click="newDocumentShow = true">
        Добавить новый документ
      </div>
      <DocumentCard
        v-if="newDocumentShow"
        :data="newDocument"
        @create="createDocument"
      ></DocumentCard>
      <DocumentCard
        v-for="document in documents"
        :key="document.id"
        :data="document"
        :loading="loading"
        @delete="deleteDocument"
        @update="updateDocument"
      />
    </div>
  </div>
</template>

<script>
import DocumentCard from './DocumentCard'
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/api/documents'
export default {
  components: {
    DocumentCard,
  },
  data() {
    return {
      language: 'ru',
      newDocumentShow: false,
      loading: false,
      newDocument: {
        eventId: this.$route.params.id,
        active: true,
        name: null,
        file: null,
        fileId: null,
        lang: 'ru',
      },
      eventId: this.$route.params.id,
      documents: null,
      meta: null,
    }
  },
  watch: {
    language(value) {
      this.newDocument.lang = value
      this.getDocuments()
    },
  },
  created() {
    this.getDocuments()
  },
  methods: {
    async getDocuments() {
      const { data, meta } = await getDocuments({
        filter: { eventId: this.eventId, lang: this.language },
        include: 'file',
      })
      this.documents = data
      this.meta = meta
    },
    async createDocument(data) {
      try {
        const res = await createDocument(data)
        await this.getDocuments()
        this.newDocument.name = ''
        this.newDocument.file = null
        this.newDocumentShow = false
        this.$Message.success('Новый документ успешно создан')
      } catch (e) {
        console.error(e)
      }
    },
    async updateDocument(id, data) {
      this.loading = true
      try {
        await updateDocument(id, data)
        this.loading = false
        await this.getDocuments()
        this.$Message.success('Документ успешно обновлен')
      } catch (e) {
        console.error(e)
        this.loading = false
      }
    },
    async deleteDocument(id) {
      this.$Modal.confirm({
        title: 'Удаление документа',
        okText: 'Удалить',
        content: `<p>Вы уверены что хотите удалить документ: id${id}</p>`,
        onOk: () => {
          deleteDocument(id)
            .then((res) => {
              this.$Message.success('Документ успешно удален')
              this.getDocuments()
            })
            .catch((e) => {
              console.error(e)
            })
        },
      })
    },
  },
}
</script>
<style lang="less">
@import './EventDocuments';
</style>
