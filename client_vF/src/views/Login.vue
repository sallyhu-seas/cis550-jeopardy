<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7" v-if="loginForm">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form>
            <base-input
              class="input-group-alternative mb-3"
              :placeholder="$t('login.username')"
              addon-left-icon="ni ni-single-02"
              v-model="username"
              :valid="errorsLogin.username.isValid"
              :error="errorsLogin.username.errorMessage"
            ></base-input>
            <base-input
              class="input-group-alternative"
              :placeholder="$t('login.password')"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="password"
              :valid="errorsLogin.password.isValid"
              :error="errorsLogin.password.errorMessage"
            ></base-input>
            <br />
            <div class="text-center">
              <base-button
                @click="login()"
                type="primary"
                class="my-2 w-100 rounded-0"
              >
                {{ $t("login.login") }}
              </base-button>
            </div>
            <div class="col-md-12 text-right">
              <a
                href="javascript:void(0);"
                slot="brand"
                class="font-italic text-primary"
                @click="showRegisterForm()"
              >
                <small>Register</small>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-lg-5 col-md-7" v-if="registerForm">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form>
            <base-input
              class="input-group-alternative mb-3"
              :placeholder="$t('login.username')"
              addon-left-icon="ni ni-single-02"
              v-model="usernameRegister"
              :valid="errorsRegister.username.isValid"
              :error="errorsRegister.username.errorMessage"
            ></base-input>
            <base-input
              class="input-group-alternative mb-3"
              :placeholder="$t('login.password')"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="passwordRegister"
              :valid="errorsRegister.password.isValid"
              :error="errorsRegister.password.errorMessage"
            ></base-input>
            <base-input
              class="input-group-alternative"
              :placeholder="$t('Confirm password *')"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="confirmPasswordRegister"
              :valid="errorsRegister.confirmPassword.isValid"
              :error="errorsRegister.confirmPassword.errorMessage"
            ></base-input>
            <br />
            <div class="text-center">
              <base-button
                @click="register()"
                type="primary"
                class="my-2 w-100 rounded-0"
              >
                Register
              </base-button>
            </div>
            <div class="col-md-12 text-right">
              <a
                href="javascript:void(0);"
                slot="brand"
                class="font-italic text-primary"
                @click="showLoginForm()"
              >
                <small>Return login</small>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseComponent from "../mixins/BaseComponent.js";
import ValidatorUtils from "../mixins/ValidatorUtils.js";
import AuthService from "../services/AuthService";

export default {
  name: "login",
  mixins: [BaseComponent, ValidatorUtils],
  data() {
    return {
      //Form
      loginForm: true,
      registerForm: false,

      username: null,
      password: null,
      errorsLogin: {
        username: {},
        password: {},
      },

      usernameRegister: null,
      passwordRegister: null,
      confirmPasswordRegister: null,

      errorsRegister: {
        username: {},
        password: {},
        confirmPassword: {},
      },
    };
  },
  created() {
    var username = localStorage.getItem("username");
    if (username) {
      this.$router.push("/dashboard");
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    showLoginForm() {
      this.removeErrors(this.errorsLogin);
      this.username = null;
      this.password = null;
      this.usernameRegister = null;
      this.passwordRegister = null;
      this.confirmPasswordRegister = null;
      this.loginForm = true;
      this.registerForm = false;
    },

    showRegisterForm() {
      this.removeErrors(this.errorsRegister);
      this.username = null;
      this.password = null;
      this.usernameRegister = null;
      this.passwordRegister = null;
      this.confirmPasswordRegister = null;
      this.registerForm = true;
      this.loginForm = false;
    },

    // ------------------------------------- NORMAL LOGIN --------------------------------------------//
    validateFormLogin() {
      this.validateUsername();
      this.validatePassword();

      return !this.hasErrors(this.errorsLogin);
    },

    validateUsername() {
      if (this.isEmpty(this.username)) {
        this.addError(
          "username",
          false,
          this.$i18n.t("login.alert_username"),
          this.errorsLogin
        );
      }
    },

    validatePassword() {
      if (this.isEmpty(this.password)) {
        this.addError(
          "password",
          false,
          this.$i18n.t("login.alert_password"),
          this.errorsLogin
        );
      }
    },

    login() {
      if (!this.validateFormLogin()) {
        return;
      }

      let body = {
        username: this.username,
        password: this.password,
      };

      this.showLoading();
      AuthService.login(body)
        .then((response) => {
          if (response.data.status == 1) {
            localStorage.setItem("username", response.data.username);
            this.$router.push("/dashboard");
          } else {
            this.$notify({
              type: "danger",
              message: response.data.message,
            });
          }
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            message: this.$i18n.t("common.error_connection"),
          });
        })
        .finally(() => {
          this.hideLoading();
        });
    },
    // ---------------------------------- END NORMAL LOGIN --------------------------------------------//

    // ---------------------------------- REGISTER --------------------------------------------//
    validateFormRegister() {
      this.validateUsernameRegister();
      this.validatePasswordRegister();
      this.validateConfirmPasswordRegister();

      return !this.hasErrors(this.errorsRegister);
    },

    validateUsernameRegister() {
      if (this.isEmpty(this.usernameRegister)) {
        this.addError(
          "username",
          false,
          this.$i18n.t("login.alert_username"),
          this.errorsRegister
        );
      }
    },

    validatePasswordRegister() {
      if (this.isEmpty(this.passwordRegister)) {
        this.addError(
          "password",
          false,
          this.$i18n.t("login.alert_password"),
          this.errorsRegister
        );
      }
    },

    validateConfirmPasswordRegister() {
      if (this.isEmpty(this.confirmPasswordRegister)) {
        this.addError(
          "confirmPassword",
          false,
          "Confirm password cannot be empty",
          this.errorsRegister
        );
      }
      if (this.confirmPasswordRegister != this.passwordRegister) {
        this.addError(
          "confirmPassword",
          false,
          "Password does not match",
          this.errorsRegister
        );
      }
    },

    register() {
      if (!this.validateFormRegister()) {
        return;
      }

      let body = {
        username: this.usernameRegister,
        password: this.passwordRegister,
      };

      this.showLoading();
      AuthService.register(body)
        .then((response) => {
          if (response) {
            if (response.data.status == 1) {
              this.$notify({
                type: "success",
                message: response.data.message,
              });
              this.showLoginForm();
            } else {
              this.$notify({
                type: "danger",
                message: response.data.message,
              });
            }
          }
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            message: this.$i18n.t("common.error_connection"),
          });
        })
        .finally(() => {
          this.hideLoading();
        });
    },
  },
  watch: {
    username: {
      handler() {
        this.removeError("username", this.errorsLogin);
        this.validateUsername();
      },
    },
    password: {
      handler() {
        this.removeError("password", this.errorsLogin);
        this.validatePassword();
      },
    },
    usernameRegister: {
      handler() {
        this.removeError("username", this.errorsRegister);
        this.validateUsernameRegister();
      },
    },
    passwordRegister: {
      handler() {
        this.removeError("password", this.errorsRegister);
        this.validatePasswordRegister();
      },
    },
    confirmPasswordRegister: {
      handler() {
        this.removeError("confirmPassword", this.errorsRegister);
        this.validateConfirmPasswordRegister();
      },
    },
  },
};
</script>
<style></style>
