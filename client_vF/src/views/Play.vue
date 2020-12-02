<template>
  <div
    class="container-fluid"
    style="background-color: rgb(0, 31, 146); height: 94vh; width: 100%"
  >
    <div class="col-12 pt-4" style="text-align: center">
      <div v-if="!isClickStart">
        <h2 class="color-white">Let's Play Jeopardy!</h2>
        <h4 class="color-white">
          Choose a Season, Airdate, and Round to Start
        </h4>
      </div>
      <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6 row">
          <div class="col-3">
            <diV class="form-group-row">
              <el-select
                class="select-danger select-custom font-italic col-sm-12 rounded-0"
                v-model="seasonSearch"
                :placeholder="'Season'"
                :clearable="true"
                :filterable="true"
                @change="getListAirDates()"
              >
                <el-option
                  v-for="item in listSeasons"
                  class="select-danger"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </diV>
          </div>
          <div class="col-3">
            <diV class="form-group-row">
              <el-select
                class="select-danger select-custom font-italic col-sm-12 rounded-0"
                v-model="airDateSearch"
                :placeholder="'Airdate'"
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in listAirDates"
                  class="select-danger"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </diV>
          </div>
          <div class="col-3">
            <diV class="form-group-row">
              <el-select
                class="select-danger select-custom font-italic col-sm-12 rounded-0"
                v-model="roundSearch"
                :placeholder="'Round'"
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in listRounds"
                  class="select-danger"
                  :value="item.name"
                  :label="item.name"
                  :key="item.name"
                ></el-option>
              </el-select>
            </diV>
          </div>
          <div class="col-3">
            <base-button
              type="primary"
              style="
              width: 100px;
              background-color: #eb7a04 !important;
              color: black !important;
            "
              @click="start()"
              class="border-0 btn-custom color-white"
              >Let's Go!</base-button
            >
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="row ml-0 mr-0" v-if="isClickStart">
      <div class="col-2"></div>
      <div class="col-8" style="background-color: black; height: 435px">
        <div class="row">
          <div
            class="col-2 p-2 mr-0 ml-0"
            v-for="(item, index) in data"
            :key="index"
          >
            <div class="col-12">
              <div class="box">{{ item.catName }}</div>
            </div>
            <br />
            <div v-for="(question, index2) in item.questions" :key="index2">
              <div
                class="col-12"
                @click="clickQuestion(question)"
                :class="{ disable: question.isClick }"
              >
                <div class="box-value">$ {{ question.value }}</div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div style="text-align: center" v-if="isClickStart">
      <h2 class="pt-3 pl-3 color-white" style="height: 80px">
        {{ question }}
      </h2>
      <br />

      <div class="color-white ml-2" v-if="isDisplayOverride && times > 0">
        Your answer, <span class="font-weight-bold">{{ answer }}</span> was
        incorrect. The correct answer was:
        <span class="font-weight-bold">{{ trueAnswer }}</span
        >. If your answer is actually correct, please click the
        <span class="font-weight-bold">OVERRIDE</span> button below. You lost
        <span class="font-weight-bold">{{ value }}</span> points. Pick a new
        question when you're ready.
      </div>
      <base-button
        v-if="isDisplayOverride && times > 0"
        type="primary"
        style="
          min-width: 120px;
          background-color: #eb7a04 !important;
          color: black !important;
        "
        @click="override()"
        class="border-0 btn-custom color-white ml-2"
        >Override ({{ times }})</base-button
      >
      <br />
      <div class="col-12 row">
        <div class="col-md-5"></div>
        <div class="col-md-2 text-center">
          <h3 class="color-white">Score: {{ score }}</h3>
        </div>
        <div class="col-md-5"></div>
        <div class="col-md-5"></div>
        <div class="col-md-2">
          <base-input
            class="input-group-alternative"
            placeholder="Enter your answer"
            v-model="answer"
          ></base-input>
          <br />
        </div>
        <div class="col-md-5"></div>
        <div class="col-md-4"></div>
        <div class="col-md-4 text-center">
          <base-button
            type="primary"
            style="
              min-width: 120px;
              background-color: #eb7a04 !important;
              color: black !important;
            "
            @click="submit()"
            class="border-0 btn-custom color-white"
            >Submit</base-button
          >
          <base-button
            type="primary"
            style="
              min-width: 120px;
              background-color: #eb7a04 !important;
              color: black !important;
            "
            @click="pass()"
            class="border-0 btn-custom color-white"
            >Pass</base-button
          >
        </div>
        <div class="col-md-4"></div>
      </div>
    </div>
    <br />
  </div>
</template>
<script>
import BaseComponent from "../mixins/BaseComponent.js";
import DateUtils from "../mixins/DateUtils.js";
import PlayService from "../services/PlayService.js";

