"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

// Simple demo credentials (in real app, this would be backend authentication)
const DEMO_CREDENTIALS = {
  email: "officialmanishsirohi.01@gmail.com",
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
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-saffron-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-saffron-400 rounded-full blur-2xl"></div>
      </div>

      <Container size="sm" className="relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header with Enhanced Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-white rounded-full shadow-lg p-3 border-4 border-saffron-100">
                <Image
                  src="/logo.png"
                  alt="Moksha Seva Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-saffron-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Moksha Seva
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Portal</h2>
            <p className="text-gray-600">Secure access to dashboard and management tools</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-2">Demo Access Credentials</h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span><strong>Email:</strong> admin@moksha-seva.org</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span><strong>Password:</strong> admin123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute left-3 top-11 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-saffron-500 focus:ring-saffron-500"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-11 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-saffron-500 focus:ring-saffron-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                loading={loading}
                disabled={!form.email || !form.password}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure SSL Connection • Auto-logout in 24 hours</span>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-sm text-gray-500">
              Need assistance? Contact our support team
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a 
                href="mailto:help@mokshasewa.org" 
                className="text-saffron-600 hover:text-saffron-700 font-medium hover:underline transition-colors"
              >
                help@mokshasewa.org
              </a>
              <span className="text-gray-300">|</span>
              <a 
                href="tel:+919773992516" 
                className="text-saffron-600 hover:text-saffron-700 font-medium hover:underline transition-colors"
              >
                +91 97739 92516
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}