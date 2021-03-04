<template>
  <div class="dashboard-container">
    123
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { login } from '@/api/user'
// import store from '@/store'
export default {
  name: 'Dashboard',
  data() {
    return {
      currentRole: 'adminDashboard',
      globalUniqueID: this.$route.query.globalUniqueID
    }
  },
  computed: {
  },
  created() {

  },
  methods: {
  }
}
</script>
