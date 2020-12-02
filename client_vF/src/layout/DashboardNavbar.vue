<template>
  <div class="col-12">
    <ul class="top-menu">
      <li
        class="li-menu font-weight-bold"
        :class="{ active: $route.path == '/dashboard' }"
      >
        <a href="/dashboard" class="text-uppercase">
          <span class="hidden-mobile">HOME</span>
          <span
            class="hidden-mobile-ngang hidden-md hidden-lg glyphicon glyphicon-info-sign color-black"
          ></span>
        </a>
      </li>
      <span class="hidden-xs"> | </span>
      <li
        class="li-menu font-weight-bold"
        :class="{ active: $route.path == '/play' }"
      >
        <a href="/play" class="text-uppercase">
          <span class="hidden-mobile">PLAY</span>
          <span
            class="hidden-mobile-ngang hidden-md hidden-lg glyphicon glyphicon-info-sign color-black"
          ></span>
        </a>
      </li>
      <span class="hidden-xs"> | </span>
      <li
        class="li-menu font-weight-bold"
        :class="{ active: $route.path == '/database' }"
      >
        <a href="/database" class="text-uppercase">
          <span class="hidden-mobile">DATABASE</span>
          <span
            class="hidden-mobile-ngang hidden-md hidden-lg glyphicon glyphicon-info-sign color-black"
          ></span>
        </a>
      </li>
      <span class="hidden-xs"> | </span>
      <li
        class="li-menu font-weight-bold"
        :class="{ active: $route.path == '/contestant' }"
      >
        <a href="/contestant" class="text-uppercase">
          <span class="hidden-mobile">CONTESTANT</span>
          <span
            class="hidden-mobile-ngang hidden-md hidden-lg glyphicon glyphicon-info-sign color-black"
          ></span>
        </a>
      </li>
      <span class="hidden-xs"> | </span>
      <li
        class="li-menu font-weight-bold"
        :class="{ active: $route.path == '/question' }"
      >
        <a href="/question" class="text-uppercase">
          <span class="hidden-mobile">QUESTION</span>
          <span
            class="glyphicon glyphicon-list-alt hidden-mobile-ngang hidden-md hidden-lg color-black"
          ></span>
        </a>
      </li>
      <li class="li-menu float-right">
        <a href="javascript:void(0)" @click="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span> {{ username }} </span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import BaseComponent from "../mixins/BaseComponent.js";

export default {
  mixins: [BaseComponent],
  data() {
    return {
      username: "",
    };
  },
  created() {
    var username = localStorage.getItem("username");
    this.username = username;

    if (!username) {
      this.$router.push("/login");
    }
  },

  methods: {
    logout() {
      localStorage.removeItem("username");
      this.$router.push("/login");
    },
  },
};
</script>
