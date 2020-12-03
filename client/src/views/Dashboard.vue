<template>
  <div class="container-fluid bg-dashboard">
    <h2 class="color-white text-center" style="padding-top: 105px">
      {{ homeText }}
    </h2>
  </div>
</template>
<script>
import QuestionService from "../services/QuestionService.js";

export default {
  data() {
    return {
      homeText: "",
    };
  },
  created() {
    //this.getConfigurations();
  },
  methods: {
    getConfigurations() {
      QuestionService.getConfigurations()
        .then((response) => {
          if (response) {
            for (let i = 0; i < response.data.list.length; i++) {
              if (response.data.list[i].code == "HOME") {
                this.homeText = response.data.list[i].value;
              }
            }
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style></style>
