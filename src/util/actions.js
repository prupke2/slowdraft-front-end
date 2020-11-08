import { getToken } from './requests';

export function fetchToken() {
  return async (dispatch) => {
    try {
      const { data: token } = await getToken();
    } catch (error) {
      console.error("error: " + error);
    }
  }
}
