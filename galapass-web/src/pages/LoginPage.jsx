import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      // --- THESE TWO LINES ARE REMOVED ---
      // const data = await response.json();
      // localStorage.setItem("token", data.token);
      // The browser now handles the cookie automatically.

      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="min-h-screen bg-[#fdfcf9] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-3xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/images/galapassLogo.png" alt="Galapass Logo" className="w-40 h-40" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-[#1f776c]">Welcome to Galapass</h2>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#52b6a2] placeholder:text-gray-400"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#52b6a2] placeholder:text-gray-400"
            />
            <button
                type="submit"
                className="w-full bg-[#2ca89c] hover:bg-[#22857b] text-white rounded-lg py-3 font-semibold transition duration-200"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
