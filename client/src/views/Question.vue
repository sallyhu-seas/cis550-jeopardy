<template>
  <div class="container-fluid">
    <div class="row ml-0 mr-0 bg-banner" style="height: 250px"></div>

    <div class="row ml-0 mr-0">
      <div class="col-md-12 mt-2 mb-2">
        <center>
          <h1>
            {{ mainText }}
            <h2>
              {{ subText }}
            </h2>
          </h1>
        </center>
      </div>
    </div>

    <div class="row ml-0 mr-0">
      <div class="col-md-6 mt-2 mb-2">
        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Category</h6>
              <h5 class="h3 mb-0">Top 10 Most Popular</h5>
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

      <div class="col-md-6 mt-2 mb-2">
        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Answer</h6>
              <h5 class="h3 mb-0">Top 10 Most Popular</h5>
            </div>
          </div>

          <bar-chart
            :height="350"
            ref="barChart"
            :chart-data="answer.chartData"
          >
          </bar-chart>
        </card>
        <br>
        <br>
      </div>
    </div>

    <div class="col-md-12 mt-2 mb-2">
      <center>
      <Tableau
        url="https://public.tableau.com/views/Book5_16070478720750/Dashboard1?:language=en&:display_count=y&:origin=viz_share_link"
        width="1650px"
        ref="tableau"
      >
      </Tableau>
      </center>
    </div>

    <div class="col-md-12 mt-2 mb-2">
      <h2>
        {{ 'Questions from Top Categories of Top Answers' }}
      </h2>
    </div>

    <div class="col-md-12 mt-2 mb-2">
      <card header-classes="bg-transparent pt-3">
        <div class="scrollbar-table">
          <base-table-custom :headers="headersTopQuestion" :items="listTopQuestion">
            <template v-slot:headers="props">
              <tr>
                <th
                  v-for="(header, index) in props.headers"
                  :key="index"
                  class="text-center bg-primary-line text-white"
                >
                  {{ header.text }}
                </th>
              </tr>
            </template>

            <template v-slot:item="props">
              <td class="text-center">
                {{ props.index + 1 }}
              </td>
              <td>{{ props.item.category }}</td>
              <td>{{ props.item.question }}</td>
              <td>{{ props.item.answer }}</td>
            </template>
          </base-table-custom>
        </div>
      </card>
    </div>
      
  </div>
</template>
<script>
import BarChart from "@/components/Charts/BarChart";
import QuestionService from "../services/QuestionService.js";
import "vue-tableau";

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

      headersTopQuestion: [
        {
          text: "No",
        },
        {
          text: "Category",
        },
        {
          text: "Question",
        },
        {
          text: "Answer",
        },
      ],

      listTopQuestion: [],
    };
       
  },
  created() {
    this.getConfigurations();
    this.getQuestionsByCategory();
    this.getQuestionsByAnswer();
    this.getQuestionsFromTopCategoriesOfTopAnswers();
  },
  methods: {
    getQuestionsByCategory() {
      let params = {
        take: 10,
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
        take: 10,
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

    getQuestionsFromTopCategoriesOfTopAnswers() {

      QuestionService.getQuestionsFromTopCategoriesOfTopAnswers()
        .then((response) => {
          if (response) {
            this.listTopQuestion = response.data.list;
          }
        })
        .catch(() => {});
    },
    
    getConfigurations() {
      QuestionService.getConfigurations()
        .then((response) => {
          if (response) {
            for (let i = 0; i < response.data.list.length; i++) {
              if (response.data.list[i].code == "MAIN-QUESTION") {
                this.mainText = response.data.list[i].value;
              }
              if (response.data.list[i].code == "SUB-QUESTION") {
                this.subText = response.data.list[i].value;
              }
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
