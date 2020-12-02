<template>
  <table class="table table-striped table-custom">
    <thead>
      <slot name="headers" :headers="headers"></slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index" :class="{ 'tr-hover' : item.checkbox}">
        <slot name="item" :item="item" :index="index"></slot>
      </tr>
      <slot name="multipleLevel"> </slot>
      <tr>
        <slot name="noRecord"></slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "base-table-custom",
  props: {
    headers: {
      type: Array,
      default: () => [],
      description: "Table columns",
    },
    items: {
      type: Array,
      default: () => [],
      description: "Table data",
    },
  },
  computed: {},
  methods: {},
};
</script>
<style></style>
