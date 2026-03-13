"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField, TextareaField, SelectField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Helpline (24/7)",
    info: "1800-123-456",
    sub: "Toll Free · All India",
    href: "tel:+911800123456",
  },
  {
    icon: Mail,
    title: "Email",
    info: "help@mokshaseva.org",
    sub: "Response within 24 hours",
    href: "mailto:help@mokshaseva.org",
  },
  {
    icon: MapPin,
    title: "Head Office",
    info: "12, Seva Marg, New Delhi",
    sub: "Delhi 110001",
    href: "#",
  },
  {
    icon: Clock,
    title: "Office Hours",
    info: "Mon–Sat: 9am–6pm",
    sub: "Emergency line: 24/7",
    href: "#",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all required fields');
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
        alert(error.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-20">
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">✦ Get in Touch ✦</span>
          <h1 className="font-serif text-4xl font-bold mt-3 mb-4">Contact Us</h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            We are here to help — for emergencies, partnerships, media queries, or any other matter.
          </p>
        </Container>
      </section>

      <section className="py-16 bg-cream-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
                Reach Us Directly
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
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
              <div className="bg-white rounded-xl p-6 border border-cream-200">
                <h3 className="font-serif font-bold text-stone-800 mb-4">Regional Coordinators</h3>
                <div className="space-y-3">
                  {[
                    { city: "Mumbai", name: "Priya Iyer", phone: "+91 98765 00001" },
                    { city: "Chennai", name: "Kavitha Rajan", phone: "+91 98765 00002" },
                    // { city: "Bangalore", name: "Arjun Bhatia", phone: "+91 98765 00003" },
                    // { city: "Lucknow", name: "Sunita Devi", phone: "+91 98765 00004" },
                  ].map((reg) => (
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
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-7">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">Message Sent!</h3>
                  <p className="text-stone-600 text-sm mb-4">We will respond within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-saffron-600 text-sm underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-5">
                    Send a Message
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Your Name"
                        placeholder="Full name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <InputField
                        label="Email"
                        type="email"
                        placeholder="you@email.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <InputField
                      label="Phone"
                      type="tel"
                      placeholder="+91 ..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <SelectField
                      label="Subject"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      options={[
                        { value: "general", label: "General Inquiry" },
                        { value: "partnership", label: "NGO / Government Partnership" },
                        { value: "media", label: "Media & Press" },
                        { value: "volunteer", label: "Volunteering" },
                        { value: "donation", label: "Donation Query" },
                        { value: "other", label: "Other" },
                      ]}
                      placeholder="Select subject..."
                    />
                    <TextareaField
                      label="Message"
                      placeholder="How can we help you?"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={loading}
                      onClick={handleSubmit}
                      disabled={!form.name || !form.email || !form.message}
                    >
                      Send Message
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
