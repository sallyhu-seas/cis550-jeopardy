<template>
    <div class="header-custom header-custom-sticky-top">
        <!-- xong bo classs container -->
        <div class="row m-0">
            <div class="col-md-6">
                <!-- title -->
                <div class="title-caption p-0">
                    <slot name="title">
                        <badge rounded v-if="title" class="caption">{{title}}</badge>
                    </slot>
                </div>
            </div>
            <div class="col-md-6 btn-header-right">
                <!-- button header -->
                <slot name="button-header-custom"></slot>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "base-header",
        props: {
            type: {
                type: String,
                default: "primary",
                description: "Header background type"
            },
            title: {
                type: String,
                description: "title header" // Tiêu đề của trang màn hình (nằm bên trái)
            }
        }
    };
</script>
<style>
</style>
