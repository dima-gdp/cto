<template>
  <div class="juridical-detail">
    <Row :gutter="15">
      <i-col span="24">
        <Card class="juridical-detail-edit">
          <h3 class="juridical-detail-edit__title">Основная информация</h3>
          <Form ref="form" :model="form" :rules="ruleValidate" label-position="top">
            <Row :gutter="15">
              <i-col span="8">
                <FormItem prop="technicalName" label="Тех. название:">
                  <Input
                    v-model="form.technicalName"
                    placeholder="используется внутри админ. панели"
                  ></Input>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem prop="name" label="Полное название:">
                  <Input v-model="form.name" placeholder="полное название юр. лица"></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Spin v-if="load" fix></Spin>
        </Card>
        <Card class="juridical-detail-disclaimer">
          <h3 class="juridical-detail-disclaimer__title">
            Политика Конфиденциальности персональных данных
          </h3>
          <MarkdownEditor v-model="form.disclaimer" autoinit />
        </Card>
        <div class="juridical-detail__btn-block">
          <Button size="large" @click="handleSave(false)">Применить</Button>
          <Button type="primary" size="large" @click="handleSave(true)">Сохранить</Button>
        </div>
      </i-col>
    </Row>
    <div v-if="edit" class="juridical-payments">
      <Row type="flex" justify="center" align="middle" class-name="view-header">
        <i-col class-name="view-header__divider">
          <Divider orientation="left">
            <h3>Провайдеры оплаты</h3>
          </Divider>
        </i-col>
      </Row>
      <Row :gutter="15">
        <transition-group name="fade">
          <i-col
            v-for="item in payments"
            :key="item.id"
            :sm="24"
            :md="12"
            :lg="6"
            class-name="juridical-payments__item"
          >
            <Card :title="item.name">
              <Button long :to="'/juridical/provider-edit/' + item.id">Редактировать</Button>
            </Card>
          </i-col>
        </transition-group>
        <i-col :sm="24" :md="12" :lg="6" class-name="juridical-payments__item">
          <Card title="Добавить провайдера">
            <Button
              long
              type="primary"
              icon="md-add"
              :to="'/juridical/provider-create/' + $route.params.id"
            >
              Добавить
            </Button>
          </Card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import { getLegalEntitiesInfo } from '@/api/legalEntities'
import { getAllPaymentProviders } from '@/api/payments'
import { getDate } from '@/libs/tools'
import MarkdownEditor from '@/components/markdown'

export default {
  name: 'JuridicalDetail',
  components: { MarkdownEditor },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filter: {},
      load: false,
      loadPayments: false,
      activity: null,
      payments: null,
      form: {
        id: null,
        name: '',
        technicalName: '',
        status: 1,
      },
      ruleValidate: {
        name: [{ required: true, message: 'Не может быть пустым полем', trigger: 'blur' }],
        technicalName: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
      },
    }
  },
  watch: {
    activity() {
      if (this.activity === true) {
        this.form.status = 2
      } else if (this.activity === false) {
        this.form.status = 1
      }
    },
  },
  created() {
    this.getJuridical()
  },
  methods: {
    getDate: getDate,
    handleChangeStatus(status) {
      this.form.status = status ? 2 : 1
    },
    handleSave(redirect) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('on-save', this.form, redirect)
        } else {
          this.$Message.error('В форме есть ошибки!')
        }
      })
    },
    handleDelete() {
      this.$Modal.confirm({
        title: 'Удаление',
        content: '<p>Вы уверены что хотите удалить юр. лицо ?</p><p>Это действие необратимо!</p>',
        onOk: () => {
          this.$emit('on-delete', this.form)
        },
      })
    },
    getJuridical() {
      if (this.edit) {
        this.load = true
        getLegalEntitiesInfo(this.$route.params.id)
          .then((res) => {
            if (res.data.disclaimer) {
              this.form = res.data
            } else {
              this.form = { ...res.data, disclaimer: '' }
            }
            this.getPayments(this.$route.params.id)
            this.load = false
          })
          .catch((e) => {
            throw new Error(e)
          })
      }
    },
    getPayments(id) {
      this.loadPayments = true

      const params = {
        filter: {
          'legal-entity-id': id,
        },
      }

      getAllPaymentProviders(params)
        .then((res) => {
          this.payments = res.data
          this.loadPayments = false
        })
        .catch((e) => {
          throw new Error(e)
        })
    },
  },
}
</script>
