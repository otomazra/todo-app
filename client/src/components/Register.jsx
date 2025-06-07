import React, { useState } from "react";
import axios from "axios";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailChange = (event) => {
    setEmail(event.currentTarget.value);
  };

  const passwordChange = (event) => {
    setPassword(event.currentTarget.value);
  };

  const confirmChange = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post(`${props.URL}/register`, {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      const data = await result.data;
      const token = data.token;
      console.log(data);
      console.log(token);
      props.saveToken(token);
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          className="email"
          onChange={emailChange}
          value={email}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className="password"
          onChange={passwordChange}
          value={password}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          className="confirmPassword"
          onChange={confirmChange}
          value={confirmPassword}
          placeholder="Confirm password"
        />
        <input type="submit" value="Sign Up" className="loginSubmit" />
      </form>
    </div>
  );
}
