<template>
  <div class="additional-info">
    <Row type="flex" class-name="additional-info-list">
      <i-col span="8" class="additional-info-list-item additional-info-list-item--left">
        <Card>
          <h3 class="additional-info-list-item__title">Контентная информация</h3>
          <div class="additional-info-list-item__btn">
            <Button @click="$router.push(`${$route.path}/content-info`)"> Редактировать </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Юридическая информация</h3>
          <div class="additional-info-list-item__btn">
            <Button @click="$router.push(`${$route.path}/legal-info`)"> Редактировать </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item additional-info-list-item--right">
        <Card>
          <h3 class="additional-info-list-item__title">Материалы</h3>
          <div class="additional-info-list-item__btn">
            <Button @click="$router.push(`${$route.path}/requests`)"> Редактировать </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item additional-info-list-item--left">
        <Card>
          <h3 class="additional-info-list-item__title">Магазин</h3>
          <div class="additional-info-list-item__btn">
            <Button @click="$router.push(`${$route.path}/store`)"> Редактировать </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Системные тексты</h3>
          <div class="additional-info-list-item__btn">
            <Button @click="$router.push(`${$route.path}/locales`)"> Редактировать </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Трансляции med.studio</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click="
                $router.push({
                  path: `${$route.path}/hall-group`,
                })
              "
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Документы</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click="
                $router.push({
                  path: `${$route.path}/documents`,
                  query: { eventName: event.technicalName },
                })
              "
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Ограничения доступа</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click="
                $router.push({
                  path: `${$route.path}/event-page-management`,
                  query: { 'event-id': event.id },
                })
              "
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Настройка меню</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click="
                $router.push({
                  path: `${$route.path}/event-menu`,
                  query: { 'event-id': event.id },
                })
              "
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>

      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Внешние счетчики</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click="
                $router.push({
                  path: `${$route.path}/metrics`,
                })
              "
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
      <i-col span="8" class="additional-info-list-item">
        <Card>
          <h3 class="additional-info-list-item__title">Лендинг</h3>
          <div class="additional-info-list-item__btn">
            <Button
              @click=" $router.push({name: 'event_landing', query: { eventId: event.id }})"
            >
              Редактировать
            </Button>
          </div>
          <Spin v-if="load" fix></Spin>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    load: {
      type: Boolean,
      default: false,
    },
    event: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style lang="less">
@import './AdditionalInfoList.less';
</style>
