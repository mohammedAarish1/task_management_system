"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");

  const passwordRules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created! Welcome to TaskFlow.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold text-text-primary tracking-tight">
          Create your account
        </h2>
        <p className="text-text-secondary text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-accent hover:text-accent-hover transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Full name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            className="input-base"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Email address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="input-base"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="input-base pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength indicators */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {passwordRules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-1.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      rule.met ? "bg-status-completed/20" : "bg-surface-3"
                    }`}
                  >
                    {rule.met && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4l1.5 1.5 3.5-3"
                          stroke="#10b981"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      rule.met ? "text-status-completed" : "text-text-tertiary"
                    }`}
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Create account
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-text-tertiary text-center">
        By creating an account, you agree to our{" "}
        <span className="text-text-secondary">Terms of Service</span>
      </p>
    </div>
  );
}
