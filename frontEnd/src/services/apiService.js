import axiosHandler from "./axiosHandler";

export class ApiService {
  static axiosInstance = axiosHandler;

  //------------------------------------------------------------------------
  // ----------------- User requests --------------------------------------
  //------------------------------------------------------------------------
  static login(email, password) {
    let dataURL = "/api/v1/auth/login";
    return this.axiosInstance.post(dataURL, { email, password });
  }

  static createUser(email, password, firstName, lastName) {
    let dataURL = "/api/v1/users";
    return this.axiosInstance.post(dataURL, {
      email,
      password,
      firstName,
      lastName,
    });
  }
}
