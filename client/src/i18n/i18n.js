import Vue from "vue";
import VueI18n from "vue-i18n";
import enMessage from "./en.json";

Vue.use(VueI18n);

const messages = {
  en: enMessage,
};
var lang = localStorage.getItem("lang");
if (lang == null || lang == undefined) {
  lang = "en";
}

const i18n = new VueI18n({
  locale: lang,
  messages,
  fallbackLocale: lang,
});

export default i18n;
