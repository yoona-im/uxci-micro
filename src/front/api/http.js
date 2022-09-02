import axios from 'axios';
// 请求超时时间
axios.defaults.timeout = 180000;
const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const quickGet = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const postDownload = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {responseType: 'blob'}).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}
const postUpload = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }}).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const postForm = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const put = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

const del = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}

export default {
  get,
  quickGet,
  post,
  postDownload,
  postUpload,
  postForm,
  put,
  del
}
