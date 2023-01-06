<template>
  <div class="card-profile">
    <div class="card-profile__item">
      <div class="card-profile__key">Фамилия</div>
      <div class="card-profile__value">
        {{ profile.lastName }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Имя</div>
      <div class="card-profile__value">
        {{ profile.firstName }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Отчество</div>
      <div class="card-profile__value">
        {{ profile.middleName }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Телефон</div>
      <div class="card-profile__value">
        {{ profile.phone }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Город</div>
      <div class="card-profile__value">
        {{ profile.locationCity }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Область</div>
      <div class="card-profile__value">
        {{ profile.locationRegion }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Регион</div>
      <div class="card-profile__value">
        {{ profile.region }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Должность</div>
      <div class="card-profile__value">
        {{ profile.position }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Специальность</div>
      <div class="card-profile__value">
        {{ profile.specialty }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Организация</div>
      <div class="card-profile__value">
        {{ profile.institutionName }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Вид учреждения</div>
      <div class="card-profile__value">
        {{ profile.institutionType }}
      </div>
    </div>

    <div class="card-profile__item">
      <div class="card-profile__key">Форма учреждения</div>
      <div class="card-profile__value">
        {{ profile.institutionForm }}
      </div>
    </div>

    <div class="card-profile__item card-profile__item--col2">
      <div class="card-profile__key">Мероприятие</div>
      <div class="card-profile__value">
        {{ profile.event }}
      </div>
    </div>

    <div class="card-profile__item card-profile__item--col2">
      <div class="card-profile__key">Комментарий</div>
      <div class="card-profile__value">
        {{ profile.comment }}
      </div>
    </div>

    <div class="card-profile__item card-profile__item--col2">
      <div class="card-profile__key">История общения</div>
      <div class="card-profile__value">
        {{ profile.communicationHistory }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped lang="less">
.card-profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 3px;
  column-gap: 10px;

  &__item {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 10px;

    &--col2 {
      // нужно экранировать слеш
      grid-column: ~'1 / -1';
    }
  }

  &__key,
  &__value {
    font-size: 15px;
  }

  &__key {
    font-weight: bold;
  }
}
</style>
