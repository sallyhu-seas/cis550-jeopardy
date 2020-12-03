import axios from "axios";

export default (method, url, body, responseType) => {
    if (responseType == undefined) {
        responseType = "json";
    }

    let baseUrl = "http://localhost:8081"

    let headers = {
    }

    if (method == "GET") {
        return axios
            .create({
                baseURL: baseUrl,
                headers: headers,
                responseType: responseType,
            })
            .get(url, body)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return errorHandle(error);
            });
    }
    else if (method == "POST") {
        return axios
            .create({
                baseURL: baseUrl,
                headers: headers,
                responseType: responseType,
            })
            .post(url, body)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return errorHandle(error);
            });
    }
    else if (method == "PUT") {
        return axios
            .create({
                baseURL: baseUrl,
                headers: headers,
                responseType: responseType,
            })
            .put(url, body)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return errorHandle(error);
            });
    }
    else if (method == "DELETE") {
        return axios
            .create({
                baseURL: baseUrl,
                headers: headers,
                responseType: responseType,
            })
            .delete(url, { data: body })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return errorHandle(error);
            });
    }
};

function errorHandle(error) {
    if (error.response.status == 400) {
        return error;
    } else if (error.response.status == 401) {
        // localStorage.removeItem("user_info");
        // localStorage.removeItem("apis");
        // localStorage.removeItem("theme");
        // localStorage.removeItem("themeDemo");
        // localStorage.removeItem("menus");
        // localStorage.removeItem("rowsPerPage");
        window.location.href = "/login"
    } else if (error.response.status == 403) {
        window.location.href = "/dashboard"
    }
}
