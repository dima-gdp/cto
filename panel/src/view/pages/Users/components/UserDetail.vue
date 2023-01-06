<template>
  <div class="user-detail">
    <Row :gutter="15">
      <i-col span="6">
        <Card
          class="user-detail__card"
          :title="form.id ? `Пользователь ${form.id}` : `Пользователь`"
          icon="ios-person"
        >
          <div class="user-edit__detail-info user-detail-info">
            <div class="user-detail-info__bottom">
              <div class="user-detail-info__created">
                <div class="user-detail-info__created-title">Дата создания:</div>
                <div v-if="edit">
                  {{ getDate(form.createdAt, 'DD-MM-YYYY') }}
                </div>
                <div v-else>
                  {{ getDate(new Date() / 1000, 'DD-MM-YYYY') }}
                </div>
              </div>
              <div class="user-detail-info__activity">
                <Checkbox v-model="activity"> Активность </Checkbox>
              </div>
            </div>
          </div>
          <Spin v-if="loading" fix></Spin>
        </Card>
        <Card
          v-if="accessPermission && edit"
          class="user-detail__card view-card"
          title="Выдача прав на работу с мероприятием"
        >
          <p>
            Вы можете выдавать и забирать права пользователя на работу с мероприятием, только если
            его роль позволяет зайти в административный интерфейс
          </p>
          <Button
            :disabled="form.role === 'it' || form.role === 'administrator' || form.role === 'user'"
            class="view-card__btn-block"
            long
            @click="modal = true"
          >
            Выдать доступ к мероприятию
          </Button>
          <Spin v-if="loading" fix></Spin>
        </Card>
        <Button v-if="edit" type="error" ghost long @click="handleDelete">
          Удалить пользователя
        </Button>
      </i-col>
      <i-col span="18">
        <Card title="Редактирование" icon="ios-options">
          <Form ref="form" :model="form" :rules="ruleValidate" label-position="top">
            <Row :gutter="15">
              <i-col span="8">
                <FormItem prop="lastName" label="Фамилия">
                  <FormItem>
                    <Input v-model="form.lastName" placeholder="Фамилия" />
                  </FormItem>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem prop="firstName" label="Имя">
                  <Input v-model="form.firstName" placeholder="Имя" />
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="Отчество">
                  <FormItem prop="middleName">
                    <Input v-model="form.middleName" placeholder="Отчество" />
                  </FormItem>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="Роль" prop="role">
                  <Select v-model="form.role">
                    <Option v-for="item in $options.roles" :key="item.value" :value="item.value">
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="E-mail" prop="email">
                  <Input v-model="form.email" placeholder="Email" />
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="E-mail подтвержден">
                  <Checkbox v-model="form.emailValidate"></Checkbox>
                </FormItem>
              </i-col>
            </Row>
            <Row :gutter="15">
              <i-col span="8">
                <FormItem :label="edit ? `Сменить пароль` : `Пароль`" prop="password">
                  <Input
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                    placeholder="пароль"
                  />
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="Телефон" prop="phone">
                  <Input :value="form.phone" placeholder="Телефон" @input="onInputPhone" />
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="Телефон подтвержден">
                  <Checkbox disabled></Checkbox>
                </FormItem>
              </i-col>
            </Row>
            <Row :gutter="15">
              <i-col span="8">
                <FormItem label="База пользователей" prop="authGroupId">
                  <Select v-model="form.authGroupId" :disabled="edit">
                    <Option v-for="item in authGroups" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Spin v-if="loading" fix></Spin>
        </Card>
        <div class="user-detail__btn-block">
          <Button size="large" @click="handleSave(false)"> Применить </Button>
          <Button type="primary" size="large" @click="handleSave(true)"> Сохранить </Button>
        </div>
      </i-col>
    </Row>
    <Card v-if="permissionList" class="table-permission">
      <Divider orientation="left"> Права </Divider>
      <Tables
        ref="tables"
        v-model="permissionList"
        searchable
        search-place="top"
        :loading="loading"
        :params="params"
        :columns="columns"
        @on-delete="deletePermissionId"
      />
    </Card>
    <Card v-if="form.email && edit" class="table-permission">
      <Divider orientation="left"> Анкеты </Divider>
      <WorksheetsList :has-create="false" :preserve-filter="userFilter" :searchable="false" />
    </Card>
    <Modal
      v-model="modal"
      title="Пожалуйста, выберите мероприятие к которому хотите выдать доступ"
      width="600"
      @on-ok="setAccess"
    >
      <div class="user-detail__modal-permission modal-permission">
        <SSelect
          v-model="eventsSelected"
          track-by="id"
          label="technicalName"
          :searchable="true"
          :multiple="true"
          :async-function="remoteEventSearch"
          placeholder="Выберите мероприятие"
        />
        <ul class="modal-permission__checkbox-list">
          <li>
            <Checkbox
              v-model="permissionDownload.registration"
              class="modal-permission__checkbox-item"
              :disabled="eventsSelected.length < 1"
            >
              Разрешить скачивание анкет
            </Checkbox>
          </li>
          <li>
            <Checkbox
              v-model="permissionDownload.request"
              class="modal-permission__checkbox-item"
              :disabled="eventsSelected.length < 1"
            >
              Разрешить скачивание материалов
            </Checkbox>
          </li>
          <li>
            <Checkbox
              v-model="permissionDownload.order"
              class="modal-permission__checkbox-item"
              :disabled="eventsSelected.length < 1"
            >
              Разрешить скачивание заказов
            </Checkbox>
          </li>
          <li>
            <Checkbox
              v-model="permissionDownload.hallGroupReport"
              class="modal-permission__checkbox-item"
              :disabled="eventsSelected.length < 1"
            >
              Разрешить скачивание отчета по трансляциям
            </Checkbox>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfo } from '@/api/user'
