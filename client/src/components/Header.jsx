import React from "react";

export default function Header({ onLogout, token }) {
  return (
    <header id="header">
      <div class="logoNav">
        <h1 class="title">ToDo</h1>
        {token && <button className="logout" onClick={onLogout}>Logout</button>}
      </div>
    </header>
  );
}
