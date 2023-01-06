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
      <HallGroupForm v-model="hallGroup" type="edit" @on-submit="submitHandler" />
    </Card>

    <Spin v-if="isLoading" fix />
  </div>
</template>

<script>
import HallGroupForm from '@/view/pages/Events/edit/HallGroup/components/HallGroupForm'
import { convertISOToStrDate } from '@/libs/util'
import { getHallGroup, updateHallGroup } from '@/api/hall-group'
import { createHall, updateHall } from '@/api/hall'
import { getFile } from '@/api/files'
import { DATE_FIELD_NAMES_HALLS } from '@/libs/constants'

export default {
  components: {
    HallGroupForm,
  },

  data() {
    return {
      eventId: this.$route.params.id,
      isLoading: false,
      hallGroup: {},
      hallGroupId: this.$route.params.hall_group_id,
    }
  },

  async mounted() {
    await this.getHallGroup()
  },

  methods: {
    async getHallGroup() {
      this.loading = true
      try {
        const params = {
          include: ['halls'],
          'per-page': 0,
        }
        const { data: hallGroup } = await getHallGroup(this.hallGroupId, params)
        const formattedHallGroup = convertISOToStrDate(hallGroup, DATE_FIELD_NAMES_HALLS)

        formattedHallGroup.halls = this.filteredHalls(formattedHallGroup.halls)

        if (formattedHallGroup.programFileId) {
          formattedHallGroup.file = await this.getFileProgram(formattedHallGroup.programFileId)
        }

        this.hallGroup = formattedHallGroup
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    filteredHalls(halls) {
      if (halls?.length) {
        return halls.map((hall) => convertISOToStrDate(hall, DATE_FIELD_NAMES_HALLS))
      } else {
        return []
      }
    },

    async updateHallGroup(id, hallGroup) {
      try {
        const { data } = await updateHallGroup(id, hallGroup)
        return data.id
      } catch (e) {
        console.error(e)
      }
    },

    async getFileProgram(id) {
      try {
        const { data: file } = await getFile(id)
        return file
      } catch (e) {
        console.error(e)
      }
    },

    async submitHandler({ hallGroup, halls, action }) {
      this.isLoading = true
      try {
        await this.updateHallGroup(hallGroup.id, hallGroup)

        if (halls.length) {
          const hallsPromises = halls.map((hall) =>
            hall.id ? updateHall(hall.id, hall) : createHall({ ...hall, hallGroupId: hallGroup.id })
          )
          await Promise.all(hallsPromises)
        }

        if (action === 'save') {
          await this.$router.push({ path: `/events/edit/${this.eventId}/hall-group` })
          return
        }

        await this.getHallGroup()
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="less"></style>
