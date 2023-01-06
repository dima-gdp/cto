<template>
  <div>
    <Card dis-hover>
      <!--      показывать форму только после загрузки опций (привет реактивность)-->
      <Form ref="eventForm" :model="form" :rules="$options.eventFormRules">
        <Row type="flex" :gutter="12">
          <i-col :lg="18" :md="24" :sm="24">
            <FormItem class="org-form__item" label="Техническое название" prop="technicalName">
              <Input v-model="form.technicalName" placeholder="Введите тех. название мероприятия" />
            </FormItem>
          </i-col>
          <i-col :lg="6" :md="24" :sm="24">
            <FormItem class="org-form__item" label="Юр.лицо - владелец данных" prop="legalEntityId">
              <Select v-model="form.legalEntityId" placeholder="Выберите юр.лицо">
                <Option v-for="item in legalEntityOptions" :key="item.id" :value="+item.id">
                  {{ item.technicalName }}
                </Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem
              class="org-form__item"
              label="E-mail для отбивки о регистрации участника"
              prop="notifyEmail"
            >
              <Input v-model="form.notifyEmail" placeholder="Введите e-mail" />
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem class="org-form__item" label="Тема" prop="colorThemeId">
              <Select v-model="form.colorThemeId" placeholder="Выберите тему">
                <Option v-for="item in themesOptions" :key="item.id" :value="+item.id">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col span="3">
            <FormItem class="org-form__item" label="Языки" prop="availableLanguages">
              <Select
                v-model="form.availableLanguages"
                placeholder="Выберите доступные в мероприятии языки"
                multiple
              >
                <Option v-for="lang in ['ru', 'en']" :key="lang" :value="lang">
                  {{ lang }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col span="3">
            <FormItem class="org-form__item" label="Язык по умолчанию" prop="defaultLanguage">
              <Select
                v-model="form.defaultLanguage"
                placeholder="Выберите язык по умолчанию"
                :disabled="!(form.availableLanguages && form.availableLanguages.length)"
              >
                <Option v-for="lang in form.availableLanguages" :key="lang" :value="lang">
                  {{ lang }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col span="6">
            <FormItem class="org-form__item" label="Тип мероприятия" prop="type">
              <Select v-model="form.type" placeholder="Выберите тип мероприятия">
                <Option v-for="item in eventTypes" :key="item.value" :value="item.value">
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col span="6">
            <FormItem
              class="org-form__item org-form__item--mb"
              label="Активность мероприятия"
              prop="active"
            >
              <i-switch v-model="form.active" />
            </FormItem>
            <FormItem class="org-form__item" label="Есть лендинг" prop="showLanding">
              <i-switch v-model="form.showLanding" :disabled="role === $options.ROLES.manager" />
            </FormItem>
          </i-col>

          <i-col span="6">
            <FormItem label="Начало регистрации" prop="registrationStartedAt">
              <Input
                v-model="form.registrationStartedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату начала регистрации"
              />
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="Окончание регистрации" prop="registrationEndedAt">
              <Input
                v-model="form.registrationEndedAt"
                v-mask="'##-##-#### ##:##'"
                type="text"
                placeholder="Введите дату окончания регистрации"
              />
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>

    <slot />

    <div style="height: 30px"></div>
    <Row type="flex" :gutter="24">
      <i-col :lg="12" :sm="6" class-name="org-form-actions">
        <Button :disabled="isLoading" class="org-form-actions__btn" long @click="save('edit')">
          Сохранить и остаться на странице
        </Button>
      </i-col>
      <i-col :lg="12" :sm="6" class-name="org-form-actions">
        <Button
          :disabled="isLoading"
          type="primary"
          class="org-form-actions__btn"
          long
          @click="save('list')"
        >
          Сохранить и вернуться к списку мероприятий
        </Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { validateDateTime } from '@/libs/validators'
import { fromISOToString, fromStringToISO } from '@/libs/util'
import { ROLES } from '@/domain/role'
import { mapGetters } from 'vuex'

const dateRules = [
  {
    validator: validateDateTime,
    message: 'Дата должна иметь формат: 12-01-2020 18:00',
    trigger: 'blur',
  },
]

const eventFormRules = {
  technicalName: [{ required: true, message: 'Это поле обязательно!' }],
  legalEntityId: [{ required: true, message: 'Это поле обязательно!' }],
  type: [{ required: true, message: 'Это поле обязательно!' }],
  defaultLanguage: [{ required: true, message: 'Это поле обязательно!' }],
  colorThemeId: [{ required: true, message: 'Это поле обязательно!' }],
  registrationStartedAt: [...dateRules],
  registrationEndedAt: [...dateRules],
}

export default {
  name: 'FormEvent',
  model: {
    prop: 'eventMainData',
    event: 'updateEventMainData',
  },
  props: {
    legalEntityOptions: { type: Array, default: () => [] },
    themesOptions: { type: Array, default: () => [] },
    eventTypes: { type: Array, default: () => [] },
    eventMainData: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, required: true },
  },

  eventFormRules,
  ROLES,

  data() {
    return {
      form: {
        technicalName: this.eventMainData.technicalName,
        legalEntityId: this.eventMainData.legalEntityId,
        notifyEmail: this.eventMainData.notifyEmail,
        colorThemeId: this.eventMainData.colorThemeId,
        defaultLanguage: this.eventMainData.defaultLanguage,
        availableLanguages: this.eventMainData.availableLanguages,
        registrationStartedAt: fromISOToString(this.eventMainData.registrationStartedAt),
        registrationEndedAt: fromISOToString(this.eventMainData.registrationEndedAt),
        type: this.eventMainData.type,
        active: this.eventMainData.active,
        showLanding: this.eventMainData.showLanding,
      },
    }
  },

  computed: {
    ...mapGetters(['role']),
  },

  watch: {
    form: {
      async handler(value) {
        this.$emit('updateEventMainData', {
          ...value,
          registrationStartedAt: fromStringToISO(value.registrationStartedAt),
          registrationEndedAt: fromStringToISO(value.registrationEndedAt),
        })
      },
      deep: true,
    },
  },

  methods: {
    async save(after) {
      const isValid = await this.$refs.eventForm.validate()

      this.$emit('updateEventMainData', {
        ...this.form,
        registrationStartedAt: fromStringToISO(this.form.registrationStartedAt),
        registrationEndedAt: fromStringToISO(this.form.registrationEndedAt),
        isValid,
      })

      this.$emit('save', after)
    },
  },
}
</script>

<style lang="less">
.org-form__item--mb {
  margin-bottom: 5px;
}
</style>
