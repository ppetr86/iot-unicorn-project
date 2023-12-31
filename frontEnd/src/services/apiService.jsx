import axiosHandler from "./axiosHandler";

export class ApiService {
  static axiosInstance = axiosHandler;

  //------------------------------------------------------------------------
  // ----------------- User requests ---------------------------------------
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

  static getSelfUser(userId, accessToken) {
    let dataURL = `/api/v1/users/${userId}`;
    return this.axiosInstance.get(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  //------------------------------------------------------------------------
  // ----------------- Terrarium requests ----------------------------------
  //------------------------------------------------------------------------
  static getAllTerrariums(userId, accessToken) {
    let dataURL = `/api/v1/users/${userId}/terrariums`;
    return this.axiosInstance.get(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static createNewTerrarium(terrariumData, userId, accessToken) {
    let dataURL = `/fe/v1/users/${userId}/terrariums`;
    return this.axiosInstance.post(dataURL, terrariumData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static deleteTerrarium(userId, terrariumId, accessToken) {
    let dataURL = `/fe/v1/users/${userId}/terrariums/${terrariumId}`;
    return this.axiosInstance.delete(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static editTerrarium(terrariumData, userId, terrariumId, accessToken) {
    let dataURL = `/fe/v1/users/${userId}/terrariums/${terrariumId}`;
    return this.axiosInstance.put(dataURL, terrariumData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static getIotToken(accessToken) {
    let dataURL = `/api/v1/auth/iot-token`;
    return this.axiosInstance.get(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  //-------------------------------------------------------------------------
  // ----------------- Animal Kind requests ---------------------------------
  //-------------------------------------------------------------------------
  static getAllAnimalKinds() {
    let dataURL = "api/v1/animalKinds";
    return this.axiosInstance.get(dataURL);
  }
}
