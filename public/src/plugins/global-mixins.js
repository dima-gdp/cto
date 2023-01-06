import Vue from 'vue'

Vue.mixin({
  computed: {
    $isLoggedIn() {
      return this.$store.getters['auth/isLoggedIn']
    },
  },
  methods: {},
})
