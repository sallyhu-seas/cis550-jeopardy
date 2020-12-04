<template>
  <div class="container-fluid">
    <div class="row ml-0 mr-0 bg-banner" style="height: 250px"></div>

    <div class="row ml-0 mr-0">
      <div class="col-md-12 mt-2 mb-2">
        <h3>{{ categoryText }}</h3>

        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Category</h6>
              <h5 class="h3 mb-0">Total questions</h5>
            </div>
          </div>

          <bar-chart
            :height="350"
            ref="barChart"
            :chart-data="category.chartData"
          >
          </bar-chart>
        </card>
      </div>

      <div class="col-md-12 mt-2 mb-2">
        <h3>{{ answerText }}</h3>

        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Answer</h6>
              <h5 class="h3 mb-0">Total questions</h5>
            </div>
          </div>

          <bar-chart
            :height="350"
            ref="barChart"
            :chart-data="answer.chartData"
          >
          </bar-chart>
        </card>
      </div>
      </div>
    </div>
</template>
<script>
import BarChart from "@/components/Charts/BarChart";
import QuestionService from "../services/QuestionService.js";


export default {
  components: {
    BarChart,
  },
  data() {
    return {
      category: {
        chartData: {},
      },
      answer: {
        chartData: {},
      },
      categoryText: "",
      answerText: "",
    };
  },
  created() {
    this.getConfigurations();
    this.getQuestionsByCategory();
    this.getQuestionsByAnswer();
  },
  methods: {
    getQuestionsByCategory() {
      let params = {
        take: 20,
      };

      QuestionService.getTopQuestionsByCategory(params)
        .then((response) => {
          if (response) {
            let labels = [];
            let data = [];

            for (let i = 0; i < response.data.list.length; i++) {
              labels.push(response.data.list[i].category);
              data.push(response.data.list[i].totalQuestions);
            }

            this.category = {
              chartData: {
                labels: labels,
                datasets: [
                  {
                    label: "Questions",
                    data: data,
                  },
                ],
              },
            };
          }
        })
        .catch(() => {});
    },

    getQuestionsByAnswer() {
      let params = {
        take: 20,
      };

      QuestionService.getTopQuestionsByAnswer(params)
        .then((response) => {
          if (response) {
            let labels = [];
            let data = [];

            for (let i = 0; i < response.data.list.length; i++) {
              labels.push(response.data.list[i].answer);
              data.push(response.data.list[i].totalQuestions);
            }

            this.answer = {
              chartData: {
                labels: labels,
                datasets: [
                  {
                    label: "Questions",
                    data: data,
                  },
                ],
              },
            };
          }
        })
        .catch(() => {});
    },

    getConfigurations() {
      QuestionService.getConfigurations()
        .then((response) => {
          if (response) {
            for (let i = 0; i < response.data.list.length; i++) {
              if (response.data.list[i].code == "QUESTION-CATEGORY") {
                this.categoryText = response.data.list[i].value;
              }
              if (response.data.list[i].code == "QUESTION-ANSWER") {
                this.answerText = response.data.list[i].value;
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
