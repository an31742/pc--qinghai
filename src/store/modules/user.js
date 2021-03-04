import { getInfo, login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'

const state = {
  // globalUniqueID: localStorage.getItem('globalUniqueID'),
  globalUniqueID: sessionStorage.getItem('globalUniqueID'),
  // globalUniqueID: Cookies.get('globalUniqueID'),

  token: getToken() || '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  perms: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_GLOBAL_UNIQUE_ID: (state, globalUniqueID) => {
    // localStorage.setItem('globalUniqueID', globalUniqueID)
    sessionStorage.setItem('globalUniqueID', globalUniqueID)
    state.globalUniqueID = globalUniqueID
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // user login
  login({ commit }, globalUniqueID) {
    return new Promise((resolve, reject) => {
      login({ globalUniqueID }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.Authorization)
        commit('SET_GLOBAL_UNIQUE_ID', globalUniqueID)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('获取用户信息失败请稍后再试')
        }
        const { realname, username } = data.sysUserDO
        commit('SET_NAME', `${realname}（${username}）`)
        commit('SET_ROLES', data.roles)
        commit('SET_PERMS', data.permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // logout({ commit, state, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_ROLES', [])
  //       removeToken()
  //       resetRouter()

  //       // reset visited views and cached views
  //       // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
  //       dispatch('tagsView/delAllViews', null, { root: true })

  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_GLOBAL_UNIQUE_ID', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
