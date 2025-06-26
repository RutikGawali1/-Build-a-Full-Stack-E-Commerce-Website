import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(credentials.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                alert(text || "Login failed. Please try again.");
                return;
            }

            const json = await response.json();

            if (json.token && json.user) {
                localStorage.setItem('token', json.token);
                localStorage.setItem('user', JSON.stringify(json.user));

                if (json.user.isAdmin) {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (err) {
            alert("Something went wrong. Please try again later.");
        }
    };


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div id="loginPage" className="login-container">
            <div className="logo-container">
                {/* Replace the src with a valid local or external image URL */}
                <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
            </div>
            <form onSubmit={handleSubmit} id="loginForm" data-action="login">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Enter valid email" value={credentials.email} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={credentials.password} onChange={onChange} autoComplete="current-password" required minLength={8} />
                </div>
                <button type="submit" className="btn btn-primary w-100" data-callback="onSubmit" data-action="login" > Login </button>
                {/* <button type="submit" className="g-recaptcha btn btn-primary w-100" data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} data-callback="onSubmit" data-action="login" > Login </button> */}
                <div className="text-center mt-3">
                    <Link to="/forgotPassword" className="text-decoration-none"> Forgot Password? </Link>
                </div>
            </form>
            <hr />
            {/* <button id="googleSignInButton">Continue with Google</button> */}
            <div className="text-center mt-3">
                <Link to="/signup" className="text-decoration-none"> Create an account </Link>
            </div>
        </div>
    );
}   