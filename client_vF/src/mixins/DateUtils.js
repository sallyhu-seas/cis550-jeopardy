export default {
  data() {
    return {
      dateFormat: "d/m/Y",
    };
  },
  methods: {
    getCurrentTime() {
      var today = new Date();
      var year = today.getFullYear();
      var month =
        (today.getMonth() + 1).toString().length == 1
          ? "0" + (today.getMonth() + 1)
          : (today.getMonth() + 1).toString();
      var date =
        today.getDate().toString().length == 1
          ? "0" + today.getDate()
          : today.getDate().toString();
      var hours =
        today.getHours().toString().length == 1
          ? "0" + today.getHours()
          : today.getHours().toString();
      var minutes =
        today.getMinutes().toString().length == 1
          ? "0" + today.getMinutes()
          : today.getMinutes().toString();
      var seconds =
        today.getSeconds().toString().length == 1
          ? "0" + today.getSeconds()
          : today.getSeconds().toString();

      return year + month + date + hours + minutes + seconds;
    },
    convertDateToString(date) {
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      if (day.toString().length == 1) day = "0" + day;
      if (month.toString().length == 1) month = "0" + month;

      return month + "/" + day + "/" + year;
    },

    convertDateDbToDateClient(str) {
      if (str) {
        var datetime = str.split("T");

        var date = datetime[0].split("-");
        return date[1] + "/" + date[2] + "/" + date[0];
      }
    },

    convertDateClientToDateDb(str) {
      if (str) {
        var date = str.split("/");
        return date[1] + "-" + date[2] + "-" + date[0];
      }

      return null;
    },
  },
};
