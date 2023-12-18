import http from "./http-common";

const getCurrent = () => {
  return http.get<any>(
    "https://api.openweathermap.org/data/2.5/weather?lat=14.020100&lon=100.523567&units=metric&appid=b2e15b5d84536c4f6ef77cbe5d0e225a"
  );
};

const ThermostatServices = {
  getCurrent,
};

export default ThermostatServices;
