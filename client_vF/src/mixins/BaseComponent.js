export default {
  name: "base-component",
  components: {},
  data() {
    return {
      dateFormat: "d/m/Y",

      //Permission
      actionsPermissions: [],

      //Paging
      currentPage: 1,
      totalRecords: 0,
      perPage: 20,
    };
  },
  methods: {
    //Permission
    checkPermission() {
      var ssid = this.$cookies.get("ssid");

      if (ssid == undefined || ssid == null) {
        this.$router.push("/login");
        return false;
      }
      var menus = JSON.parse(localStorage.getItem("menus"));
      var path = this.$route.path;
      var currentUrl = path.substring(1, this.length);

      for (let i = 0; i < menus.length; i++) {
        if (menus[i].url == currentUrl) {
          if (menus[i].actionList != undefined) {
            var actions = menus[i].actionList.split(",");
            this.actionsPermissions = actions;
          }
          break;
        }
      }

      if (this.actionsPermissions.length == 0) {
        this.$notify({
          type: "danger",
          message: this.$i18n.t("common.unauthorized"),
        });
        this.$router.push("/dashboard");
        return false;
      }

      return true;
    },

    isEmpty(str) {
      return str === null || str === "" || str === undefined;
    },

    convertListToString(elementVal) {
      var elements = elementVal.length > 0 ? "" : null;

      for (let i = 0; i < elementVal.length; i++) {
        if (i < elementVal.length - 1) elements += elementVal[i] + ",";
        else elements += elementVal[i];
      }

      return elements;
    },

    b64DecodeUnicode(str) {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    },

    stopPropagation(event) {
      event.stopPropagation();
    },

    formatNumber(num) {
      if (num) {
        num = Math.round(num * 100) / 100;
      }

      return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0;
    },

    showLoading() {
      this.$store.dispatch("setLoading", true);
    },

    hideLoading() {
      this.$store.dispatch("setLoading", false);
    },

    clearCache() {
      this.$cookies.remove("ssid");
      localStorage.removeItem("user_info");
      localStorage.removeItem("apis");
      localStorage.removeItem("theme");
      localStorage.removeItem("themeDemo");
      localStorage.removeItem("menus");
      localStorage.removeItem("rowsPerPage");
      this.$router.push("/login");
    },
  },
};
