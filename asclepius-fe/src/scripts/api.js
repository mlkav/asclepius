// TODO: Silakan sesuaikan BASE URL dari endpoint Anda
const BASE_URL = 'http://localhost:3000' ||'https://backend-api-491995768296.asia-southeast2.run.app';

const ENDPOINT = {
  predict: `${BASE_URL}/predict`,
};

class PredictAPI {
  static async predict(data) {
    const response = await fetch(ENDPOINT.predict, {
      method: 'POST',
      body: data,
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }
}
