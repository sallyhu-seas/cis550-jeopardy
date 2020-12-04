<template>
  <div>
    <div class="container-fluid">
      <div class="row ml-0 mr-0 bg-banner" style="height: 250px"></div>

      <br />
      <div class="col-md-12">
          <h2>
            {{ 'Select One of the Filters Below to Start Your Queries!' }}
          </h2>
          <br>
        <div class="row">
          <div class="col-md-3">
            <diV class="form-group-row">
              <label class="col-sm-4 mt-1">State</label>
              <el-select
                class="select-danger select-custom font-italic col-sm-8 rounded-0"
                v-model="stateSearch"
                :placeholder="'State'"
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in listStates"
                  class="select-danger"
                  :value="item.name"
                  :label="item.name"
                  :key="item.name"
                ></el-option>
              </el-select>
            </diV>
          </div>
          <div class="col-md-3">
            <diV class="form-group-row">
              <label class="col-sm-4 mt-1">Season</label>
              <el-select
                class="select-danger select-custom font-italic col-sm-8 rounded-0"
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
          <div class="col-md-3">
            <diV class="form-group-row">
              <label class="col-sm-4 mt-1">Airdate</label>
              <el-select
                class="select-danger select-custom font-italic col-sm-8 rounded-0"
                v-model="airDateSearch"
                :placeholder="'Airdate'"
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in listAirDates"
                  class="select-danger"
                  :value="item.id"
                  :label="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </diV>
          </div>
          <div class="col-md-3">
            <diV class="form-group-row">
              <label class="col-sm-4 mt-1">Status</label>
              <el-select
                class="select-danger select-custom font-italic col-sm-8 rounded-0"
                v-model="isWinnerSearch"
                :placeholder="'Status'"
                :clearable="true"
                :filterable="true"
              >
                <el-option
                  v-for="item in listIsWinners"
                  class="select-danger"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </diV>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-4"></div>
          <div class="col-md-4 text-center">
            <base-button
              type="primary"
              style="min-width: 120px"
              @click="commonSearch()"
              class="border-0 rounded-0 btn-custom"
              >{{ $t("grid.search") }}</base-button
            >
            <base-button
              type="primary"
              style="min-width: 120px"
              @click="removeFilter()"
              class="border-0 rounded-0 btn-custom"
              >{{ $t("grid.reset_filter") }}</base-button
            >
          </div>
        </div>
        <br />
      </div>

      <div class="scrollbar-table">
        <base-table-custom :headers="headers" :items="listContestants">
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
              {{ (currentPage - 1) * perPage + (props.index + 1) }}
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.occupation }}</td>
            <td>{{ props.item.state }}</td>
            <td class="text-right">{{ props.item.season }}</td>
            <td class="text-right">{{ props.item.showNum }}</td>
            <td class="text-center">
              {{ convertDateDbToDateClient(props.item.airDate) }}
            </td>
            <td>{{ convertIsWinner(props.item.isWinner) }}</td>
          </template>
          <template v-slot:noRecord v-if="totalRecords == 0">
            <td :colspan="headers.length" class="text-center no-records">
              {{ $t("grid.no_records") }}
            </td>
          </template>
        </base-table-custom>
      </div>

      <base-pagination-custom
        v-show="listContestants.length > 0"
        :total="totalRecords"
        :current-page="currentPage"
        @pagechanged="onPageChange"
        @changerowsperpage="onChangeRowsPerPage"
      ></base-pagination-custom>
    </div>
  </div>
</template>
<script>
import BaseComponent from "../mixins/BaseComponent.js";
import DateUtils from "../mixins/DateUtils.js";
import DatabaseService from "../services/DatabaseService.js";

