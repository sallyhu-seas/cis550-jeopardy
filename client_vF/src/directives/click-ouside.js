export default {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  }
};



///out click

import Vue from 'vue'
Vue.directive('click-outside',{
  priority: 700,
  bind(){
    let seft = this
    this.event = function(event){
      seft.vm.$emit(seft.expression,event)
    }
    this.el.addEventListener('click', this.stopProp)
    document.body.addEventListener('click', this.event)
  },
  unbind(){
    this.el.removeEventListener('click', this.stopProp)
    document.body.removeEventListener('click',this.event)
  },
  stopProp(event) {event.stopPropagation() }
})