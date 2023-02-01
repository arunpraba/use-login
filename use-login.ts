import React, { useState, useCallback, useEffect } from "react";
import firebase from "firebase";

type User = firebase.User | null;

type ConfirmationResult = firebase.auth.ConfirmationResult | null;

export interface UseLoginReturn {
  email: string;
  password: string;
  phone: string | null;
  setPhone: (phone: string | null) => void;
  errorMessage: string | null;
  handleLogin: () => void;
  handleSocialLogin: (provider: string) => void;
  handlePhoneLogin: (verificationCode: string) => void;
  signInWithPhoneNumber: (phone: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  loading: boolean;
  user: User;
  isLoggedIn: boolean;
}

const useLogin = (): UseLoginReturn => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    getUserData();
  }, []);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(async ({ user }) => {
            await localStorage.setItem("user", JSON.stringify(user));
            setLoading(false);
            setUser(user);
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
          });
      });
  }, [email, password]);

  const handleSocialLogin = useCallback(async (provider: string) => {
    setLoading(true);
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        let authProvider;
        switch (provider) {
          case "google":
            authProvider = new firebase.auth.GoogleAuthProvider();
            break;
          case "facebook":
            authProvider = new firebase.auth.FacebookAuthProvider();
            break;
          case "twitter":
            authProvider = new firebase.auth.TwitterAuthProvider();
            break;
        }
        return firebase
          .auth()
          .signInWithPopup(authProvider)
          .then(async ({ user }) => {
            await localStorage.setItem("user", JSON.stringify(user));
            setLoading(false);
            setUser(user);
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setLoading(false);
          });
      });
  }, []);

  const signInWithPhoneNumber = useCallback(
    async (phone) => {
      setLoading(true);
      firebase
        .auth()
        .signInWithPhoneNumber(phone)
        .then((confirmationResult) => {
          setConfirmationResult(confirmationResult);
          setLoading(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setLoading(false);
        });
    },
    [phone]
  );

  const handlePhoneLogin = useCallback(
    async (verificationCode) => {
      setLoading(true);
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          confirmationResult
            .confirm(verificationCode)
            .then(async ({ user }) => {
              await localStorage.setItem("user", JSON.stringify(user));
              setLoading(false);
              setUser(user);
            })
            .catch((error) => {
              setErrorMessage(error.message);
              setLoading(false);
            });
        });
    },
    [confirmationResult, phone]
  );

  return {
    email,
    password,
    phone,
    setPhone,
    errorMessage,
    handleLogin,
    handleSocialLogin,
    handlePhoneLogin,
    signInWithPhoneNumber,
    setEmail,
    setPassword,
    loading,
    user,
    isLoggedIn: !!user,
  };
};
