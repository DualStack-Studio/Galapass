// src/components/RegisterForm.jsx
import React, { useState } from "react";

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    language: "es",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Registro</h2>
      <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
      <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
      <select name="language" value={formData.language} onChange={handleChange}>
        <option value="es">Español</option>
        <option value="en">Inglés</option>
        <option value="fr">Francés</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;
