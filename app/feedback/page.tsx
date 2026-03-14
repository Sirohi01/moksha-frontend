"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { feedbackConfig } from "@/config/feedback.config";
import { getIcon } from "@/config/icons.config";

// Get icons
const MessageSquare = getIcon('MessageSquare');
const CheckCircle = getIcon('CheckCircle');
const Star = getIcon('Star');
const User = getIcon('User');
const Shield = getIcon('Shield');

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
      alert(feedbackConfig.validationMessages.fillRequiredFields);
      return;
    }

    if (form.experienceRating < 1 || form.experienceRating > 5) {
      alert(feedbackConfig.validationMessages.selectRating);
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
      alert(`${feedbackConfig.validationMessages.submitFailed}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">{feedbackConfig.success.title}</h2>
          <p className="text-stone-600 mb-2">
            {feedbackConfig.success.description}
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Reference: <span className="font-mono font-bold text-saffron-600">{feedbackConfig.success.referencePrefix}{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-saffron-600 text-sm underline"
          >
            {feedbackConfig.success.submitAnotherText}
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
              <span className="text-amber-700 text-xs font-semibold tracking-wider uppercase">{feedbackConfig.hero.badge}</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                {feedbackConfig.hero.title}
              </h1>
              <p className="text-gray-600 text-base">
                {feedbackConfig.hero.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Feedback Form */}
      <section className="py-12 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title={feedbackConfig.alert.title} className="mb-6">
            {feedbackConfig.alert.message}
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-gray-800">{feedbackConfig.formHeader.title}</h2>
              <p className="text-gray-500 text-xs mt-1">{feedbackConfig.formHeader.subtitle}</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Personal Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[0].number}</span>
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[0].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={feedbackConfig.labels.yourName}
                      placeholder={feedbackConfig.placeholders.fullName}
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <InputField
                      label={feedbackConfig.labels.emailAddress}
                      type="email"
                      placeholder={feedbackConfig.placeholders.email}
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <InputField
                    label={feedbackConfig.labels.phoneNumber}
                    type="tel"
                    placeholder={feedbackConfig.placeholders.phone}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Feedback Type */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[1].number}</span>
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[1].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {feedbackConfig.labels.typeOfFeedback}
                      </label>
                      <select
                        value={form.feedbackType}
                        onChange={(e) => setForm({ ...form, feedbackType: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        {feedbackConfig.selectOptions.feedbackType.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {feedbackConfig.labels.serviceUsed}
                      </label>
                      <select
                        value={form.serviceUsed}
                        onChange={(e) => setForm({ ...form, serviceUsed: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      >
                        {feedbackConfig.selectOptions.serviceUsed.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Experience Rating */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[2].number}</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[2].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 text-center">
                      {feedbackConfig.labels.overallExperienceRating}
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
                            {form.experienceRating === 5 && ` ${feedbackConfig.ratingLabels.excellent}`}
                            {form.experienceRating === 4 && ` ${feedbackConfig.ratingLabels.veryGood}`}
                            {form.experienceRating === 3 && ` ${feedbackConfig.ratingLabels.good}`}
                            {form.experienceRating === 2 && ` ${feedbackConfig.ratingLabels.fair}`}
                            {form.experienceRating === 1 && ` ${feedbackConfig.ratingLabels.poor}`}
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
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[3].number}</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[3].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label={feedbackConfig.labels.subject}
                    placeholder={feedbackConfig.placeholders.subject}
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {feedbackConfig.labels.detailedMessage}
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder={feedbackConfig.placeholders.detailedMessage}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Section 5: Suggestions & Recommendations */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[4].number}</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[4].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {feedbackConfig.labels.suggestionsForImprovement}
                    </label>
                    <textarea
                      value={form.suggestions}
                      onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder={feedbackConfig.placeholders.suggestions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {feedbackConfig.labels.wouldRecommend}
                    </label>
                    <div className="flex gap-4">
                      {feedbackConfig.selectOptions.recommendation.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="recommend"
                            value={option.value}
                            checked={form.wouldRecommend === option.value}
                            onChange={(e) => setForm({ ...form, wouldRecommend: e.target.value })}
                            className="w-4 h-4 text-saffron-600 border-stone-300 focus:ring-saffron-500"
                          />
                          <span className="text-sm text-stone-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 6: Consent */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{feedbackConfig.sections[5].number}</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    {feedbackConfig.sections[5].title}
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
                      {feedbackConfig.labels.consentToPublish}
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
                  {feedbackConfig.labels.submitButton}
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  {feedbackConfig.labels.confidentialityText}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-5 text-center shadow-lg">
            <p className="font-medium text-sm mb-1">{feedbackConfig.contact.title}</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <a href={`tel:${feedbackConfig.contact.phone.number}`} className="hover:text-emerald-200 transition-colors">
                {feedbackConfig.contact.phone.display}
              </a>
              <span>•</span>
              <a href={`mailto:${feedbackConfig.contact.email.address}`} className="hover:text-emerald-200 transition-colors">
                {feedbackConfig.contact.email.display}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}