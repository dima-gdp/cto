<template>
  <div>
    <Row :gutter="14">
      <i-col span="3">
        <Card>
          <p slot="title">
            <Icon type="waterdrop"></Icon>
            Основное использование компонента
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo :end="2534" />
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="5" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="code"></Icon>
            Можно добавить текст слева и справа
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo :end="2534">
                <span slot="left">Total:&nbsp;</span>
                <span slot="right">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="paintbucket"></Icon>
            Стили для самого счетчика
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo :end="2534" count-class="count-text" unit-class="unit-class">
                <span slot="left" class="slot-text">Total:&nbsp;</span>
                <span slot="right" class="slot-text">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="settings"></Icon>
            Формат вывода данных
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo :end="2534" count-class="count-text" unit-class="unit-class" :decimals="2">
                <span slot="left" class="slot-text">Total:&nbsp;</span>
                <span slot="right" class="slot-text">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px">
      <i-col span="8">
        <Card>
          <p slot="title">
            <Icon type="ios-color-wand"></Icon>
            Упрощение вывода
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo
                :simplify="true"
                :end="2534"
                count-class="count-text"
                unit-class="unit-class"
              >
                <span slot="left" class="slot-text">Total:&nbsp;</span>
                <span slot="right" class="slot-text">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-shuffle-strong"></Icon>
            Подстановка
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo
                :simplify="true"
                :unit="unit"
                :end="253"
                count-class="count-text"
                unit-class="unit-class"
              >
                <span slot="left" class="slot-text">原始数据：253&nbsp;=>&nbsp;</span>
              </CountTo>
              <CountTo
                :simplify="true"
                :unit="unit"
                :end="2534"
                count-class="count-text"
                unit-class="unit-class"
              >
                <span slot="left" class="slot-text">原始数据：2534&nbsp;=>&nbsp;</span>
              </CountTo>
              <CountTo
                :simplify="true"
                :unit="unit"
                :end="257678"
                count-class="count-text"
                unit-class="unit-class"
              >
                <span slot="left" class="slot-text">原始数据：257678&nbsp;=>&nbsp;</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            Ассинхронные данные
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo :end="asynEndVal" count-class="count-text" unit-class="unit-class">
                <span slot="left" class="slot-text">Total:&nbsp;</span>
                <span slot="right" class="slot-text">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>
            Все вместе
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
              <CountTo
                :delay="500"
                :simplify="true"
                :unit="unit2"
                :end="integratedEndVal"
                count-class="count-text"
                unit-class="unit-class"
              >
                <span slot="left" class="slot-text"
                  >原始数据:&nbsp;{{ integratedEndVal }}&nbsp;=>&nbsp;</span
                >
                <span slot="right" class="slot-text">&nbsp;times</span>
              </CountTo>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CountTo from '_c/count-to'
export default {
  name: 'CountToPage',
  components: {
    CountTo,
  },
  data() {
    return {
      end: 0,
      unit: [
        [3, '千多'],
        [4, '万多'],
        [5, '十万多'],
      ],
      unit2: [
        [1, '十多'],
        [2, '百多'],
        [3, '千多'],
        [4, '万多'],
        [5, '十万多'],
        [6, '百万多'],
        [7, '千万多'],
        [8, '亿多'],
      ],
      asynEndVal: 487,
      integratedEndVal: 3,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      setInterval(() => {
        this.asynEndVal += parseInt(Math.random() * 20)
        this.integratedEndVal += parseInt(Math.random() * 30)
      }, 2000)
    },
  },
}
</script>

<style lang="less">
@baseColor: ~'#dc9387';
.countto-page-row {
  height: 200px;
}
.count-to-con {
  display: block;
  width: 100%;
  text-align: center;
}
.count-text {
  font-size: 50px;
  color: @baseColor;
}
.slot-text {
  font-size: 22px;
}
.unit-class {
  font-size: 30px;
  color: @baseColor;
}
</style>