import { getDate } from '@/libs/tools'
import { getEvents } from '@/api/event'
import { createContent, getContentList, delContent } from '@/api/permission'
import { getAuthGroups } from '@/api/authGroups'
import Tables from '_c/tables-base'
import WorksheetsList from '../../Worksheets/list'
import SSelect from '@/components/s-select/SSelect'
import { USER_ROLES } from '@/domain/role'

export default {
  name: 'UserDetail',
  components: {
    Tables,
    WorksheetsList,
    SSelect,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      params: {
        'per-page': 0,
        filter: { userId: null },
        include: ['entity-model,created-by'],
        sort: '-id',
      },
      permissionDownload: {
        registration: null,
        request: null,
        order: null,
        hallGroupReport: null,
      },
      modal: false,
      events: null,
      eventsSelected: [],
      loading: false,
      activity: true,
      form: {
        id: null,
        emailValidate: null,
        lastName: '',
        middleName: '',
        firstName: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        loggedAt: '',
        createdAt: '',
        authGroupId: '',
        status: 2,
      },
      ruleValidate: {
        lastName: [
          { required: true, message: 'Фамилия не может быть пустым полем', trigger: 'blur' },
          {
            type: 'string',
            max: 255,
            message: 'Значение не должно превышать 255 символов',
            trigger: 'blur',
          },
        ],
        firstName: [
          { required: true, message: 'Имя не может быть пустым', trigger: 'blur' },
          {
            type: 'string',
            max: 255,
            message: 'Значение не должно превышать 255 символов',
            trigger: 'blur',
          },
        ],
        middleName: [
          {
            type: 'string',
            max: 255,
            message: 'Значение не должно превышать 255 символов',
            trigger: 'blur',
          },
        ],
        role: [{ required: true, message: 'Имя не может быть пустым', trigger: 'blur' }],
        email: [
          { required: true, message: 'Email не может быть пустым', trigger: 'blur' },
          { type: 'email', message: 'Не верный формат email', trigger: 'blur' },
        ],
        authGroupId: [
          {
            required: true,
            type: 'number',
            message: 'База пользователей не может быть пустым',
            trigger: 'blur',
          },
        ],
        password: [
          { required: !this.edit, message: 'Пароль не может быть пустым', trigger: 'blur' },
        ],
      },
      permissionList: null,
      permissionName: {
        downloadRegistration: 'анкет',
        downloadRequest: 'материалов',
        downloadOrder: 'заказов',
        downloadHallGroupReport: 'трансляций',
      },
      userFilter: null,
      authGroups: [],
      loadingEvent: false,
    }
  },
  roles: Object.values(USER_ROLES),
  computed: {
    ...mapGetters({
      role: 'role',
    }),
    columns() {
      return [
        {
          title: 'ID',
          key: 'id',
          type: 'integer',
          searchable: true,
          sortable: true,
          sortType: 'desc',
          maxWidth: 70,
          render: (h, params) => {
            return h('span', `${params.row.entityModel.id}`)
          },
        },
        {
          title: 'Тех. название',
          key: 'technicalName',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            return h('span', `${params.row.entityModel.technicalName}`)
          },
        },
        {
          title: 'Кто выдал доступ',
          key: 'date_range',
          type: 'string',
          searchable: true,
          sortable: true,
          render: (h, params) => {
            return h('span', `${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`)
          },
        },
        {
          title: 'Права на скачивание',
          key: 'date_range',
          type: 'string',
          // searchable: true,
          // sortable: true,
          maxWidth: 200,
          render: (h, params) => {
            const result = []
            params.row.items.map((item) => {
              if (item !== 'updateEvent') {
                result.push(this.permissionName[item])
              }
            })
            return h('span', result.join(', '))
          },
        },
        {
          title: '',
          key: 'handle',
          options: [
            {
              name: 'Удаление',
              action: 'on-delete',
              style: {
                color: '#ed4014',
              },
              access: ['it', 'administrator'],
            },
          ],
          slot: 'actions',
          align: 'center',
          maxWidth: 70,
        },
      ]
    },
  },
  watch: {
    activity() {
      if (this.activity === true) {
        this.form.status = 2
      } else if (this.activity === false) {
        this.form.status = 1
      }
    },
    form: {
      immediate: true,
      handler(value) {
        if (value.id) {
          this.userFilter = {
            filter: {
              userId: value.id,
            },
            include: 'event',
            sort: '-id',
          }
        }
      },
    },
  },
  created() {
    this.getUser()
    this.getAuthGroups()
  },
  methods: {
    async getAuthGroups() {
      const { data: authGroups } = await getAuthGroups({ 'per-page': 0 })
      this.authGroups = authGroups
    },
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
        content:
          '<p>Вы уверены что хотите удалить пользователя ?</p><p>Это действие необратимо!</p>',
        onOk: () => {
          this.$emit('on-delete', this.form)
        },
      })
    },
    getUser() {
      if (this.edit) {
        this.loading = true
        getUserInfo(this.$route.params.id)
          .then((res) => {
            this.form = res.data
            this.params.filter.userId = this.form.id
            this.form.status = this.form.status.code
            this.loading = false
            this.getPermissionList()
            this.activity = this.form.status === 2
          })
          .catch((e) => {
            this.loading = false
            throw new Error(e)
          })
      }
    },
    // Permission
    accessPermission() {
      return this.role === 'administrator' || role === 'it'
    },
    async createPermissionId(params) {
      try {
        await createContent(params)
      } catch (e) {
        throw new Error(e)
      }
    },
    async deletePermissionId({ ids }) {
      try {
        const promises = ids.map(async (id) => {
          await delContent(id)
        })
        await Promise.all(promises)
        await this.getPermissionList()
        this.$Message.success('Доступ успешно удален')
      } catch (e) {
        throw new Error(e)
      }
    },
    async updateAccess(access) {
      if (
        (access === 'downloadRegistration' && this.permissionDownload.registration) ||
        (access === 'downloadRequest' && this.permissionDownload.request) ||
        (access === 'downloadOrder' && this.permissionDownload.order) ||
        (access === 'downloadHallGroupReport' && this.permissionDownload.hallGroupReport) ||
        access === 'updateEvent'
      ) {
        try {
          const promises = this.eventsSelected.map((item) => {
            const params = {
              entity_id: item.id,
              entity: 'event',
              item: access,
              user_id: this.form.id,
            }
            return this.createPermissionId(params)
          })
          await Promise.all(promises)
        } catch (e) {
          throw new Error(e)
        }
      }
    },
    async getPermissionList() {
      this.loading = true
      try {
        const { data: permList } = await getContentList(this.params)
        const permListWithEntityModel = permList.filter((perm) => perm.entityModel)

        if (permListWithEntityModel.length) {
          const formattedPermissionMap = {}

          permListWithEntityModel.forEach((perm) => {
            const permKey = perm.entity + perm.entityId
            if (!formattedPermissionMap[permKey]) {
              formattedPermissionMap[permKey] = {
                id: perm.entityModel.id,
                entityModel: perm.entityModel,
                items: [perm.item],
                ids: [perm.id],
                createdBy: perm.createdBy,
              }
            } else {
              formattedPermissionMap[permKey].items.push(perm.item)
              formattedPermissionMap[permKey].ids.push(perm.id)
            }
          })

          this.permissionList = Object.values(formattedPermissionMap)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async del() {
      this.loading = true
      const permissions = this.permissionList.filter((item) =>
        this.eventsSelected.some((event) => event.id === item.id)
      )
      const ids = permissions
        .map((perm) => {
          const index = this.permissionList.indexOf(perm)
          if (index !== -1) this.permissionList.splice(index, 1)
          return perm.ids
        })
        .flat()

      const delArr = ids.map((id) => delContent(id))

      try {
        await Promise.all(delArr)
        await this.set()
      } catch (e) {
        throw new Error(e)
      }
    },
    async set() {
      await Promise.all([
        this.updateAccess('updateEvent'),
        this.updateAccess('downloadRegistration'),
        this.updateAccess('downloadRequest'),
        this.updateAccess('downloadOrder'),
        this.updateAccess('downloadHallGroupReport'),
      ])
        .then(
          async () => {
            await this.getPermissionList()
            this.loading = false
            await this.$Message.success('Доступы успешно обновлены')
            this.permissionDownload = {
              registration: false,
              request: false,
              order: false,
            }
            this.eventsSelected = []
          },
          (reason) => {
            console.error(reason)
          }
        )
        .catch((e) => {
          throw new Error(e)
        })
    },
    async setAccess() {
      await this.handleSave(false)
      if (this.permissionList) {
        await this.del()
      } else {
        await this.set()
      }
    },
    async remoteEventSearch(query) {
      try {
        if (query.length > 1) {
          const { data: events } = await getEvents({
            ...this.params,
            'per-page': 20,
            fields: {
              event: ['id', 'technical-name'],
            },
            filter: [
              {
                'technical-name': {
                  ilike: query,
                },
              },
            ],
          })
          return events
        }
        return []
      } catch (e) {
        console.error(e)
      }
    },

    async onInputPhone(ev) {
      if (ev === '') {
        this.form.phone = ''
        return
      }
      if (Number(ev)) {
        this.form.phone = ev
        return
      }
      // Когда в значении есть не число
      const prev = this.form.phone
      // скидываем значение на любое
      this.form.phone = '.'
      await this.$nextTick()
      // Возвращаем предыдущее значение
      this.form.phone = prev
    },
  },
}
</script>
