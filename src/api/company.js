import request from '../util/request';

export function getCompanyInfo(data) {
  return request({
    url: '/company/get-detail',
    method: 'post',
    data: data
  })
}
