/**
 *  @providesModule utils/request
 */

import {
  Alert
} from 'react-native';

const base = 'http://120.79.243.165:9008/scm/device/sn?sn=';

function request(method, url, options = {}) {
  const {
    body,
    fetchConfig,
  } = options;
  const requestUrl = `${base}${url}`;
  const requestBody = Object.assign({
    method,
    headers: {},
    body: body && JSON.stringify(body)
  });
  let promise = fetch(requestUrl, requestBody, fetchConfig)
    .then(response => {
      const {
        status
      } = response;
      if (status >= 200 && status < 300) {
        if (status === 204) {
          return null;
        }
        return response.json()
      }
    })
    .catch(err => {
      throw err;
    });
  return promise.catch(e => {
    Alert.alert('网络不太好，请稍后重试！', '', [{
      text: '知道了'
    }])
  });
}

function post(url, options = {}) {
  return request('post', url, options);
}

function get(url, options = {}) {
  return request('get', url, options);
}

export {
  get,
  post
};

export default request;