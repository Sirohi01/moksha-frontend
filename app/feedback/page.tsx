"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { MessageSquare, CheckCircle, Star, User, Shield } from "lucide-react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    feedbackType: "",
    serviceUsed: "",
    experienceRating: 0,
    subject: "",
    message: "",
    suggestions: "",
    wouldRecommend: "",
    consentToPublish: false,
  });

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.email || !form.feedbackType || !form.subject || !form.message || !form.wouldRecommend) {
      alert('Please fill in all required fields');
      return;
    }

    if (form.experienceRating < 1 || form.experienceRating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare form data for API
      const feedbackData = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        feedbackType: form.feedbackType,
        serviceUsed: form.serviceUsed || undefined,
        experienceRating: parseInt(form.experienceRating.toString()), // Ensure it's an integer
        subject: form.subject,
        message: form.message,
        suggestions: form.suggestions || undefined,
        wouldRecommend: form.wouldRecommend,
        consentToPublish: form.consentToPublish
        // Removed status since model has default 'new'
      };

      // Debug log to check the rating value
      console.log('Sending experienceRating:', feedbackData.experienceRating, 'Type:', typeof feedbackData.experienceRating);

      // Submit to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      const result = await response.json();
      console.log('Feedback submitted successfully:', result);
      
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Thank You!</h2>
          <p className="text-stone-600 mb-2">
            Your feedback has been received and is valuable to us.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Reference: <span className="font-mono font-bold text-saffron-600">FB-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-saffron-600 text-sm underline"
          >
            Submit another feedback
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-stone-50 text-gray-900 py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center border-2 border-amber-200 flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <span className="text-amber-700 text-xs font-semibold tracking-wider uppercase">Your Voice Matters</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Share Your Feedback
              </h1>
              <p className="text-gray-600 text-base">
                Help us improve our services and serve you better. Your feedback is invaluable to us.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Feedback Form */}
      <section className="py-12 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title="We Value Your Opinion" className="mb-6">
            Your feedback helps us improve our services and better serve those in need. All responses are confidential.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-gray-800">Feedback Form</h2>
              <p className="text-gray-500 text-xs mt-1">Please share your experience and suggestions with us</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Personal Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Your Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Your Name *"
                      placeholder="Full name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <InputField
                      label="Email Address *"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <InputField
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Feedback Type */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Feedback Type
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Type of Feedback *
                      </label>
                      <select
                        value={form.feedbackType}
                        onChange={(e) => setForm({ ...form, feedbackType: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="service_experience">Service Experience</option>
                        <option value="website">Website Feedback</option>
                        <option value="volunteer">Volunteer Experience</option>
                        <option value="donation">Donation Process</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="appreciation">Appreciation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Service Used
                      </label>
                      <select
                        value={form.serviceUsed}
                        onChange={(e) => setForm({ ...form, serviceUsed: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      >
                        <option value="">Select service</option>
                        <option value="cremation">Cremation Services</option>
                        <option value="report">Report Unclaimed Body</option>
                        <option value="volunteer">Volunteer Program</option>
                        <option value="donation">Donation</option>
                        <option value="helpline">24/7 Helpline</option>
                        <option value="website">Website</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Experience Rating */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" />
                    Rate Your Experience
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 text-center">
                      Overall Experience Rating *
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, experienceRating: star });
                          }}
                          className={`w-8 h-8 rounded-full transition-colors ${
                            star <= form.experienceRating
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-stone-300 hover:text-yellow-400"
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-stone-600">
                        {form.experienceRating > 0 && (
                          <>
                            {form.experienceRating}/5 - 
                            {form.experienceRating === 5 && " Excellent"}
                            {form.experienceRating === 4 && " Very Good"}
                            {form.experienceRating === 3 && " Good"}
                            {form.experienceRating === 2 && " Fair"}
                            {form.experienceRating === 1 && " Poor"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Detailed Feedback */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Your Feedback
                  </h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Subject *"
                    placeholder="Brief subject of your feedback"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder="Please share your detailed feedback, experience, or suggestions..."
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Section 5: Suggestions & Recommendations */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" />
                    Suggestions & Recommendations
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      value={form.suggestions}
                      onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder="How can we improve our services?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Would you recommend Moksha Seva to others? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="recommend"
                          value="yes"
                          checked={form.wouldRecommend === "yes"}
                          onChange={(e) => setForm({ ...form, wouldRecommend: e.target.value })}
                          className="w-4 h-4 text-saffron-600 border-stone-300 focus:ring-saffron-500"
                        />
                        <span className="text-sm text-stone-700">Yes, definitely</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="recommend"
                          value="maybe"
                          checked={form.wouldRecommend === "maybe"}
                          onChange={(e) => setForm({ ...form, wouldRecommend: e.target.value })}
                          className="w-4 h-4 text-saffron-600 border-stone-300 focus:ring-saffron-500"
                        />
                        <span className="text-sm text-stone-700">Maybe</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="recommend"
                          value="no"
                          checked={form.wouldRecommend === "no"}
                          onChange={(e) => setForm({ ...form, wouldRecommend: e.target.value })}
                          className="w-4 h-4 text-saffron-600 border-stone-300 focus:ring-saffron-500"
                        />
                        <span className="text-sm text-stone-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 6: Consent */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Privacy & Consent
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consentToPublish"
                      checked={form.consentToPublish}
                      onChange={(e) => setForm({ ...form, consentToPublish: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500 mt-0.5"
                    />
                    <label htmlFor="consentToPublish" className="text-sm text-stone-700">
                      I consent to Moksha Seva using my feedback (anonymously) for testimonials and service improvement purposes
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-stone-200 mt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  onClick={handleSubmit}
                  disabled={
                    !form.name ||
                    !form.email ||
                    !form.feedbackType ||
                    !form.subject ||
                    !form.message ||
                    !form.wouldRecommend ||
                    form.experienceRating === 0
                  }
                >
                  Submit Feedback
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  Your feedback is confidential and helps us serve better.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-5 text-center shadow-lg">
            <p className="font-medium text-sm mb-1">Have questions? Contact us:</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <a href="tel:+911800123456" className="hover:text-emerald-200 transition-colors">
                📞 1800-123-456
              </a>
              <span>•</span>
              <a href="mailto:feedback@mokshaseva.org" className="hover:text-emerald-200 transition-colors">
                ✉️ feedback@mokshaseva.org
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}