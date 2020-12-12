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
      style="height: 470px; background-color: white !important"
    >
      <div class="col-md-1"></div>
      <div class="col-md-10 row bg-transparent pt-3">
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(3, 41, 115)">
            <div class="bg-box-1" style="height: 220px"></div>
            <h3 class="p-2 color-white"> Created by Merv Griffin, the show features a quiz competition in which contestants are presented with general knowledge clues in the form of answers, and must phrase their responses in the form of questions. 
            </h3>
            <button class="btn button-box" @click="changePage('/Play')">
              LET'S PLAY JEOPARDY!
            </button>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(3, 12, 38)">
            <div class="bg-box-2" style="height: 247px"></div>
            <h3 class="p-2 color-white"> Want to crunch some numbers on what happened in previous seasons? Our database contains over 20,000 records of contestant data dating back to 1986. 
            </h3>
            <button class="btn button-box" @click="changePage('/Database')">
              QUERY OUR DATABASE
            </button>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="box-page" style="background-color: rgb(3, 12, 38)">
            <div class="bg-box-3" style="height: 250px"></div>
            <h3 class="p-2 color-white"> What profession tends to edge out the competition? What kind of questions come up the most? Check out some interesting stats we compiled. 
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
  height: 435px;
  border-radius: 5px;
}

.button-box {
  width: 150px;
  border: 2px solid white !important;
  color: white !important;
  font-weight: bold;
}
</style>
