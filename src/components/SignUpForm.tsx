import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import User from "../api/User";
import { signup } from "../redux/thunks/user";
import { signin } from "../redux/thunks/auth";
import { validate, validatePw } from "../utils/validate";
import { ValidateFn } from "../types";
import Button from "./Button";
import Spinner from "./Spinner";
import styles from "../essets/scss/SignUpForm.module.scss";

interface InitialState {
  [key: string]: string;
}

const initialState: InitialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

function SignUpForm() {
  const { loading } = useAppSelector((state) => state.user);
  const [values, setValues] = useState(initialState);
  const [cautions, setCautions] = useState(initialState);
  const [focus, setFocus] = useState(initialState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleValidate = async (
    validateFn: ValidateFn,
    ...options: [string, string]
  ) => {
    const [key, value] = options;
    let nextCaution = { ...validateFn(key, value) };
    if ((key === "name" || key === "email") && !nextCaution[key]) {
      const caution = await User.validate({ [key]: value });
      nextCaution = { [key]: caution };
    }
    setCautions((prev) => ({
      ...prev,
      ...nextCaution,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const invalidKey = Object.keys(cautions).find((key) => {
      return !(cautions[key] === "" && values[key]);
    });
    if (!invalidKey) {
      const { name, email, password } = values;
      await dispatch(signup({ name, email, password }));
      await dispatch(signin({ email, password }));
      return navigate("/");
    }
    if (invalidKey !== "password2") {
      handleValidate(validate, invalidKey, values[invalidKey]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    setFocus((prev) => ({
      ...prev,
      [e.target.id]: "focus",
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id !== "password2") {
      handleValidate(validate, id, value);
    }
    if (!value) {
      setFocus((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  useEffect(() => {
    handleValidate(validatePw, values.password, values.password2);
  }, [values.password, values.password2]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div
        className={classNames(
          styles.inputContainer,
          cautions.name && styles.invalid,
          focus.name && styles.focused
        )}
      >
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <p className={styles.cautions}>{cautions.name}</p>
      </div>
      <div
        className={classNames(
          styles.inputContainer,
          cautions.email && styles.invalid,
          focus.email && styles.focused
        )}
      >
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <p className={styles.cautions}>{cautions.email}</p>
      </div>
      <div
        className={classNames(
          styles.inputContainer,
          cautions.password && styles.invalid,
          focus.password && styles.focused
        )}
      >
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <p className={styles.cautions}>{cautions.password}</p>
      </div>
      <div
        className={classNames(
          styles.inputContainer,
          cautions.password2 && styles.invalid,
          focus.password2 && styles.focused
        )}
      >
        <label htmlFor="password2">비밀번호 확인</label>
        <input
          id="password2"
          type="password"
          value={values.password2}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <p className={styles.cautions}>{cautions.password2}</p>
      </div>
      <Button type="submit" disabled={loading} className={styles.btn}>
        {loading ? <Spinner size={27} variant="inverse" /> : "회원 가입"}
      </Button>
    </form>
  );
}

export default SignUpForm;
