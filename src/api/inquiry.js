import request from '../util/request';

export function uploadInquiry(data) {
  return request({
    url: '/inquiry/upload',
    method: 'post',
    data: data
  })
}
