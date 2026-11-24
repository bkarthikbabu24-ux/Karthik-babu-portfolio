import { useState, type FormEvent } from 'react';
import { Check, Copy, Mail, MessageSquare, Send } from 'lucide-react';

const TOPICS = ['Web / 3D Project', 'Free Fire Scrim / Duo', 'Freelance Collaboration'] as const;
type ContactTopic = (typeof TOPICS)[number];

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('Web / 3D Project');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<'email' | 'discord' | null>(null);

  const handleCopy = async (value: string, key: 'email' | 'discord') => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback still provides clear visual feedback
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please enter your name, email address, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative border-t border-[#8B5CF6]/15 bg-[#07060C]/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#C084FC]">Contact Me</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Let&apos;s build something bold or squad up
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#C4BBE0]">
              Open to 3D web projects, frontend collaborations, and Free Fire custom rooms or
              duo matches.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#A855F7]/30 bg-[#7C3AED]/20 text-[#C084FC]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A19BB8]">Direct Email</p>
                    <p className="truncate font-mono text-sm text-white">
                      bkarthikbabu24@gmail.com
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('bkarthikbabu24@gmail.com', 'email')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#8B5CF6]/30 bg-[#07060C] px-3.5 py-2 text-xs font-medium text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#DDD6FE]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#6D28D9]/20 text-[#A78BFA]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A19BB8]">Discord &amp; Gaming Comms</p>
                    <p className="truncate font-mono text-sm text-white">kb_shadow.dev</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('kb_shadow.dev', 'discord')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#8B5CF6]/30 bg-[#07060C] px-3.5 py-2 text-xs font-medium text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                >
                  {copiedKey === 'discord' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#DDD6FE]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="rounded-2xl border border-[#8B5CF6]/25 bg-[#0B0912]/82 p-5 backdrop-blur-md shadow-[0_14px_42px_rgba(0,0,0,0.55)] sm:p-8 lg:col-span-7">
            {submitted ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#A855F7]/50 bg-gradient-to-br from-[#6D28D9]/30 to-[#A855F7]/25 text-[#DDD6FE] shadow-[0_0_24px_rgba(168,85,247,0.3)]">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">
                  Message Ready, {name}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#C4BBE0]">
                  Your inquiry under <span className="text-white font-medium">{topic}</span> is
                  prepared. Launch your email client directly or compose another message.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:bkarthikbabu24@gmail.com?subject=${encodeURIComponent(
                      `[${topic}] Message from ${name}`,
                    )}&body=${encodeURIComponent(message)}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(124,58,237,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)]"
                  >
                    Open in Email Client
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="min-h-[44px] rounded-lg border border-[#8B5CF6]/30 bg-[#07060C] px-4 py-2.5 text-xs font-medium text-[#D8D0EE] transition-all duration-200 hover:border-[#A855F7] hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.4)]"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <span className="block text-xs font-medium text-[#A19BB8]">Inquiry Topic</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TOPICS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTopic(item)}
                        className={`min-h-[38px] rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                          topic === item
                            ? 'bg-gradient-to-r from-[#6D28D9] to-[#A855F7] text-white shadow-[0_0_18px_rgba(168,85,247,0.45)]'
                            : 'border border-[#8B5CF6]/20 bg-[#07060C] text-[#A19BB8] hover:border-[#A855F7]/50 hover:text-white hover:shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#D8D0EE]">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#8B5CF6]/20 bg-[#07060C] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6B6482] transition-colors focus:border-[#A855F7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#D8D0EE]">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#8B5CF6]/20 bg-[#07060C] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6B6482] transition-colors focus:border-[#A855F7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#D8D0EE]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details about your 3D web project, app idea, or Free Fire match..."
                    className="mt-1.5 w-full rounded-lg border border-[#8B5CF6]/20 bg-[#07060C] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6B6482] transition-colors focus:border-[#A855F7] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#F87171]">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.38)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(168,85,247,0.72)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] sm:w-auto"
                  >
                    Send Message
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
