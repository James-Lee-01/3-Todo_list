//和 /api/auth發送請求的操作，統一放在這支檔裡。
import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({ username, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    })

    const { authToken } = data
    if (authToken) {
      return { success: true, ...data }
    }
    return data
  } catch(error) {
    console.error("[Login Failed]:", error)
  }
};