import axios from "axios";

import {Fragment, memo, useCallback, useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {Link} from "react-router-dom";

import styles from "./Signup.module.scss";

import {ReactComponent as Logo} from "../../assets/svgs/full-logo.svg";

import useInput from "../../hooks/useInput";
import Header from "../../components/Layout/Header/Header";
import Content from "../../components/Layout/Content/Content";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Loading from "../../components/UI/Loading/Spinner";

import {toast} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import {validateEmail} from "../../functions/auth";
import {validatePassword} from "../../functions/auth";
import {validateProfileName} from "../../functions/auth";

const toastOptions = {
  // theme: "dark",
  theme: "colored",
};

const SignupPage = ({
  authLoading,
  editAuthConf,
  setAuthLoading,
  topBoxMessage,
  setTopBoxMessage,
}) => {
  // const {
  //   isAuth,
  //   authLoading,
  //   editAuthConf,
  //   setIsAuthLoading: setAuthLoading,
  // } = authctx;

  // const [topBoxMessage, setTopBoxMessage] = useState(null);

  const {
    value: emailValue,
    // isValid: isEmailValid,
    hasError: emailHasError,
    inputChangeHandler: emailInputChangeHanlder,
    inputBlurHandler: emailBlurChangeHandler,
    reset: resetEmailField,
  } = useInput(validateEmail);
  const {
    value: confirmemailValue,
    // isValid: isConfirmemailValid,
    hasError: confirmemailHasError,
    inputChangeHandler: confirmemailInputChangeHanlder,
    inputBlurHandler: confirmemailBlurChangeHandler,
    reset: resetConfirmemailField,
    comparedValue: isEmailAndConfirmemailSame,
  } = useInput(validateEmail, emailValue);

  const {
    value: passwordValue,
    // isValid: isPasswordValid,
    hasError: passwordHasError,
    inputChangeHandler: passwordInputChangeHanlder,
    inputBlurHandler: passwordBlurChangeHandler,
    reset: resetPasswordField,
  } = useInput(validatePassword);

  const {
    value: nameValue,
    // isValid: isNameValid,
    hasError: nameHasError,
    inputChangeHandler: nameInputChangeHanlder,
    inputBlurHandler: nameBlurChangeHandler,
    reset: resetNameField,
  } = useInput(validateProfileName);

  const [showUserPassword, setShowUserPassword] = useState(false);
  const toggleShowPassword = useCallback(
    () => setShowUserPassword(p => !p),
    [setShowUserPassword]
  );
  const [formHasError, setFormHasError] = useState(false);
  const [accountCreatedSuccessfully, setAccountCreatedSuccessfully] =
    useState(false);
  // const [authLoading, setAuthLoading] = useState(false);
  // const [formSubmissionError, setFormSubmissionError] = useState(null);

  useEffect(() => {
    setTopBoxMessage(null);

    document.body.classList.add("mg-b-2");

    return () => {
      document.body.classList.remove("mg-b-2");
    };
  }, []);

  useEffect(() => {
    setFormHasError(false);
    const email = validateEmail(emailValue);

    const confirmEmailVal = validateEmail(confirmemailValue);
    const confirmEmail =
      email && confirmEmailVal && emailValue === confirmemailValue;

    const password = validatePassword(passwordValue);

    const name = validateProfileName(nameValue);

    if (!email || !confirmEmail || !password || !name) {
      setFormHasError(true);
    }

    if (email && confirmEmail && password && name) {
      setFormHasError(false);
    }
  }, [emailValue, confirmemailValue, passwordValue, nameValue]);

  const signupFormSubmitHandler = async e => {
    e.preventDefault();

    setTopBoxMessage(null);
    try {
      if (!formHasError) {
        const formData = {
          email: emailValue,
          password: passwordValue,
          name: nameValue,
        };

        resetEmailField();
        resetConfirmemailField();
        resetPasswordField();
        resetNameField();

        setAuthLoading(true);
        setAccountCreatedSuccessfully(false);
        // await toast.promise(
        await axios.put("https://soundrex.onrender.com/auth/signup", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          ...formData,
          // data: JSON.stringify(formData),
        });
        // );

        setAuthLoading(false);

        editAuthConf({
          isAuth: false,
        });

        toast.success("Conta criada com sucesso.", toastOptions);

        setAccountCreatedSuccessfully(true);
        // return <Redirect to="/login" />;
      }
    } catch (error) {
      setAuthLoading(false);
      setAccountCreatedSuccessfully(false);

      editAuthConf({
        isAuth: false,
      });

      // console.log(error.response);
      setTopBoxMessage(
        error?.response?.data?.message ||
          "Oops! Algo deu errado. Tente novamente"
      );
      // toast.error(
      //   error?.message?.includes("Request failed with status code")
      //     ? "Oops! Something went wrong. Please try again"
      //     : error.message || "Oops! Something went wrong. Please try again",
      //   toastOptions
      // );
    }
  };

  return (
    <Fragment>
      <Header style={{backgroundColor: "transparent"}}>
        <Logo className={styles.logo} />
      </Header>
      <Content className="flex-column flex-center">
        {accountCreatedSuccessfully && <Redirect to="/login" />}
        <p className="centered display-small--bold white">
        Inscreva-se gratuitamente para começar a ouvir.
        </p>
        <form className="form mg-t-3" onSubmit={signupFormSubmitHandler}>
          {topBoxMessage && (
            <div className="error-msg-container mg-b-2">
              <p className="error-msg-text link-medium">{topBoxMessage}</p>
            </div>
          )}
          <Input
            required={true}
            id="email"
            label="Qual é o seu e-mail?"
            placeholder="Digite seu e-mail."
            type="email"
            control="input"
            emptyAndHasError={emailValue?.length === 0 && emailHasError}
            emptyAndHasErrorMessage={"Você precisa inserir seu e-mail."}
            hasError={emailHasError}
            hasErrorMessage={
              "Este e-mail é inválido. Certifique-se de que está escrito como examplo@email.com"
            }
            onChange={emailInputChangeHanlder}
            onBlur={emailBlurChangeHandler}
            value={emailValue}
            // valid={isEmailValid}
            // touched={this.state.signupForm["email"].touched}
          />

          <Input
            required={true}
            id="confirm-email"
            label="Confirme seu e-mail"
            placeholder="Digite seu e-mail novamente."
            type="email"
            control="input"
            emptyAndHasError={
              confirmemailValue?.length === 0 && confirmemailHasError
            }
            emptyAndHasErrorMessage={"Você precisa confirmar seu e-mail."}
            hasError={!isEmailAndConfirmemailSame}
            hasErrorMessage={"Os endereços de e-mail não coincidem."}
            onChange={confirmemailInputChangeHanlder}
            onBlur={confirmemailBlurChangeHandler}
            value={confirmemailValue}
            // valid={isConfirmemailValid}
            // touched={this.state.signupForm["email"].touched}
          />

          <Input
            required={true}
            id="password"
            label="Crie uma senha"
            placeholder="Digite uma senha."
            type="password"
            control="input"
            emptyAndHasError={passwordValue?.length === 0 && passwordHasError}
            emptyAndHasErrorMessage={"Você precisa digitar uma senha."}
            hasError={passwordHasError}
            hasErrorMessage={"Sua senha é muito curta."}
            onChange={passwordInputChangeHanlder}
            onBlur={passwordBlurChangeHandler}
            value={passwordValue}
            // valid={isPasswordValid}
            isPassword={true}
            showPassword={showUserPassword}
            handleShowPassword={toggleShowPassword}
            // touched={this.state.signupForm["email"].touched}
          />

          <Input
            required={true}
            id="name"
            label="Como deseja ser chamado?"
            placeholder="Insira um nome de perfil."
            bottomText="Isso aparecerá no seu perfil."
            type="text"
            control="input"
            emptyAndHasError={nameValue?.length === 0 && nameHasError}
            emptyAndHasErrorMessage={"Insira um nome para o seu perfil."}
            hasError={nameHasError}
            onChange={nameInputChangeHanlder}
            onBlur={nameBlurChangeHandler}
            value={nameValue}
            // valid={isNameValid}
            // touched={this.state.signupForm["email"].touched}
          />

          <Button
            disabled={Boolean(formHasError) || authLoading}
            className={`link-medium ${styles["form__button"]} ${styles}`}
            id="submit"
            name="submit"
            type="submit">
            Sign up {authLoading && <Loading className="mg-l-1" />}
          </Button>
        </form>
        <p className={`link-medium ${styles["signup_login"]}`}>
        Já tem uma conta?
          <Link to="/login" className={styles["signup_login-text"]}>
            Log in
          </Link>
          .
        </p>
        {/* <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </Content>
      {/* <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </Fragment>
  );
};

export default /*memo*/ SignupPage;
