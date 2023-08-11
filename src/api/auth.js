//和 /api/auth發送請求的操作，統一放在這支檔裡。
import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';

//login
export const login = async ({ username, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    })

    console.log(data)

    const { authToken } = data

    if (authToken) {
      return { success: true, ...data }
    }
    return data
  } catch(error) {
    console.error("[Login Failed]:", error)
  }
};

//register
export const register = async ({ username, email, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    });

    const { authToken } = data;

    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error('[Register Failed]:', error);
  }
};

//Check Permission
export const checkPermission = async (authToken) => {
  try {
    const response = await axios.get(`${authURL}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return response.data.success;
  } catch(error) {
    console.error('[Check Permission Failed]:', error)
  }
}