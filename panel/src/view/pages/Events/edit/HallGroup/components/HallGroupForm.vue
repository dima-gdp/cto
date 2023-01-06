<template>
  <div class="hall-group-form">
    <RadioGroup
      v-model="form.lang"
      type="button"
      button-style="solid"
      class="hall-group-form__lang"
    >
      <Radio label="ru" :disabled="type === $options.typesForm.EDIT"></Radio>
      <Radio label="en" :disabled="type === $options.typesForm.EDIT"></Radio>
    </RadioGroup>

    <Form ref="hallGroupForm" :model="form" :rules="formRules" label-position="top">
      <h2 class="hall-group-form__title">Группа залов</h2>
      <Row type="flex" :gutter="24">
        <i-col span="20">
          <FormItem label="Название-ссылка в левом меню" prop="name">
            <Input v-model="form.name" type="text" placeholder="Введите значение" />
          </FormItem>
        </i-col>
        <i-col span="4">
          <FormItem label="Активность" prop="active">
            <i-switch v-model="form.active" />
          </FormItem>
        </i-col>
      </Row>

      <Row type="flex" :gutter="24" class-name="hall-group-form__hall-group">
        <i-col span="8">
          <FormItem label="Дата начала публикации" prop="autoActiveStartedAt">
            <Input
              v-model="form.autoActiveStartedAt"
              v-mask="'##-##-#### ##:##'"
              type="text"
              placeholder="Введите дату начала публикации"
              style="width: 100%; text-align: center !important"
            />
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem label="Дата окончания публикации" prop="autoActiveEndedAt">
            <Input
              v-model="form.autoActiveEndedAt"
              v-mask="'##-##-#### ##:##'"
              type="text"
              placeholder="Введите дату окончания публикации"
              style="width: 100%; text-align: center !important"
            />
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem label="Сортировка" prop="sort">
            <Input v-model="form.sort" type="text" placeholder="Введите значение" />
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="file" label="Программа мероприятия">
            <Uploader
              v-model="form.file"
              desc="Загрузить программу"
              type="drag"
              class="hall-group-form__uploader"
            ></Uploader>
          </FormItem>
        </i-col>
        <i-col v-if="type === $options.typesForm.EDIT" span="5">
          <Button type="error" icon="md-trash" @click="deleteHallGroup">Удалить трансляцию</Button>
        </i-col>
      </Row>

      <h2 class="hall-group-form__title">Залы</h2>
      <Row type="flex" :gutter="20">
        <i-col v-for="(_, idx) in form.halls" :key="idx" span="12" class-name="hall-col">
          <div class="hall-card">
            <h3 class="hall-card__title">Зал №{{ idx + 1 }}</h3>
            <Row type="flex" :gutter="25">
              <i-col span="24">
                <FormItem label="Название" :rules="formRules.name" :prop="'halls.' + idx + '.name'">
                  <Input
                    v-model="form.halls[idx].name"
                    type="text"
                    placeholder="Введите значение"
                  />
                </FormItem>
              </i-col>
              <i-col span="10">
                <FormItem
                  label="ID трансляции"
                  :rules="formRules.streamId"
                  :prop="'halls.' + idx + '.streamId'"
                >
                  <Input
                    v-model="form.halls[idx].streamId"
                    type="text"
                    placeholder="Введите значение"
                  />
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem
                  label="Сортировка"
                  :rules="formRules.sort"
                  :prop="'halls.' + idx + '.sort'"
                >
                  <Input
                    v-model="form.halls[idx].sort"
                    type="text"
                    placeholder="Введите значение"
                  />
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="Активность" prop="active">
                  <i-switch v-model="form.halls[idx].active" />
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem
                  label="Дата начала публикации"
                  :rules="formRules.autoActiveStartedAt"
                  :prop="'halls.' + idx + '.autoActiveStartedAt'"
                >
                  <Input
                    v-model="form.halls[idx].autoActiveStartedAt"
                    v-mask="'##-##-#### ##:##'"
                    type="text"
                    placeholder="Введите дату начала публикации"
                    style="width: 100%; text-align: center !important"
                  />
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem
                  label="Дата окончания публикации"
                  :rules="formRules.autoActiveEndedAt"
                  :prop="'halls.' + idx + '.autoActiveEndedAt'"
                >
                  <Input
                    v-model="form.halls[idx].autoActiveEndedAt"
                    v-mask="'##-##-#### ##:##'"
                    type="text"
                    placeholder="Введите дату окончания публикации"
                    style="width: 100%; text-align: center !important"
                  />
                </FormItem>
              </i-col>
              <i-col span="6">
                <Button
                  class="hall-card__btn"
                  type="error"
                  ghost
                  icon="md-trash"
                  @click="deleteHall(idx)"
                  >Удалить зал</Button
                >
              </i-col>
            </Row>
          </div>
        </i-col>

        <i-col v-if="!isLoading" :key="'uniq'" span="12">
          <div class="add-button-big" @click="addHall">
            <Icon type="ios-add" />
            <p>Добавить зал</p>
          </div>
        </i-col>
      </Row>
    </Form>

    <SavePanel @save="submitForm('save')" @apply="submitForm('accept')" />
  </div>
