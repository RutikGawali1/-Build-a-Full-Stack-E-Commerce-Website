import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const contentType = response.headers.get("content-type");
            let json;

            if (contentType && contentType.includes("application/json")) {
                json = await response.json();
            } else {
                const text = await response.text();
                alert(`Unexpected response from server:\n${text}`);
                return;
            }

            if (response.ok && json._id) {
                alert("Account created successfully!");
                navigate('/login');
            } else {
                const message = typeof json === "string" ? json : json.message || "Signup failed. Please try again.";
                alert(`${message}`);
            }
        } catch (err) {
            alert("Something went wrong. Please try again later.");
        }
    };


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div id="createAccountPage" className="create-account-container">
            <div className="logo-container">
                <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
            </div>
            <h3 className="text-center mb-4">Create an Account</h3>
            <form onSubmit={handleSubmit} id="signupForm" data-action="signup">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="name"
                        placeholder="Enter your name"
                        value={credentials.name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="createEmail" className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="createEmail"
                        name="email"
                        placeholder="Enter valid email"
                        value={credentials.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="createPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="createPassword"
                        name="password"
                        placeholder="Password must be at least 8 characters long."
                        value={credentials.password}
                        onChange={onChange}
                        minLength={8}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                <hr />
                <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">Back to login</Link>
                </div>
            </form>
        </div>
    );
}