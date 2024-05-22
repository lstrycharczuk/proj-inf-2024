import React, { useState } from "react";
import "../css/Expense.css";
import { Link } from "react-router-dom";

const addUser = async (form) => {
  try {
    const existingUserResponse = await fetch(
      `http://localhost:3000/api/users?email=${form.email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const auth = (Math.floor(Math.random() * 1000000) + 1)
      .toString()
      .padStart(6, "0");

    if (existingUserResponse.ok) {
      const user = await existingUserResponse.json();
      if (user.password === form.password) {
        const updateResponse = await fetch(`http://localhost:3000/api/users/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auth }),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update auth code for existing user.");
        }

        // Send the new auth code via email
        const mailResp = await fetch("http://localhost:3000/api/sendCodeMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, auth }),
        });

        return mailResp.json();
      } else {
        throw new Error("User already exists with a different password.");
      }
    }

    const createUserResp = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, auth }),
    });

    if (!createUserResp.ok) {
      throw new Error("Failed to create new user.");
    }

    const newUser = await createUserResp.json();

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
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await addUser(formState);
      console.log("User added or updated successfully!");

      const encodedEmail = btoa(formState.email);

      if (response.message === "User already exists.") {
        window.location.href = `/codePage/${encodedEmail}`;
      } else {
        setFormState({
          email: "",
          password: "",
        });
        window.location.href = `/codePage/${encodedEmail}`;
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
      <Link to={`/codePage/${btoa(formState.email)}`}>Go to Code Page</Link>
    </div>
  );
};

export default LoginPage;
