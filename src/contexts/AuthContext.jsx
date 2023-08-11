import { createContext, useState, useEffect, useContext } from "react";
import { login, register, checkPermission } from 'api/auth';
import * as jwt from 'jsonwebtoken';
import { useLocation } from "react-router-dom";

const defaultAuthContext = {
  //使用者是否登入，預設為false
  isAuthenticated: false,
  //目前使用者相關資料
  currentMember: null,
  //註冊
  register: null,
  //登入
  login: null,
  //登出
  logout: null,
}

const AuthContext = createContext(defaultAuthContext)
//封裝一個 useAuth，用函式回傳 useContext(AuthContext)
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [payload, setPayload] =useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false)
        setPayload(null)
        return
      }
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true)
        const tempPayload = jwt.decode(authToken)
        setPayload(tempPayload)
      } else {
        setIsAuthenticated(false)
        setPayload(null)
      }
    };
    
    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },
        register: async (data)=>{
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken)
          if (tempPayload) {
            setPayload(tempPayload)
            setIsAuthenticated(true)
            localStorage.setItem('authToken', authToken)
          } else {
            setPayload(null)
            setIsAuthenticated(false)
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          })
          const tempPayload = jwt.decode(authToken)
          if (tempPayload) {
            setPayload(tempPayload)
            setIsAuthenticated(true)
            localStorage.setItem('authToken', authToken)
          } else {
            setPayload(null)
            setIsAuthenticated(false)
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken')
          setPayload(null)
          setIsAuthenticated(false)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}