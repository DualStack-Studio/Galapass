// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al registrar");

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
};

export default RegisterPage;
