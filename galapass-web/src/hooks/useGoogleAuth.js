// src/hooks/useGoogleAuth.js
import { useAuth } from "../contexts/AuthContext";
import {BASE_URL} from "../config.js";

export const useGoogleAuth = (onClose) => {
    const { login } = useAuth();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Google login failed");

            const userRes = await fetch(`${BASE_URL}/auth/me`, {
                credentials: "include",
            });

            if (!userRes.ok) throw new Error("Fetching user data failed");

            const userData = await userRes.json();
            login(userData);
            onClose();
        } catch (err) {
            console.error("Google Auth Error:", err);
        }
    };

    return handleGoogleSuccess;
};
