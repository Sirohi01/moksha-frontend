"use client";

import React, { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { InputField } from "./FormFields";
import Button from "./Button";
import { MessageCircle, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileVerificationProps {
    mobile: string;
    onVerified: (isVerified: boolean) => void;
    className?: string;
}

export default function MobileVerification({ mobile, onVerified, className }: MobileVerificationProps) {
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
        // Simple numeric validation for mobile
        const cleanMobile = mobile.replace(/\D/g, "");
        if (!cleanMobile || cleanMobile.length < 10) {
            setError("Please enter a valid mobile number first");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.sendMobileOTP(cleanMobile);
            if (response.success) {
                setIsOtpSent(true);
                setTimer(60); // 60 seconds cooldown
            } else {
                setError(response.message || "Failed to send WhatsApp OTP");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong sending WhatsApp message");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP code");
            return;
        }

        const cleanMobile = mobile.replace(/\D/g, "");

        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.verifyMobileOTP(cleanMobile, otp);
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
                <span className="text-sm font-medium">Mobile number verified via WhatsApp</span>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4 p-4 bg-white border border-stone-200 rounded-xl shadow-sm", className)}>
            <div className="flex items-center gap-2 mb-2 text-stone-800">
                <Smartphone className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-sm">WhatsApp Verification</h3>
            </div>

            {!isOtpSent ? (
                <div className="flex flex-col gap-3">
                    <p className="text-xs text-stone-500 italic">We will send a 6-digit verification code to your WhatsApp number.</p>
                    <Button
                        onClick={handleSendOtp}
                        disabled={loading || !mobile}
                        variant="primary"
                        className="w-full h-10 text-xs font-black tracking-widest bg-stone-900 border-b-2 border-black text-amber-500 hover:text-amber-400"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <MessageCircle className="w-4 h-4 mr-2" />}
                        SEND WHATSAPP OTP
                    </Button>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="relative">
                        <InputField
                            label="Enter WhatsApp OTP"
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
                            className="w-full bg-[#7ab800] hover:bg-[#689c00] text-white font-black tracking-widest"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            VERIFY MOBILE
                        </Button>
                        
                        {timer === 0 && (
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="text-xs text-[#7ab800] hover:text-[#689c00] underline font-bold"
                            >
                                Didn't receive code? Resend on WhatsApp
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
