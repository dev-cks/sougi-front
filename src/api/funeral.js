import request from '../util/request';

export function getFuneralInfo(data) {
  return request({
    url: '/funeral/get-detail',
    method: 'post',
    data: data
  })
}

export function getFuneralIncenseInfo(data) {
  return request({
    url: '/funeral/get-incense',
    method: 'post',
    data: data
  })
}
