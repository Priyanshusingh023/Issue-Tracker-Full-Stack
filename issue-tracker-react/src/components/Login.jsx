import { useState } from "react";

function Login({ setLoggedIn, setShowLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            setLoggedIn(true);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

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
                    className="w-full px-4 py-2 mb-6 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mb-4 shadow-lg"
                >
                    Login
                </button>

                <p
                    onClick={() => setShowLogin(false)}
                    className="text-center text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                >
                    New user? Create account
                </p>
            </div>
        </div>
    );
}
export default Login;