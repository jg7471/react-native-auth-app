import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AuthForm from './AuthForm';
import FlatButton from '../ui/FlatButton';
import { Colors } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';

const AuthContent = ({ onAuthenticate, isLogin }) => {
  //const [isLogin, setIsLogin] = useState(true); //true 로그인 페이지 /false 비로그인 : true 지우고 부모에서 isLogin 받기
  const navigation = useNavigation(); //react useNavigate

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    //유효성 검증
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
  });

  const submitHandler = (credentials) => {
    let { email, name, password, confirmPassword } = credentials;
    console.log('submitHandler email: ', email);

    email = email.trim();
    password = password.trim();
    const nameRegex = /^[가-힣]{2,5}$/;

    //실제로 적용하실 때는 각 입력 창마다 정규표현식으로 빡시게 검사하세요
    const emailIsValid = email.includes('@');
    const nameIsValid = nameRegex.test(name);
    const passwordIsValid = password.length > 6;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!nameIsValid || !passwordsAreEqual)) // isLogin 값에 따라 검증할 것과 안할 것 나눔
    ) {
      Alert.alert(
        '유효하지 않은 입력값이 있습니다. 확인 후 다시 입력해주세요.',
      ); //모바일 전용
      setCredentialsInvalid({
        email: !emailIsValid,
        name: !nameIsValid,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return; //리턴 이유 @@@@@
    }
    // 회원가입 or 로그인 처리
    onAuthenticate({ email, password, name });
  };

  const switchAuthModeHandler = () => {
    if (isLogin) {
      //로그인 상태 T/F 여부
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={StyleSheet.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmt={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? '회원가입 하기' : '로그인 화면 이동하기'}
        </FlatButton>
      </View>
    </View>
  );
};

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
});
