<template>
  <div>
    <table class="table table-striped table-custom">
      <thead>
        <!-- header -->
        <tr class="text-white">
          <th class="bg-primary-line">
            <slot name="selectAll">
              <!-- Khởi tạo nút checkAll -->
            </slot>
          </th>
          <th class="bg-primary-line" v-for="(item, index) in header" :key="index">{{item.text}}</th>
        </tr>
        <!-- end header -->

        <!-- header filter -->
        <tr>
          <slot name="filterHeader"></slot>
        </tr>
        <!-- end headerFiler -->
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataList" :key="index">
          <td class="text-center">
            <slot name="checkBox" :item="item"></slot>
          </td>
          <td class="text-center">
            <slot name="actionButton"></slot>
          </td>
          <slot name="item" :item="item" :index="index"></slot>
        </tr>
        <tr>
            <slot name="noRecord"></slot>
        </tr>
      </tbody>
      <thead>
        <tr>
          <slot name="filterBottom"></slot>
        </tr>
      </thead>
    </table>

  </div>
</template>
<script>
//  import NavbarToggleButton from "./NavbarToggleButton";

export default {
  name: "data-table-custom",
  components: {},
  props: {
    header: {
      type: Array,
      default: () => [],
      description: "Header"
    },
    dataList: {
      type: Array,
      default: () => [],
      description: "Data"
    }
  },
  data() {
    return {
      // header: [
      //   {
      //     id: 1,
      //     text: "header 1"
      //   },
      //   {
      //     id: 2,
      //     text: "header 2"
      //   },
      //   {
      //     id: 3,
      //     text: "header 3"
      //   },
      //   {
      //     id: 4,
      //     text: "header 4"
      //   },
      //   {
      //     id: 5,
      //     text: "header 5"
      //   }
      // ]
    };
  }
};
</script>