export default {
  name: "play",
  mixins: [BaseComponent, DateUtils],
  data() {
    return {
      listSeasons: [],
      listAirDates: [{}],
      listRounds: [
        { name: "Jeopardy!" },
        { name: "Double Jeopardy!" },
        { name: "Final Jeopardy!" },
      ],
      seasonSearch: null,
      airDateSearch: null,
      roundSearch: null,
      question: "",
      data: [],
      isClickStart: false,
      isChooseQuestion: true,
      isDisplayOverride: false,
      times: 3,
      answer: "",
      value: 0,
      score: 0,
      id: null,
      trueAnswer: "",
    };
  },
  created() {
    this.getListSeasons();
  },
  methods: {
    getListSeasons() {
      for (let i = 37; i >= 1; i--) {
        this.listSeasons.push({
          id: i,
          name: "Season " + i,
        });
      }
    },

    getListAirDates() {
      this.listAirDates = [{}];
      this.airDateSearch = null;

      let params = {
        season: this.seasonSearch,
      };

      PlayService.getListAirDates(params)
        .then((response) => {
          if (response) {
            this.listAirDates = [];
            for (let i = 0; i < response.data.list.length; i++) {
              this.listAirDates.push({
                id: response.data.list[i].showNum,
                name: this.convertDateDbToDateClient(
                  response.data.list[i].airDate
                ),
              });
            }
          }
        })
        .catch(() => {
          this.listAirDates = [{}];
        });
    },

    submit() {
      if (this.isChooseQuestion) {
        this.$notify({
          type: "danger",
          message: "Please choose the question",
        });
        return;
      }

      let body = {
        id: this.id,
        answer: this.answer,
      };

      PlayService.checkAnswer(body)
        .then((response) => {
          if (response) {
            if (response.data.status == 1) {
              this.$notify({
                type: "success",
                message: response.data.message,
              });
              this.score += this.value;
              this.isDisplayOverride = false;
            } else {
              this.$notify({
                type: "danger",
                message: response.data.message,
              });
              this.score -= this.value;
              this.isDisplayOverride = true;
            }
            this.trueAnswer = response.data.answer;
            this.isChooseQuestion = true;
          }
        })
        .catch(() => {
          this.listAirDates = [{}];
        });
    },

    pass() {
      if (this.isChooseQuestion) {
        this.$notify({
          type: "danger",
          message: "Please choose the question",
        });
        return;
      }

      this.isChooseQuestion = true;
      this.score -= this.value;
    },

    override() {
      this.score += this.value * 2;
      this.times--;
      this.isDisplayOverride = false;
    },

    start() {
      if (
        this.seasonSearch == null ||
        this.airDateSearch == null ||
        this.roundSearch == null
      ) {
        this.$notify({
          type: "danger",
          message: "Please fill the information",
        });
        return;
      }

      let params = {
        showNum: this.airDateSearch,
        round: this.roundSearch,
      };

      PlayService.getQuestions(params)
        .then((response) => {
          var result = response.data.list;
          this.data = this.groupBy(result, function(item) {
            return [item.category];
          });

          this.isClickStart = true;
          this.question = null;
          this.value = null;
          this.isChooseQuestion = true;
          this.isDisplayOverride = false;
          this.times = 3;
          this.answer = "";
          this.value = 0;
          this.score = 0;
          this.id = null;
        })
        .catch(() => {});
    },

    groupBy(array, f) {
      var fields = {};
      array.forEach(function(o) {
        o.isClick = false;
        var field = JSON.stringify(f(o));
        fields[field] = fields[field] || [];
        fields[field].push(o);
      });

      return Object.keys(fields).map(function(field) {
        var json = JSON.parse(field);
        var catName = json[0];

        return {
          catName: catName,
          questions: fields[field],
        };
      });
    },

    clickQuestion(item) {
      if (item.isClick) return;
      if (!this.isChooseQuestion) {
        this.$notify({
          type: "danger",
          message: "Please submit or pass the question",
        });
        return;
      }

      this.answer = "";
      this.isDisplayOverride = false;
      this.isChooseQuestion = false;
      item.isClick = true;
      this.question = item.question;
      this.value = item.value;
      this.id = item.id;
    },
  },
};
</script>
<style>
.box {
  text-align: center;
  font-size: 15px;
  height: 70px;
  width: 100%;
  color: white;
  background-color: rgb(0, 31, 146);
  border: 1px solid white;
  padding: 2px;
}

.box-value {
  cursor: pointer;
  align-content: middle;
  text-align: center;
  font-size: 33px;
  height: 50px;
  width: 100%;
  color: yellow;
  background-color: rgb(0, 31, 146);
  border: 1px solid white;
  padding: 2px;
}

.disable {
  opacity: 0.3;
}
</style>
