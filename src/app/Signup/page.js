"use client";
import { useState } from "react";
import Link from "next/link"; // Use Next.js Link for navigation
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Signup failed. Please try again.");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push("/Login");
      }, 2000);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    // Note: setLoading(false) is not in a finally block here because we want the button to stay disabled on success while the redirect timer is active.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <FaUserPlus className="mx-auto text-primary text-4xl mb-2" />
          <h1 className="text-3xl font-bold text-foreground">
            Create an Account
          </h1>
          <p className="text-muted-foreground">Start organizing your life, one task at a time.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 bg-muted text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full p-3 bg-muted text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full p-3 bg-muted text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Display error or success messages */}
          {error && (
            <p className="text-sm text-center text-red-500 bg-red-500/10 p-2 rounded-md">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-center text-green-500 bg-green-500/10 p-2 rounded-md">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{" "}
          <Link href="/Login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}