<template>
  <Row>
    <i-col span="16">
      <Row v-for="i in customIconList.length / 3" :key="`custom-icon-row-${i}`">
        <i-col
          v-for="item in customIconList.slice((i - 1) * 3, i * 3)"
          :key="`custom-icon-${item}`"
          span="8"
        >
          <Card style="margin: 0 5px 5px; text-align: center">
            <Icons :size="30" :type="item" />
            <p class="icon-code">&lt;Icons :size="30" type="{{ item }}"&gt;</p>
            <p>&lt;CommonIcon :size="30" type="_{{ item }}"&gt;</p>
          </Card>
        </i-col>
      </Row>
      <Row>
        <i-col>
          <Card style="margin: 0 5px 5px; text-align: center">
            <CommonIcon :size="30" type="ionic" />
            <p class="icon-code">iView内置图标</p>
            <p>&lt;CommonIcon :size="30" type="ionic"&gt;</p>
          </Card>
        </i-col>
      </Row>
    </i-col>
    <i-col span="8">
      <Card>
        <p class="intro-p">
          <Icon style="margin-right: 10px" :size="10" type="heart" />Компонент «Значки» поддерживает
          отображение пользовательских значков. Пожалуйста, обратитесь к документации для создания
          определенных файлов шрифтов пользовательских значков.
        </p>
        <p class="intro-p">
          <Icon style="margin-right: 10px" :size="10" type="heart" />Компонент CommonIcon
          поддерживает как встроенные типы значков iView, так и настраиваемые типы значков. Чтобы
          различать эти два типа, необходимо подчеркнуть имя настраиваемого значка «_».
        </p>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import Icons from '_c/icons'
import CommonIcon from '_c/common-icon'
export default {
  name: 'IconsPages',
  components: {
    Icons,
    CommonIcon,
  },
  data() {
    return {
      customIconList: ['woman', 'man', 'smile', 'meh', 'frown', 'bear'],
    }
  },
}
</script>

<style lang="less">
.icon-code {
  margin: 20px 0 10px;
}
.intro-p {
  margin-bottom: 10px;
}
</style>
