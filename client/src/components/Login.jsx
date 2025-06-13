import React, { useState } from "react";
import axios from "axios";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChange = (event) => {
    let email = event.currentTarget.value;
    setEmail(email);
  };

  const passwordChange = (event) => {
    let password = event.currentTarget.value;
    setPassword(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post(`/api/login`, {
        email: email,
        password: password,
      });
      const data = result.data;
      const token = data["token"];
      console.log(data);
      console.log(token);
      if (token) props.saveToken(token);
      return result.data;
    } catch (error) {
      console.log({ error: error.message });
      return { error: error.message };
    }
  };

  return (
    <div className="loginDiv">
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
          placeholder={"password"}
        />
        <input type="submit" value="Log In" className="loginSubmit" />
      </form>
    </div>
  );
}
