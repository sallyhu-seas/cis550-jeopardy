<template>
  <div class="header-custom">
    <div class="row m-0">
      <div class="col-md-6">
        <div class="title-caption p-0">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="col-md-6 btn-header-right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "base-header-body",
  props: {
    type: {
      type: String,
      default: "primary",
      description: "Header background type",
    },
    title: {
      type: String,
      description: "title header", // Tiêu đề của trang màn hình (nằm bên trái)
    },
  },
};
</script>
<style>
</style>
