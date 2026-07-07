import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setFormData({
        email: "",
        password: "",
      });

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;