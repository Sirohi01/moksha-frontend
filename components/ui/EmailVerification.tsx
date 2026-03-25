"use client";

import React, { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { InputField } from "./FormFields";
import Button from "./Button";
import { Mail, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailVerificationProps {
    email: string;
    onVerified: (isVerified: boolean) => void;
    className?: string;
}

export default function EmailVerification({ email, onVerified, className }: EmailVerificationProps) {
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address first");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.sendOTP(email);
            if (response.success) {
                setIsOtpSent(true);
                setTimer(60); // 60 seconds cooldown
            } else {
                setError(response.message || "Failed to send OTP");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP code");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.verifyOTP(email, otp);
            if (response.success) {
                setIsVerified(true);
                onVerified(true);
            } else {
                setError(response.message || "Invalid OTP code");
            }
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    if (isVerified) {
        return (
            <div className={cn("flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700", className)}>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Email verified successfully</span>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4 p-4 bg-white border border-stone-200 rounded-xl shadow-sm", className)}>
            <div className="flex items-center gap-2 mb-2 text-stone-800">
                <ShieldCheck className="w-5 h-5 text-saffron-600" />
                <h3 className="font-semibold text-sm">Security Verification</h3>
            </div>

            {!isOtpSent ? (
                <div className="flex flex-col gap-3">
                    <p className="text-xs text-stone-500">We will send a 6-digit verification code to your email address.</p>
                    <Button
                        onClick={handleSendOtp}
                        disabled={loading || !email}
                        variant="primary"
                        className="w-full h-10 text-sm"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                        Send Verification Code
                    </Button>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="relative">
                        <InputField
                            label="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="000000"
                            className="text-center text-lg tracking-[0.5em] font-mono"
                            required
                        />
                        {timer > 0 && (
                            <span className="absolute right-0 top-0 text-[10px] text-stone-400 font-medium">
                                Resend in {timer}s
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length !== 6}
                            variant="primary"
                            className="w-full bg-stone-900 hover:bg-black text-white"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            Verify OTP
                        </Button>
                        
                        {timer === 0 && (
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="text-xs text-saffron-600 hover:text-saffron-700 underline font-medium"
                            >
                                Didn't receive code? Resend
                            </button>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 rounded text-red-600 text-[11px] animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
