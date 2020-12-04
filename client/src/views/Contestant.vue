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
        
        <div style="white-space: pre-line;">{{textWithLineBreaks}}
        </div>
        
        <h3>
          {{ occupationText }}
        </h3>

        <div class="col md 12">
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
        <br>
        <br>
      </div>

      <div class="col-md-12 mt-2 mb-2">
        <h3>
          {{ stateText }}
        </h3>

        <div class="col md 12">
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
        <br>
        <br>
      </div>

      <div class="col-md-12 mt-2 mb-2">
        <Tableau
          url="https://public.tableau.com/shared/HRX9FWBF3?:display_count=y&:origin=viz_share_link"
          ref="tableau"
        >
        </Tableau>
      </div>
    </div>

    <div class="col-md-12 mt-2 mb-2">
      <h2>
        {{ '      Example of some complex queries.' }}
      </h2>
    </div>

    <div class="row ml-0 mr-0">
      <div class="col-md-6 mt-2 mb-2">
        <card header-classes="bg-transparent pt-3">
          <div class="scrollbar-table">
            <base-table-custom :headers="headersWinners" :items="listWinners">
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
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.occupation }}</td>
                <td class="text-center">{{ props.item.numWon }}</td>
              </template>
            </base-table-custom>
          </div>
        </card>
      </div>
      <div class="col-md-6 mt-2 mb-2">
        <card header-classes="bg-transparent pt-3">
          <div class="scrollbar-table">
            <base-table-custom
              :headers="headersDateDiffs"
              :items="listDateDiffs"
            >
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
                <td>{{ props.item.name }}</td>
                <td class="text-center">{{ props.item.dateDiff }}</td>
              </template>
            </base-table-custom>
          </div>
        </card>
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
      stateText: "",
      headersWinners: [
        {
          text: "No",
        },
        {
          text: "Name",
        },
        {
          text: "Occupation",
        },
        {
          text: "Number of Wins",
        },
      ],
      headersDateDiffs: [
        {
          text: "No",
        },
        {
          text: "Name",
        },
        {
          text: "Days Needed to Win",
        },
      ],
      listWinners: [],
      listDateDiffs: [],
    };
  },
  created() {
    this.getConfigurations();
    this.getWinnersByOccupation();
    this.getWinnersByState();
    this.getDateDiffs();
    this.getTopWinnersByTopOccupation();
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
              labels.push(response.data.list[i].name);
              data.push(response.data.list[i].numConsecutiveWins);
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

    getDateDiffs() {
      ContestantService.getDateDiffs()
        .then((response) => {
          if (response) {
            this.listDateDiffs = response.data.list;
          }
        })
        .catch(() => {});
    },

    getTopWinnersByTopOccupation() {
      ContestantService.getTopWinnersByTopOccupation()
        .then((response) => {
          if (response) {
            this.listWinners = response.data.list;
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style></style>
