<template>
  <div class="container-fluid">
    <div class="row ml-0 mr-0 bg-dashboard" style="height: 720px"></div>
    <br />
  
  <div class="col-md-12 mt-2 mb-2">
    <center>
          <h1>
            {{ 'Welcome to Group 7 Live Show!' }}
          </h1>
    </center>
  </div>

    <div
      class="row ml-0 mr-0"
      style="height: 450px; background-color: white !important"
    >
      <div class="col-md-1"></div>
      <div class="col-md-10 row bg-transparent pt-3">
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(12, 105, 92)">
            <div class="bg-box-1" style="height: 150px"></div>
            <h3 class="p-2 color-white"> Created by Merv Griffin, the show features a quiz competition in which contestants are presented with general knowledge clues in the form of answers, and must phrase their responses in the form of questions. 
            </h3>
            <button class="btn button-box" @click="changePage('/Play')">
              LET'S PLAY JEOPARDY!
            </button>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(25, 66, 152)">
            <div class="bg-box-2" style="height: 270px"></div>
            <h2 class="color-white">Start your queries here!</h2>
            <button class="btn button-box" @click="changePage('/Database')">
              QUERY OUR DATABASE
            </button>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(30, 182, 210)">
            <div class="bg-box-3" style="height: 200px"></div>
            <h3 class="p-2 color-white"> Have you ever wondered which states have the most number of show winners or which occupations are more likely to win the show? Find out some interesting facts about the game HERE! 
            </h3>
            <button class="btn button-box" @click="changePage('/Contestant')">
              CONTESTANT
            </button>
            <button class="btn button-box" @click="changePage('/Question')">
              QUESTION
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <h2 class="color-white text-center" style="padding-top: 105px">
      {{ homeText }}
    </h2> -->
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
    changePage(url) {
      this.$router.push(url);
    },
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
<style>
.box-page {
  height: 400px;
  border-radius: 5px;
}

.button-box {
  width: 150px;
  border: 2px solid white !important;
  color: white !important;
  font-weight: bold;
}
</style>