</template>

<script>
import Uploader from '@/components/Uploader'
import SavePanel from '@/components/save-panel/save-panel'
import { TYPES_HALL_GROUP_FORM, DATE_FIELD_NAMES_HALLS } from '@/libs/constants'
import { covertStrDateToISO, fromStringToISO } from '@/libs/util'
import { deleteHall } from '@/api/hall'
import { deleteHallGroup } from '@/api/hall-group'

export default {
  typesForm: TYPES_HALL_GROUP_FORM,
  name: 'HallGroupForm',
  components: {
    Uploader,
    SavePanel,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (type) => Object.values(TYPES_HALL_GROUP_FORM).includes(type),
    },
  },
  data() {
    return {
      eventId: this.$route.params.id,
      isLoading: false,
      form: this.value,
      formRules: {
        active: [{ required: true, message: 'Это поле обязательно!' }],
        name: [{ required: true, message: 'Это поле обязательно!' }],
        sort: [{ required: true, message: 'Это поле обязательно!' }],
        streamId: [{ required: true, message: 'Это поле обязательно!' }],
        autoActiveStartedAt: [
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
        autoActiveEndedAt: [
          {
            pattern: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
            message: 'Дата должна иметь формат: 12-01-2020 18:00',
          },
        ],
      },
    }
  },

  watch: {
    value(val) {
      this.form = val
    },
    'form.file'(file) {
      if (file) {
        this.form.programFileId = file.id
      } else {
        this.form.programFileId = null
      }
    },
  },

  methods: {
    addHall() {
      this.form.halls.push({
        name: '',
        streamId: '',
        active: false,
        autoActiveStartedAt: '',
        autoActiveEndedAt: '',
        sort: '',
      })
    },

    async deleteHall(idx) {
      const hall = this.form.halls.find((hall, i) => i === idx)
      // Если зал прилетел с бека
      if (hall.id) {
        await this.deleteHallFromDB(hall.id)
        this.dropHallById(idx)
      } else {
        this.dropHallById(idx)
      }
    },

    dropHallById(idx) {
      this.form.halls = this.form.halls.filter((hall, i) => i !== idx)
    },

    async deleteHallFromDB(id) {
      try {
        this.isLoading = true
        await deleteHall(id)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async deleteHallGroup() {
      try {
        this.isLoading = true
        await deleteHallGroup(this.form.id)
        await this.$router.push({ path: `/events/edit/${this.eventId}/hall-group` })
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async submitForm(action) {
      const isFormValid = await this.$refs.hallGroupForm.validate()
      if (!isFormValid) return
      // Создаем объект группы залов, выкидываем из объекта массив залов и файл, и заодно преобразуем даты
      const hallGroup = Object.fromEntries(
        Object.entries(this.form)
          .filter(([key, value]) => {
            if (key !== 'halls' || 'file') {
              return [key, value]
            }
          })
          .map(([key, value]) => {
            if (DATE_FIELD_NAMES_HALLS.includes(key)) {
              return [key, fromStringToISO(value)]
            }
            return [key, value]
          })
      )

      const halls =
        this.form.halls?.map((hall) => covertStrDateToISO(hall, DATE_FIELD_NAMES_HALLS)) || []
      this.$emit('on-submit', { hallGroup, halls, action })
    },
  },
}
</script>

<style lang="less">
.hall-group-form {
  &__hall-group {
    margin-bottom: 71px;
  }

  &__lang {
    margin-bottom: 20px;
  }

  &__title {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: #54595e;
  }

  &__uploader {
    color: #0d6efd;
  }
}

.hall-col {
  margin-bottom: 20px;
}

.hall-card {
  padding: 20px;
  background: #f8f9fa;

  &__title {
    margin-bottom: 11px;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: #abb5be;
  }

  &__btn {
    margin-top: 16px;
  }
}
</style>
