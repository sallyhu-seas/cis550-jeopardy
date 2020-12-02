<template>
  <div
    class="float-right m-2"
    name="base-pagination-custom"
    style="line-height: 36px"
  >
    <ul
      class="pagination"
      :class="[
        size && `pagination-${size}`,
        align && `justify-content-${align}`,
      ]"
    >
      <li class="page-item prev-page" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" aria-label="First" @click="firstPage">
          <span aria-hidden="true"
            ><i class="fa fa-angle-double-left" aria-hidden="true"></i
          ></span>
        </a>
      </li>
      <!-- <li class="page-item prev-page" :class="{disabled: value === 1}">
        <a class="page-link" aria-label="Previous" @click="prevPage">
          <span aria-hidden="true"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
        </a>
      </li> -->
      <li
        class="page-item cursor-pointer"
        :class="{
          active: currentPage === item,
          'disable-a': currentPage == item,
        }"
        :key="item"
        v-for="item in range(minPage, maxPage)"
      >
        <a class="page-link border-0" @click="changePage(item)">{{ item }}</a>
      </li>
      <!-- <li class="page-item next-page" :class="{disabled: value === totalPages}"> -->
      <!-- <li type="button" class="page-item" :class="{active: currentPage === item, 'disable-a': currentPage == item}"
          :key="item"
          v-for="item in range(minPage, maxPage)">
          <a class="page-link border-0" @click="changePage(item)">{{item}}</a>
      </li>
      <li class="page-item next-page" :class="{disabled: value === totalPages}">
        <a class="page-link" aria-label="Next" @click="nextPage">
          <span aria-hidden="true"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
        </a>
      </li> -->
      <li
        class="page-item next-page"
        :class="{ disabled: currentPage === totalPages }"
      >
        <a class="page-link" aria-label="Last" @click="lastPage">
          <span aria-hidden="true"
            ><i class="fa fa-angle-double-right" aria-hidden="true"></i
          ></span>
        </a>
      </li>
      <el-select
        class="select-danger select-custom ml-1 mr-1 widht-70"
        v-model="perPage"
        @change="changeRowsPerPage()"
      >
        <el-option
          v-for="item in selectOptions"
          class="select-danger"
          :value="item"
          :label="item"
          :key="item"
        ></el-option>
      </el-select>
      <span class="view-record">
        {{ $t("pagination.view") }} {{ firstRecord }} - {{ lastRecord }} /
        {{ total }} {{ $t("pagination.record") }}
      </span>
    </ul>
  </div>
</template>
<script>
export default {
  name: "base-pagination-custom",
  props: {
    pageCount: {
      type: Number,
      default: 0,
      description:
        "Pagination page count. This should be specified in combination with perPage",
    },
    total: {
      type: Number,
      default: 0,
      description:
        "Can be specified instead of pageCount. The page count in this case will be total/perPage",
    },
    value: {
      type: Number,
      default: 1,
      description: "Pagination value",
    },
    size: {
      type: String,
      default: "",
      description: "Pagination size",
    },
    align: {
      type: String,
      default: "",
      description: "Pagination alignment (e.g center|start|end)",
    },
    currentPage: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  computed: {
    firstRecord() {
      return (this.currentPage - 1) * this.perPage + 1;
    },

    lastRecord() {
      if ((this.currentPage - 1) * this.perPage + this.perPage > this.total)
        return this.total;
      else {
        return (this.currentPage - 1) * +this.perPage + +this.perPage;
      }
    },

    totalPages() {
      if (this.pageCount > 0) return this.pageCount;
      if (this.total > 0) {
        return Math.ceil(this.total / this.perPage);
      }
      return 1;
    },
    pagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages;
      }
      return this.defaultPagesToDisplay;
    },
    minPage() {
      if (this.currentPage >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.currentPage;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1;
        }
        return this.currentPage - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.currentPage >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.currentPage;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.pagesToDisplay;
      }
    },
  },
  data() {
    return {
      defaultPagesToDisplay: 5,
      perPage: 20,
      selectOptions: [10, 15, 20, 50],
    };
  },
  methods: {
    range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    changePage(item) {
      this.$emit("pagechanged", item);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("pagechanged", this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("pagechanged", this.currentPage - 1);
      }
    },
    firstPage() {
      if (this.currentPage > 1) {
        this.$emit("pagechanged", 1);
      }
    },
    lastPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("pagechanged", this.totalPages);
      }
    },
    changeRowsPerPage() {
      this.$emit("changerowsperpage", this.perPage);
    },
  },
  watch: {
    perPage() {
      this.$emit("input", 1);
    },
    total() {
      this.$emit("input", 1);
    },
  },
};
</script>
<style>
.disable-a {
  pointer-events: none;
  cursor: default;
}
</style>
