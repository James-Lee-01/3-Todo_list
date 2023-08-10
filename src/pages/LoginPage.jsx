import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/auth';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //檢查字串是否存在
  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }

    const { success, authToken } = await login({
      username, password
    });

    if (success) {
      //set auth token in localStorage
      localStorage.setItem('authToken', authToken);
      //login success toast
      Swal.fire({
        position: "top",
        title: "登入成功！",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    //login failed toast
    Swal.fire({
      position: "top",
      title: "登入失敗！",
      icon: "error",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password" //密碼的type更改成password以便隱藏密碼
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>

      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
