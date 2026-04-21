import { useAuthStore } from "../../lib/store";
import { motion } from "motion/react";
import React, { useState } from "react";
import Logo from "../ui/Logo";
import { User } from "../../lib/types";
import { registerUser } from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const newErrors = [];

    if (pwd.length < 8) {
      newErrors.push("Minimum 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      newErrors.push("At least one uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      newErrors.push("At least one lowercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      newErrors.push("At least one number");
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      newErrors.push("At least one special character");
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: User = {
        userId: email,
        accessKey: password,
      };
      const response = await registerUser(user);
      toast.success(response.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response
          ? err.response.data.message
            ? err.response.data.message
            : err.response
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl"
      >
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center mx-auto mb-6">
            <Logo className="w-9 h-9" isColors={false} />
          </div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            FlopNop
          </h2>
          <p className="text-secondary mt-2">
            Register in to debug environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 px-1">
              Identity
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="operator@apex.sys"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 px-1">
              Access Key
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              required
              value={password}
              onChange={handleChange}
            />
          </div>
          {errors.length > 0 && (
            <ul className="text-[11px] text-red-500/60 list-disc ml-4 font-bold tracking-wide">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
          {errors.length === 0 && password && (
            <ul className="text-[11px] text-green-500/60 list-disc ml-4 font-bold tracking-wide">
              <li>Strong password</li>
            </ul>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold uppercase tracking-widest mt-2"
          >
            {loading ? "Validating..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
