import axios from '@/libs/api.request'

export const getAllSegments = (params) => {
  return axios.request({
    url: 'api/v1/card/segment',
    method: 'get',
    params,
  })
}

export const createSegment = (data, params) => {
  return axios.request({
    type: 'card-segment',
    url: 'api/v1/card/segment',
    method: 'post',
    data,
    params,
  })
}

export const applyFilterToSegment = (id, data) => {
  return axios.request({
    url: `api/v1/card/segment/${id}/update-cards-relationships-by-filter`,
    method: 'patch',
    data,
  })
}

export const deleteSegment = (id) => {
  return axios.request({
    url: `api/v1/card/segment/${id}`,
    method: 'delete',
  })
}

export const deleteSegmentRels = (id) => {
  return axios.request({
    url: `api/v1/card/segment/${id}/relationships/cards`,
    method: 'delete',
  })
}

export const downloadCardReport = (segmentId) => {
  return axios.request({
    url: 'api/v1/card',
    method: 'get',
    params: {
      download: 'xlsx',
      filter: [{ 'card-segments.id': segmentId }],
    },
  })
}

export const downloadCardProfileReport = (segmentId) => {
  return axios.request({
    url: 'api/v1/card/profile',
    method: 'get',
    params: {
      download: 'xlsx',
      filter: [{ 'card-segments.id': segmentId }],
    },
  })
}
