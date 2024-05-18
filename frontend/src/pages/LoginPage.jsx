import React, { useState } from "react";
import "../css/Expense.css";
import { Link } from "react-router-dom";

const addUser = async (form) => {
  try {
    // Check if the email already exists
    const existingUser = await fetch(`http://localhost:3000/api/users?email=${form.email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (existingUser.ok) {
      const user = await existingUser.json();
      // If the user exists, check if the password matches
      if (user.password === form.password) {
        console.log("User already exists and password matches.");
        return { message: "User already exists." };
      } else {
        throw new Error("User already exists with a different password.");
      }
    }

    // Generate code
    const auth = (Math.floor(Math.random() * 1000000) + 1).toString().padStart(6, "0");

    // Add new user
    const resp = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, auth }),
    });
    const newUser = await resp.json();

    // Send confirmation code to email
    const mailResp = await fetch("http://localhost:3000/api/sendCodeMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, auth }),
    });

    return mailResp.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const LoginPage = () => {
  const [authCode, setAuthCode] = useState("");
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await addUser(formState);
      console.log("User added successfully!");

      if (response.message === "User already exists.") {
        // Redirect to code page if user already exists
        window.location.href = `/codePage/${formState.email}`;
      } else {
        setFormState({
          email: "",
          password: "",
        });
        // Redirect to code page after successful registration
        window.location.href = `/codePage/${formState.email}`;
      }
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
        <button type="submit">Send</button>
      </form>
      <Link to={{ pathname: "/codePage/:email", state: { email: formState.email } }}>
        Go to Code Page
      </Link>
    </div>
  );
};

export default LoginPage;