export default {
  name: "contestants",
  mixins: [BaseComponent, DateUtils],
  data() {
    return {
      //Header
      headers: [
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
          text: "State",
        },
        {
          text: "Season",
        },
        {
          text: "Show number",
        },
        {
          text: "Airdate",
        },
        {
          text: "Status",
        },
      ],

      // List
      listContestants: [],
      listStates: [
        {
          name: "Alabama",
          abbreviation: "AL",
        },
        {
          name: "Alaska",
          abbreviation: "AK",
        },
        {
          name: "American Samoa",
          abbreviation: "AS",
        },
        {
          name: "Arizona",
          abbreviation: "AZ",
        },
        {
          name: "Arkansas",
          abbreviation: "AR",
        },
        {
          name: "California",
          abbreviation: "CA",
        },
        {
          name: "Colorado",
          abbreviation: "CO",
        },
        {
          name: "Connecticut",
          abbreviation: "CT",
        },
        {
          name: "Delaware",
          abbreviation: "DE",
        },
        {
          name: "District Of Columbia",
          abbreviation: "DC",
        },
        {
          name: "Federated States Of Micronesia",
          abbreviation: "FM",
        },
        {
          name: "Florida",
          abbreviation: "FL",
        },
        {
          name: "Georgia",
          abbreviation: "GA",
        },
        {
          name: "Guam",
          abbreviation: "GU",
        },
        {
          name: "Hawaii",
          abbreviation: "HI",
        },
        {
          name: "Idaho",
          abbreviation: "ID",
        },
        {
          name: "Illinois",
          abbreviation: "IL",
        },
        {
          name: "Indiana",
          abbreviation: "IN",
        },
        {
          name: "Iowa",
          abbreviation: "IA",
        },
        {
          name: "Kansas",
          abbreviation: "KS",
        },
        {
          name: "Kentucky",
          abbreviation: "KY",
        },
        {
          name: "Louisiana",
          abbreviation: "LA",
        },
        {
          name: "Maine",
          abbreviation: "ME",
        },
        {
          name: "Marshall Islands",
          abbreviation: "MH",
        },
        {
          name: "Maryland",
          abbreviation: "MD",
        },
        {
          name: "Massachusetts",
          abbreviation: "MA",
        },
        {
          name: "Michigan",
          abbreviation: "MI",
        },
        {
          name: "Minnesota",
          abbreviation: "MN",
        },
        {
          name: "Mississippi",
          abbreviation: "MS",
        },
        {
          name: "Missouri",
          abbreviation: "MO",
        },
        {
          name: "Montana",
          abbreviation: "MT",
        },
        {
          name: "Nebraska",
          abbreviation: "NE",
        },
        {
          name: "Nevada",
          abbreviation: "NV",
        },
        {
          name: "New Hampshire",
          abbreviation: "NH",
        },
        {
          name: "New Jersey",
          abbreviation: "NJ",
        },
        {
          name: "New Mexico",
          abbreviation: "NM",
        },
        {
          name: "New York",
          abbreviation: "NY",
        },
        {
          name: "North Carolina",
          abbreviation: "NC",
        },
        {
          name: "North Dakota",
          abbreviation: "ND",
        },
        {
          name: "Northern Mariana Islands",
          abbreviation: "MP",
        },
        {
          name: "Ohio",
          abbreviation: "OH",
        },
        {
          name: "Oklahoma",
          abbreviation: "OK",
        },
        {
          name: "Oregon",
          abbreviation: "OR",
        },
        {
          name: "Palau",
          abbreviation: "PW",
        },
        {
          name: "Pennsylvania",
          abbreviation: "PA",
        },
        {
          name: "Puerto Rico",
          abbreviation: "PR",
        },
        {
          name: "Rhode Island",
          abbreviation: "RI",
        },
        {
          name: "South Carolina",
          abbreviation: "SC",
        },
        {
          name: "South Dakota",
          abbreviation: "SD",
        },
        {
          name: "Tennessee",
          abbreviation: "TN",
        },
        {
          name: "Texas",
          abbreviation: "TX",
        },
        {
          name: "Utah",
          abbreviation: "UT",
        },
        {
          name: "Vermont",
          abbreviation: "VT",
        },
        {
          name: "Virgin Islands",
          abbreviation: "VI",
        },
        {
          name: "Virginia",
          abbreviation: "VA",
        },
        {
          name: "Washington",
          abbreviation: "WA",
        },
        {
          name: "West Virginia",
          abbreviation: "WV",
        },
        {
          name: "Wisconsin",
          abbreviation: "WI",
        },
        {
          name: "Wyoming",
          abbreviation: "WY",
        },
      ],
      listSeasons: [],
      listAirDates: [{}],
      listIsWinners: [
        {
          id: 0,
          name: "LOSE",
        },
        {
          id: 1,
          name: "WIN",
        },
      ],

      stateSearch: null,
      seasonSearch: null,
      airDateSearch: null,
      isWinnerSearch: null,
    };
  },
  created() {
    this.getList();
    this.getListSeasons();
  },

  methods: {
    // -------------------------------------- VIEW ------------------------------------------//
    commonSearch() {
      this.currentPage = 1;
      this.getList();
    },

    getList() {
      let params = {
        state: this.stateSearch,
        season: this.seasonSearch,
        airDate: this.airDateSearch,
        isWinner: this.isWinnerSearch,
        skip: (this.currentPage - 1) * this.perPage,
        take: this.perPage,
      };

      this.showLoading();
      DatabaseService.getList(params)
        .then((response) => {
          if (response) {
            this.listContestants = response.data.list;
            this.totalRecords = response.data.totalRecords;
          }
        })
        .catch(() => {
          this.listContestants = [];
          this.$notify({
            type: "danger",
            message: this.$i18n.t("common.error_connection"),
          });
        })
        .finally(() => {
          this.hideLoading();
        });
    },

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

      DatabaseService.getListAirDates(params)
        .then((response) => {
          if (response) {
            this.listAirDates = [];
            for (let i = 0; i < response.data.list.length; i++) {
              this.listAirDates.push({
                id: this.convertDateDbToDateClient(
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

    removeFilter() {
      this.stateSearch = null;
      this.seasonSearch = null;
      this.airDateSearch = null;
      this.isWinnerSearch = null;
    },

    convertIsWinner(item) {
      switch (item) {
        case 0:
          return "LOSE";
        case 1:
          return "WIN";
        default:
          return "undefined";
      }
    },

    onPageChange(page) {
      this.currentPage = page;
      this.getList();
    },

    onChangeRowsPerPage(rowsPerPage) {
      this.currentPage = 1;
      this.perPage = rowsPerPage;
      this.getList();
    },

    // ------------------------------------END VIEW ------------------------------------------//
  },
};
</script>
<style></style>
