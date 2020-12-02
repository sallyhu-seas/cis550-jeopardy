<template>
  <div class="form-control" style="height: 50px; width: 150px; display: flex">
    <div id="text-based-captcha" style="padding-left: 20px"></div>
    <div style="font-size: 20px; padding-left: 20px">
      <i
        @click="initCaptcha()"
        class="fa fa-sync-alt cursor-pointer"
        aria-hidden="true"
      ></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "text-based-captcha",
  data() {
    return {
      generatedCaptcha: "",
    };
  },
  mounted: function () {
    this.initCaptcha();
  },
  methods: {
    initCaptcha: function () {
      document.getElementById("text-based-captcha").innerHTML = "";
      var charsArray = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var lengthOtp = 6;
      var captcha = [];
      for (var i = 0; i < lengthOtp; i++) {
        // if (this.$root.shouldStopExecution(0)) break;
        //below code will not allow Repetition of Characters
        var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index]);
        else i--;
      }
      // this.$windowCP.exitedLoop(0);
      var canv = document.createElement("canvas");
      canv.id = "canvasCaptcha";
      canv.width = 120;
      canv.height = 50;
      var ctx = canv.getContext("2d");
      ctx.font = "25px Georgia";
      ctx.strokeText(captcha.join(""), 0, 30);
      //storing captcha so that can validate you can save it somewhere else according to your specific requirements
      this.generatedCaptcha = captcha.join("");
      document.getElementById("text-based-captcha").appendChild(canv); // adds the canvas to the body element
    },
  },
};
</script>
