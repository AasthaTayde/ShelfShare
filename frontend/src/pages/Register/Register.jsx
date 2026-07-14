import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/authService";
import toast from "react-hot-toast";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone:"",
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

      await signupUser(formData);

      toast.success("Registration Successful!");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Registration Failed"
      );

    }

  };

  return (

    <div className="register-container">

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >

        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
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
          Register
        </button>

        <p>

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Register;