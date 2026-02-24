import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router-dom';
import router from './router';
import {AuthProvider} from './contexts/AuthContext';
import {GoogleOAuthProvider} from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <AuthProvider>
                    <RouterProvider router={router}/>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
