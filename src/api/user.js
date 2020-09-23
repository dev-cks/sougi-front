import request from '../util/request';

export function loginUser(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getUserInfo(data) {
  return request({
    url: '/user/get-member',
    method: 'post',
    data: data
  })
}
export function registerUser(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

export function registerMember(data) {
  return request({
    url: '/user/register-member',
    method: 'post',
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/change-password',
    method: 'post',
    data: data
  })
}
