<template>
  <Card class="event-page-access__create-access">
    <Spin v-if="loading" size="large" fix> </Spin>
    <h4 class="event-page-access-settings__title">Добавить пользователей</h4>
    <Row :gutter="10" class="event-page-access__add-users">
      <i-col span="12">
        <Form ref="formAccess" :model="formAccess" :rules="rulesAccess">
          <FormItem label="E-mail" prop="email">
            <Input
              v-model="formAccess.email"
              :rows="5"
              type="textarea"
              placeholder="Введите email пользователей, которым вы хотите выдать доступ. Список email можно ввести через запятую или с новой строки"
            />
          </FormItem>
        </Form>
      </i-col>
      <i-col span="12">
        <div class="event-page-access__add-users-text">
          <p>
            При загрузке списка e-mail адресов, все найденные пользователи получат доступ, а адреса
            всех не найденных пользователей останутся в поле для ввода
          </p>
        </div>
      </i-col>
    </Row>
    <div class="event-page-access__btn-block">
      <Button type="primary" @click="showModal">Добавить пользователей</Button>
    </div>

    <Modal v-model="modalAddUser" @on-ok="createAccess">
      <p>Вы уверены что хотите добавить пользователей?</p>
      <p>После изменения пользователям будут отправлены уведомления</p>
    </Modal>
  </Card>
</template>
<script>
import { createEventPagesAccess } from '@/api/event-page'
export default {
  props: {
    eventPageId: { type: [String, Number], default: '' },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      modalAddUser: false,
      formAccess: {
        email: '',
      },
      rulesAccess: {
        email: [{ required: true, message: 'Это поле обязательно!', trigger: 'change' }],
      },
    }
  },
  methods: {
    showModal() {
      this.$refs['formAccess'].validate(async (valid) => {
        if (valid) {
          this.modalAddUser = true
        } else {
          this.$Message.error('Заполните необходимые поля')
        }
      })
    },

    async createAccess() {
      const params = {
        emails: this.formAccess.email,
        eventPageIds: [this.eventPageId],
      }

      try {
        const { data } = await createEventPagesAccess(params)
        if (data.emails.length === 0) {
          this.$Message.success('Все пользователи успешно добавлены')
          this.formAccess.email = ''
          this.handleReset('formAccess')
        } else {
          this.$Message.warning('Не все пользователи были добавлены')
          this.formAccess.email = data.emails
        }
        this.$emit('create-access')
        // await this.findByFilter(this.filter)
      } catch (e) {
        console.error(e)
      }
    },

    handleReset(name) {
      this.$refs[name].resetFields()
    },
  },
}
</script>
