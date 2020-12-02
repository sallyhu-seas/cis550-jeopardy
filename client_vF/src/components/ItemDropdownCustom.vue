<template>
  <component :is="tag" @click="handleClick" type="default" class="dropdown-item font-size-13">
    <slot name="icon" v-if="icon">
      <i class="icon-dropdown font-size-13" :class="icon"></i>
    </slot>
    <slot name="img" v-if="img">
      <img class="img-dropdown" :src="img"/>
    </slot>
    <span class="#" v-if="$slots.icon || icon && $slots.default">
      <span class="#" v-if="$slots.img || img && $slots.default"></span>
    </span>
    <span class="text-dropdown">
      <slot name="text">{{text}}</slot>
    </span>
  </component>
</template>
<script>
export default {
  name: "item-dropdown-custom",
  props: {
    tag: {
      type: String,
      default: "a",
      description: "Button tag (default -> button)"
    },
    type: {
      type: String,
      default: "",
      description: "Button type (e,g primary, danger etc)"
    },

    textColor: {
      type: String,
      default: "",
      description: "Button text color (e.g primary, danger etc)"
    },
    nativeType: {
      type: String,
      default: "button",
      description: "Button native type (e.g submit,button etc)"
    },
    icon: {
      type: String,
      default: "",
      description: "Button icon"
    },
    img: {
      type: String,
      default: "",
      description: "img"
    },
    text: {
      type: String,
      default: "",
      description: "Button text in case not provided via default slot"
    },
    outline: {
      type: Boolean,
      default: false,
      description: "Whether button style is outline"
    },
    rounded: {
      type: Boolean,
      default: false,
      description: "Whether button style is rounded"
    },
    iconOnly: {
      type: Boolean,
      default: false,
      description: "Whether button contains only an icon"
    },
    block: {
      type: Boolean,
      default: false,
      description: "Whether button is of block type"
    }
  },
  computed: {},
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    }
  }
};
</script>
<style>
</style>
