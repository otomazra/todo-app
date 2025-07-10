import React, { useState, useContext } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyContext } from "./MyContext";
// export default function Register(props) {

async function signUp({ email, password, confirmPassword }) {
  const result = await axios.post(`api/register`, {
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });
  return result.data;
}

export default function Register() {
  const { saveToken } = useContext(MyContext);

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data)=>{
      saveToken(data["token"]);
      queryClient.invalidateQueries({queryKey: ["todos"]});
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const email = event.target.elements.email.value;
    // const password = event.target.elements.password.value;
    // const confirmPassword = event.target.elements.confirmPassword.value;
    if(email && password && confirmPassword && password === confirmPassword){
      mutation.mutate({email, password, confirmPassword});
    }
    // try {
    //   const result = await axios.post(`api/register`, {
    //     email: email,
    //     password: password,
    //     confirmPassword: confirmPassword,
    //   });
    // const data = await result.data;
    // const token = data.token;
    // console.log(data);
    // console.log(token);
    // saveToken(token);
    // } catch (error) {
    // console.log({ error: error.message });
    // }
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
