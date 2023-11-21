import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/use-form";
import { useHttp } from "../../shared/hooks/use-http";

import { authContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/FormElements/Input";
import ErrorMessage from "../../shared/components/UI/ErrorMessage/ErrorMessage";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useContext(authContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { sendRequest, setError, isLoading, error } = useHttp();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (error) {
      setError("");
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const loginHandler = (responseData) => {
    login(responseData, undefined);
    navigate("/", { replace: true });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const variables = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };

    let requestBody;
    try {
      if (!isLoginMode) {
        requestBody = {
          query: `
            mutation CreateUser($email: String!, $password: String!) {
              createUser(userInput: {
                  email: $email,
                  password: $password
                }) {
                  userId
                  token
                  tokenExpiration
              }
            }
          `,
          variables: variables,
        };
      } else {
        requestBody = {
          query: `
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
              }
            }
          `,
          variables: variables,
        };
      }
      const responseData = await sendRequest(JSON.stringify(requestBody));
      loginHandler(responseData);
    } catch (err) {}
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      {!isLoading && error && <ErrorMessage error={error} />}
      <h1>{isLoginMode ? "Login" : "Signup"}</h1>
      <Input
        id="email"
        type="email"
        label="E-Mail"
        element="input"
        placeholder="Enter your email"
        errorText="Please enter a valid email."
        onInput={inputHandler}
        validators={[VALIDATOR_EMAIL()]}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        element="input"
        placeholder="Enter your password"
        errorText="Your password should be at least 6 characters."
        onInput={inputHandler}
        validators={[VALIDATOR_MINLENGTH(6)]}
      />
      <div className="form-actions">
        <button type="submit" disabled={!formState.isValid || isLoading}>
          Submit
        </button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {!isLoginMode ? "Login" : "Signup"}
        </button>
      </div>
    </form>
  );
};

export default Auth;
