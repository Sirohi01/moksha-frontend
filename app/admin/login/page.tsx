"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import { ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";

// Simple demo credentials (in real app, this would be backend authentication)
const DEMO_CREDENTIALS = {
  email: "admin@moksha-seva.org",
  password: "admin123"
};

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple credential check (in real app, this would be API call)
    if (form.email === DEMO_CREDENTIALS.email && form.password === DEMO_CREDENTIALS.password) {
      // Set admin session (in real app, would use proper JWT/session management)
      localStorage.setItem("moksha_admin_session", "true");
      localStorage.setItem("moksha_admin_user", JSON.stringify({
        email: form.email,
        name: "Admin User",
        role: "super_admin",
        loginTime: new Date().toISOString()
      }));
      
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Container size="sm">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Moksha Seva Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Access Moksha Seva Admin Dashboard</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">Demo Credentials</h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p><strong>Email:</strong> admin@moksha-seva.org</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                label="Email Address"
                type="email"
                placeholder="admin@moksha-seva.org"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!form.email || !form.password}
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure admin access • Session timeout: 24 hours</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Having trouble? Contact IT support at{" "}
              <a href="mailto:it@moksha-seva.org" className="text-orange-600 hover:underline">
                it@moksha-seva.org
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}