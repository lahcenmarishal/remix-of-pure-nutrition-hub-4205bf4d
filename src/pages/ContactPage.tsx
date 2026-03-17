import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import contactHero from "@/assets/contact-hero.jpg";

const contactInfo = [
  { icon: MapPin, title: "Adresse", lines: ["Boulevard Mohammed V", "Casablanca, Maroc"] },
  { icon: Phone, title: "Téléphone", lines: ["+212 5 22 00 00 00", "+212 6 00 00 00 00"] },
  { icon: Mail, title: "Email", lines: ["contact@nutritrax.ma", "support@nutritrax.ma"] },
  { icon: Clock, title: "Horaires", lines: ["Lun–Ven : 9h–18h", "Sam : 10h–14h"] },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend
    alert("Merci pour votre message ! Nous vous répondrons sous 24h.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src={contactHero} alt="Contact NutriTrax" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <AnimatedSection>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">Contactez-nous</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Notre équipe est à votre écoute pour répondre à toutes vos questions.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact cards */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {contactInfo.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-sm text-muted-foreground">{line}</p>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Form + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <AnimatedSection direction="left">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Nom complet"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Sujet"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <textarea
                    placeholder="Votre message..."
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </form>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <div className="h-full min-h-[400px] rounded-2xl overflow-hidden border border-border">
                  <iframe
                    title="NutriTrax Casablanca"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.72691458199!2d-7.6824!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca!5e0!3m2!1sfr!2sma!4v1709000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
