import React, {useContext} from "react";
import {MyContext} from "./MyContext.js";

// export default function Header({ onLogout, token }) {
export default function Header() {

  const token = useContext(MyContext).token;
  const logOut = useContext(MyContext).logOut;

  return (
    <header id="header">
      <div class="logoNav">
        <h1 class="title">ToDo</h1>
        {token && <button className="logout" onClick={logOut}>Logout</button>}
      </div>
    </header>
  );
}
