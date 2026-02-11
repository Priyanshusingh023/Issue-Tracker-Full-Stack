import { useState } from "react";

function Register({ setLoggedIn, setShowLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        setError("");
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch("https://issue-tracker-full-stack.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
            } else {
                setError("Registration successful! Please login.");
                setShowLogin(true);
            }
        } catch (err) {
            setError("Error during registration: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

                {error && (
                    <p className="bg-red-600/30 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mb-4 shadow-lg"
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <p
                    onClick={() => setShowLogin(true)}
                    className="text-center text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                >
                    Already have an account? Login
                </p>
            </div>
        </div>
    );
}

export default Register;
