<template>
  <div class="content-info">
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Связанные трансляции</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button
          icon="ios-arrow-round-back"
          @click="$router.push(`/events/edit/${eventId}/hall-group`)"
        >
          Назад
        </Button>
      </i-col>
    </Row>

    <Card class="hall-group-card">
      <HallGroupForm v-model="hallGroup" type="create" @on-submit="submitHandler" />
    </Card>

    <Spin v-if="isLoading" fix />
  </div>
</template>

<script>
import HallGroupForm from '@/view/pages/Events/edit/HallGroup/components/HallGroupForm'
import { createHallGroup } from '@/api/hall-group'
import { createHall } from '@/api/hall'

export default {
  components: {
    HallGroupForm,
  },

  data() {
    return {
      isLoading: false,
      eventId: this.$route.params.id,
      hallGroup: {
        lang: 'ru',
        name: '',
        active: false,
        file: null,
        halls: [],
        programFileId: null,
      },
    }
  },

  methods: {
    async submitHandler({ hallGroup, halls, action }) {
      this.isLoading = true
      try {
        const hallGroupId = await this.createHallGroup({ ...hallGroup, eventId: this.eventId })

        if (halls.length) {
          const hallsPromises = halls.map((hall) => createHall({ ...hall, hallGroupId }))
          await Promise.all(hallsPromises)
        }

        if (action === 'save') {
          await this.$router.push({ path: `/events/edit/${this.eventId}/hall-group` })
          return
        }

        await this.$router.push({ path: `edit/${hallGroupId}` })
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async createHallGroup(hallGroup) {
      try {
        const { data } = await createHallGroup(hallGroup)
        return data.id
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less"></style>
