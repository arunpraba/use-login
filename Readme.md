# useLogin Hook
The useLogin hook provides authentication functionality for React applications. It supports email and password, social logins (Google, Facebook, Twitter), and phone number authentication with firebase. The hook also uses local storage to persist the user data so that the user stays logged in across different sessions.



Usage
You can use the useLogin hook in your React components like this:

```jsx

import React from "react";
import { useLogin } from "./use-login";

const LoginPage = () => {
  const {
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
    isLoggedIn
  } = useLogin();

  return (
    <div>
      {/* Render your login form */}
    </div>
  );
};

export default LoginPage;


```


## API
The hook returns an object with the following properties:

### email
Type: string

The email entered by the user.

### password
Type: string

The password entered by the user.

### phone
Type: string | null

The phone number entered by the user.

### setPhone
Type: (phone: string | null) => void

A function to set the phone number.

### errorMessage
Type: string | null

An error message returned by firebase.

### handleLogin
Type: () => Promise<void>

A function to handle email and password authentication.

### handleSocialLogin
Type: (provider: string) => Promise<void>

A function to handle social authentication. The provider argument should be one of google, facebook, or twitter.

### handlePhoneLogin
Type: (verificationCode: string) => Promise<void>

A function to handle phone number authentication. The verificationCode argument should be the verification code sent to the user's phone.

### signInWithPhoneNumber
Type: (phone: string) => Promise<void>

A function to initiate phone number authentication. The phone argument should be the user's phone number.

### setEmail
Type: (email: string) => void

A function to set the email.

### setPassword
Type: (password: string) => void

A function to set the password.

### loading
Type: boolean

Indicates whether the authentication process is in progress or not.

### user
Type: firebase.User | null

The authenticated user.

### isLoggedIn
Type: boolean

Indicates whether the user is in logged in or not.

<hr/>
Example
Here is an example of how to implement email and password authentication using the useLogin hook in a React component:

```jsx
import React from "react";
import { useLogin } from "./use-login";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    handleLogin,
    loading
  } = useLogin();

  return (
    <div>
      <form>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </form>
      {loading && <div>Loading...</div>}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default Login;

```

<hr/>

Here's an example of how you can use the hook to implement social login:

```jsx

import React, { useState } from "react";
import { useLogin } from "./use-login";

const SocialLogin = () => {
  const { handleSocialLogin, loading } = useLogin();

  const handleClick = (providerId: string) => {
    handleSocialLogin(providerId);
  };

  return (
    <>
      <button onClick={() => handleClick("google")} disabled={loading}>
        Login with Google
      </button>
      <button onClick={() => handleClick("facebook")} disabled={loading}>
        Login with Facebook
      </button>
      <button onClick={() => handleClick("twitter")} disabled={loading}>
        Login with Twitter
      </button>
    </>
  );
};

export default SocialLogin;

```
<hr/>

And here's an example of how you can use the hook to implement phone login:


```jsx
import React, { useState } from "react";
import { useLogin } from "./useLogin";

const PhoneLogin = () => {
  const {
    phone,
    setPhone,
    signInWithPhoneNumber,
    handlePhoneLogin,
    loading,
  } = useLogin();
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = () => {
    handlePhoneLogin(verificationCode);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone || ""}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={signInWithPhoneNumber} disabled={loading}>
        Send Verification Code
      </button>
      <input
        type="text"
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        Login
      </button>
    </>
  );
};

export default PhoneLogin;


```