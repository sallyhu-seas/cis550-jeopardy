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
        <h3>
          {{ occupationText }}
        </h3>

        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Winners</h6>
              <h5 class="h3 mb-0">By Occupation</h5>
            </div>
          </div>

          <bar-chart
            :height="350"
            ref="barChart"
            :chart-data="occupation.chartData"
          >
          </bar-chart>
        </card>
      </div>

      <div class="col-md-12 mt-2 mb-2">
        <h3>
          {{ stateText }}
        </h3>

        <card header-classes="bg-transparent pt-3">
          <div slot="header" class="row align-items-center">
            <div class="col">
              <h6 class="text-uppercase text-muted ls-1 mb-1">Top Winners</h6>
              <h5 class="h3 mb-0">By Longest, Consecutive Winning Streak</h5>
            </div>
          </div>

          <bar-chart :height="350" ref="barChart" :chart-data="state.chartData">
          </bar-chart>
        </card>
      </div>

      <div class="col-md-12 mt-2 mb-2">
        <Tableau
          url="https://public.tableau.com/shared/HRX9FWBF3?:display_count=y&:origin=viz_share_link"
          :height="1000"
          :width="2000"
          ref="tableau"
        >
        </Tableau>
      </div>
    </div>
  </div>
</template>
<script>
import BarChart from "@/components/Charts/BarChart";
import ContestantService from "../services/ContestantService.js";
import "vue-tableau";

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      occupation: {
        chartData: {},
      },
      state: {
        chartData: {},
      },
      mainText: "",
      subText: "",
      occupationText: "",
      stateText: ""
    };
  },
  created() {
    this.getConfigurations();
    this.getWinnersByOccupation();
    this.getWinnersByState();
  },
  methods: {
    getWinnersByOccupation() {
      let params = {
        take: 20,
      };

      ContestantService.getTopWinnersByOccupation(params)
        .then((response) => {
          if (response) {
            let labels = [];
            let data = [];

            for (let i = 0; i < response.data.list.length; i++) {
              labels.push(response.data.list[i].occupation);
              data.push(response.data.list[i].totalWinners);
            }

            this.occupation = {
              chartData: {
                labels: labels,
                datasets: [
                  {
                    label: "Winners",
                    data: data,
                  },
                ],
              },
            };
          }
        })
        .catch(() => {});
    },

    getWinnersByState() {
      let params = {
        take: 20,
      };

      ContestantService.getTopWinnersByState(params)
        .then((response) => {
          if (response) {
            let labels = [];
            let data = [];

            for (let i = 0; i < response.data.list.length; i++) {
              labels.push(response.data.list[i].state);
              data.push(response.data.list[i].totalWinners);
            }

            this.state = {
              chartData: {
                labels: labels,
                datasets: [
                  {
                    label: "Winners",
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
      ContestantService.getConfigurations()
        .then((response) => {
          if (response) {
            for (let i = 0; i < response.data.list.length; i++) {
              if (response.data.list[i].code == "MAIN-CONTESTANTS") {
                this.mainText = response.data.list[i].value;
              }
              if (response.data.list[i].code == "SUB-CONTESTANTS") {
                this.subText = response.data.list[i].value;
              }
              if (response.data.list[i].code == "WINNER-OCCUPATION") {
                this.occupationText = response.data.list[i].value;
              }
              if (response.data.list[i].code == "WINNER-STATE") {
                this.stateText = response.data.list[i].value;
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
