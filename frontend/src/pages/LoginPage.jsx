import React, { useState, useEffect } from "react";
import "../css/Expense.css";
import { Link } from "react-router-dom";

const addUser = async (form) => {
  const resp = await fetch("http://localhost:3000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return resp.json();
};

const LoginPage = () => {
  const [users, setUsers] = useState([]);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    setUsers(event.target.value)

    try {
      const resp = await addUser({
        ...formState,
      });
      console.log(resp);
      setExpenses([...users, resp]);
      setFormState({
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };


  const handleChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };


  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          value={formState.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={formState.password}
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit"><Link to={`/codePage`}>Login</Link></button>
       
        
      </form>
    </div>
  );




};
export default LoginPage;