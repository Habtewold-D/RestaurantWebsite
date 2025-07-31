"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
      <form onSubmit={handleLogin} className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-orange-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-orange-700 drop-shadow">Welcome Back!</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
          required
        />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-rose-500 transition shadow-lg"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        <p className="mt-6 text-center text-sm text-gray-700">
          Don&apos;t have an account? <a href="/signup" className="text-orange-600 hover:underline font-semibold">Sign Up</a>
        </p>
      </form>
    </div>
  );
} 