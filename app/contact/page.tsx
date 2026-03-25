"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField, TextareaField, SelectField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import { CheckCircle } from "lucide-react";
import { contactConfig } from "@/config/contact.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function ContactPage() {
  const { config, loading: configLoading, error: configError } = usePageConfig('contact', contactConfig);
  const activeConfig = config || contactConfig;
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert(activeConfig.form.validation.fillRequiredFields);
      return;
    }

    if (!isEmailVerified) {
      alert("Please verify your email address first");
      return;
    }

    if (!isMobileVerified) {
      alert("Please verify your mobile number via WhatsApp first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const error = await response.json();
        alert(error.message || activeConfig.form.validation.submitError);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert(activeConfig.form.validation.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading State */}
      {configLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
        </div>
      )}

      {/* Error State */}
      {configError && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load page configuration</p>
            <p className="text-gray-600">Using default configuration</p>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-20">
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">{activeConfig.hero.badge}</span>
          <h1 className="font-serif text-4xl font-bold mt-3 mb-4">{activeConfig.hero.title}</h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            {activeConfig.hero.description}
          </p>
        </Container>
      </section>

      <section className="py-16 bg-cream-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
                {activeConfig.sections.reachUsDirectly}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {activeConfig.contactInfo.map((item) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      className="bg-white rounded-xl p-5 border border-cream-200 hover:border-saffron-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-saffron-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-saffron-600" />
                      </div>
                      <p className="font-medium text-stone-700 text-sm">{item.title}</p>
                      <p className="font-semibold text-stone-800 mt-0.5">{item.info}</p>
                      <p className="text-stone-500 text-xs mt-0.5">{item.sub}</p>
                    </a>
                  );
                })}
              </div>

              {/* Regional offices */}
              {/* <div className="bg-white rounded-xl p-6 border border-cream-200">
                <h3 className="font-serif font-bold text-stone-800 mb-4">{activeConfig.regionalCoordinators.title}</h3>
                <div className="space-y-3">
                  {activeConfig.regionalCoordinators.coordinators.map((reg) => (
                    <div key={reg.city} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                      <div>
                        <p className="font-medium text-stone-700 text-sm">{reg.city}</p>
                        <p className="text-stone-500 text-xs">{reg.name}</p>
                      </div>
                      <a href={`tel:${reg.phone}`} className="text-saffron-600 text-sm hover:underline">
                        {reg.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-7">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">{activeConfig.form.success.title}</h3>
                  <p className="text-stone-600 text-sm mb-4">{activeConfig.form.success.description}</p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-saffron-600 text-sm underline"
                    aria-label="Send another contact message"
                  >
                    {activeConfig.form.success.sendAnotherButton}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-5">
                    {activeConfig.form.title}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-6">
                      <InputField
                        label={activeConfig.form.labels.yourName}
                        placeholder={activeConfig.form.placeholders.fullName}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                      
                      <div className="space-y-4">
                        <InputField
                          label={activeConfig.form.labels.email}
                          placeholder={activeConfig.form.placeholders.email}
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            setIsEmailVerified(false); // Reset verification if email changes
                          }}
                          required
                          disabled={isEmailVerified}
                        />
                        
                        {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                          <EmailVerification 
                            email={form.email} 
                            onVerified={setIsEmailVerified} 
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <InputField
                        label={activeConfig.form.labels.phone}
                        type="tel"
                        placeholder={activeConfig.form.placeholders.phone}
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          setIsMobileVerified(false);
                        }}
                        disabled={isMobileVerified}
                      />
                      
                      {form.phone && form.phone.length >= 10 && (
                        <MobileVerification 
                          mobile={form.phone} 
                          onVerified={setIsMobileVerified} 
                        />
                      )}
                    </div>
                    <SelectField
                      label={activeConfig.form.labels.subject}
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      options={activeConfig.form.subjectOptions}
                      placeholder={activeConfig.form.placeholders.selectSubject}
                    />
                    <TextareaField
                      label={activeConfig.form.labels.message}
                      placeholder={activeConfig.form.placeholders.message}
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    <Button
                      onClick={handleSubmit}
                      loading={loading}
                      variant="primary"
                      className="w-full text-lg mt-4 py-4 font-bold shadow-xl border-b-4 border-amber-900"
                      disabled={!isEmailVerified || !isMobileVerified || !form.name || !form.email || !form.message}
                    >
                      {loading ? "SENDING..." : activeConfig.form.submitButton}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
