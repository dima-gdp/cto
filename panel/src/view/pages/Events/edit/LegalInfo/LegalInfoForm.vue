<template>
  <div>
    <Row type="flex" justify="space-between" class="legal-info-form-header">
      <Tabs v-model="tab" :animated="false" class="legal-info-form-header__item">
        <TabPane
          v-for="l in availableLangs"
          :key="l"
          :label="l.toUpperCase()"
          :disabled="load"
        ></TabPane>
      </Tabs>
      <Button
        v-if="langFilteredForms.length > 0"
        type="text"
        ghost
        size="small"
        class="legal-info-form-header__item"
        @click="addLegalInfo"
      >
        <Icon type="ios-add"></Icon>
        Добавить еще
      </Button>
    </Row>
    <Row v-if="langFilteredForms.length > 0" type="flex">
      <i-col
        v-for="(form, index) in langFilteredForms"
        :key="index"
        span="24"
        class-name="legal-info-form"
      >
        <Card>
          <Row type="flex" justify="space-between" class-name="legal-info-form__title">
            <h3>Юридическая информация</h3>
            <a style="color: #ed4014" @click.prevent="deleteLegalInfo(form, index)">Удалить</a>
          </Row>
          <Form :ref="`legalInfo-${index}`" :model="form" :rules="formRules" label-position="top">
            <Row type="flex">
              <i-col :lg="21" :md="24" :sm="24">
                <FormItem
                  class="legal-info-form__item"
                  label="Название - ссылка для открытия"
                  prop="name"
                >
                  <Input v-model="form.name" placeholder="Введите название юридического пункта" />
                </FormItem>
              </i-col>

              <i-col :lg="3" :md="24" :sm="24">
                <FormItem class="legal-info-form__item" label="Отображать" prop="active">
                  <i-switch v-model="form.active" size="large">
                    <span slot="open">Да</span>
                    <span slot="close">Нет</span>
                  </i-switch>
                </FormItem>
              </i-col>

              <i-col :lg="24" :md="24" :sm="24">
                <FormItem class="legal-info-form__item" label="Контентная часть" prop="content">
                  <MarkdownEditor v-model="form.content" autoinit />
                </FormItem>
              </i-col>
            </Row>
          </Form>

          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
    </Row>
    <Row v-else type="flex">
      <i-col span="24" class-name="legal-info-form">
        <div class="legal-info-form-placeholder" @click="addLegalInfo">
          <Icon type="ios-add" />
          <h3>Добавить юридическую информацию</h3>
          <Spin v-if="load" fix></Spin>
        </div>
      </i-col>
    </Row>
    <Row v-if="langFilteredForms.length > 0" type="flex" justify="end">
      <i-col :lg="3" :sm="6" class-name="legal-info-form-actions">
        <Button
          :disabled="load"
          class="legal-info-form-actions__btn"
          long
          @click="submitForm(value, 'accept')"
        >
          Применить
        </Button>
      </i-col>
      <i-col :lg="3" :sm="6" class-name="legal-info-form-actions">
        <Button
          :disabled="load"
          type="primary"
          class="legal-info-form-actions__btn"
          long
          @click="submitForm(value, 'save')"
        >
          Сохранить
        </Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
// TODO: Поправить мутации пропсов
/* eslint-disable vue/no-mutating-props */
import MarkdownEditor from '_c/markdown'
export default {
  components: {
    MarkdownEditor,
  },
  props: {
    load: { type: Boolean, default: false },
    value: { type: Array, default: () => [] },
    availableLangs: { type: Array, default: () => [] },
  },
  data() {
    return {
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        active: [{ required: true, message: 'Это поле обязательно!' }],
        content: [{ required: true, message: 'Это поле обязательно!' }],
      },
      tab: 0,
    }
  },
  computed: {
    lang() {
      return this.availableLangs[this.tab]
    },
    langFilteredForms() {
      return this.value.filter((form) => form.lang === this.lang)
    },
  },
  watch: {
    tab(newValue) {
      if (!this.load) {
        this.$emit('change-lang', this.availableLangs[newValue])
      }
    },
  },
  methods: {
    validateForm(forms) {
      const validate = []

      forms.forEach((form, index) => {
        const [currentForm] = this.$refs[`legalInfo-${index}`]

        if (currentForm) {
          currentForm.validate((valid) => {
            if (this.$refs[`legalInfo-${index}`].length > 0) {
              validate.push(valid)
              return valid
            }
          })
        }
      })

      return !validate.includes(false)
    },
    submitForm(forms, action) {
      const valid = this.validateForm(this.langFilteredForms)
      if (valid) {
        this.$emit('submit', [this.value, action])
      }
    },
    addLegalInfo() {
      const exemplar = {
        name: '',
        active: true,
        content: '',
        type: 'juridical',
        entityId: this.$route.params.id,
        entity: 'event',
        lang: this.lang,
      }

      this.value.unshift(exemplar)
      this.$emit('input', this.value)
    },
    deleteLegalInfo(form, index) {
      if (form.hasOwnProperty('id')) {
        this.$emit('delete', form.id)
      } else {
        this.$emit(
          'input',
          this.value.filter((form, pos) => pos !== index)
        )
      }
    },
  },
}
</script>

<style lang="less">
@import './LegalInfoForm.less';

.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
