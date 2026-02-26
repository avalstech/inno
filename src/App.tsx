import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  ChevronUp,
  Factory,
  Globe,
  Handshake,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Speech,
  TrendingUp,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { id: "about", label: "About" },
  { id: "focus", label: "Focus" },
  { id: "industries", label: "Industries" },
  { id: "speaking", label: "Speaking" },
  { id: "insights", label: "Insights" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof links)[number]["id"];

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Tell me a bit more so I can respond well"),
});

type ContactForm = z.infer<typeof contactSchema>;

function scrollToId(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(id);
            }
          }
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0.01 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

function Section({
  id,
  title,
  eyebrow,
  children,
  className,
}: {
  id: SectionId;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>{eyebrow}</span>
            </div>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function App() {
  const active = useActiveSection(links.map((l) => l.id));
  const topRef = useRef<HTMLDivElement | null>(null);

  const offerings = useMemo(
    () => [
      {
        icon: Handshake,
        title: "Strategic partnerships & growth",
        desc: "Aligning buyers, operators, and delivery teams to unlock measurable growth without adding delivery risk.",
      },
      {
        icon: ShieldCheck,
        title: "Compliance-driven delivery",
        desc: "A pragmatic approach to execution in regulated environments where quality and documentation matter.",
      },
      {
        icon: TrendingUp,
        title: "Modernization & operational readiness",
        desc: "Translating modernization goals into a clear plan that protects uptime, safety, and schedule integrity.",
      },
    ],
    []
  );

  const insights = useMemo(
    () => [
      {
        title: "Modernizing manufacturing facilities without downtime",
        date: "2026",
        tag: "Delivery strategy",
        excerpt:
          "A practical framework for sequencing work, reducing interface risk, and protecting operations during upgrades.",
      },
      {
        title: "Compliance is a growth enabler, not a constraint",
        date: "2026",
        tag: "Regulated manufacturing",
        excerpt:
          "How to build delivery discipline that improves quality outcomes while keeping teams aligned and moving.",
      },
      {
        title: "Partnerships that survive the handoff",
        date: "2026",
        tag: "Commercial execution",
        excerpt:
          "The difference between a signed agreement and a delivered outcome is clear intent plus shared accountability.",
      },
    ],
    []
  );

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactForm) {
    // MVP: client-only. Replace with your email service or backend when ready.
    toast.success("Message ready to send", {
      description: "For now, this form saves locally. Add your email handler when you deploy.",
    });

    try {
      const key = "inno_contact_drafts";
      const current = JSON.parse(localStorage.getItem(key) || "[]") as ContactForm[];
      localStorage.setItem(key, JSON.stringify([{ ...values }, ...current].slice(0, 20)));
    } catch {
      // ignore
    }

    form.reset();
  }

  useEffect(() => {
    // Support deep links like /#contact
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "") as SectionId;
      if (links.some((l) => l.id === id)) {
        setTimeout(() => scrollToId(id), 50);
      }
    }
  }, []);

  return (
    <div ref={topRef} className="min-h-screen">
      <Toaster richColors position="top-right" />

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
            aria-label="Go to top"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
              <span className="text-sm font-semibold">IA</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-none">Inno Anene</div>
              <div className="mt-0.5 text-xs text-muted-foreground">MSc, PMP</div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  active === l.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => scrollToId("contact")}
            >
              <Calendar className="h-4 w-4" />
              Book a call
            </Button>
            <Button onClick={() => scrollToId("contact")}>
              Let’s talk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-fade opacity-40" aria-hidden="true" />
          <div className="absolute -top-24 right-[-15%] h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 left-[-15%] h-72 w-72 rounded-full bg-navy/20 blur-3xl" aria-hidden="true" />

          <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  <BadgeCheck className="h-4 w-4 text-gold" />
                  Industrial manufacturing growth and delivery
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl"
                >
                  Innocent (Inno) Anene
                  <span className="block text-xl font-medium text-muted-foreground sm:text-2xl">MSc, PMP</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                >
                  Senior Business Development Manager focused on industrial and regulated manufacturing. I help teams
                  modernize facilities, de-risk delivery, and build partnerships that convert into outcomes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15 }}
                  className="mt-7 flex flex-col gap-3 sm:flex-row"
                >
                  <Button size="lg" onClick={() => scrollToId("contact")}>
                    Start a conversation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => toast.message("Quick action", { description: "Add your LinkedIn URL here when ready." })}
                  >
                    View LinkedIn
                    <Globe className="h-4 w-4" />
                  </Button>
                </motion.div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <Badge variant="navy">Industrial Manufacturing</Badge>
                  <Badge variant="gold">Regulated Environments</Badge>
                  <Badge variant="outline">Facility Modernization</Badge>
                  <Badge variant="outline">Operational Readiness</Badge>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <Card className="glass">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Partnerships</CardTitle>
                      <CardDescription>Commercial alignment</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Create clarity across stakeholders, incentives, and delivery ownership.
                    </CardContent>
                  </Card>
                  <Card className="glass">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Modernization</CardTitle>
                      <CardDescription>Plan to execution</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Translate strategy into sequencing that protects uptime and schedule.
                    </CardContent>
                  </Card>
                  <Card className="glass">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Risk reduction</CardTitle>
                      <CardDescription>Delivery discipline</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Identify interfaces early and keep teams aligned through handoffs.
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy/10 via-transparent to-gold/10" aria-hidden="true" />
                  <CardHeader>
                    <CardTitle className="text-lg">Snapshot</CardTitle>
                    <CardDescription>What you get when you work with me</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-secondary p-2">
                        <Factory className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Industrial manufacturing focus</div>
                        <div className="text-sm text-muted-foreground">Uptime-aware modernization and delivery execution.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-secondary p-2">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Regulatory maturity</div>
                        <div className="text-sm text-muted-foreground">Quality, documentation, and compliance-first delivery.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-secondary p-2">
                        <Handshake className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Commercial + delivery alignment</div>
                        <div className="text-sm text-muted-foreground">Partnerships that survive handoffs and scale.</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="rounded-xl border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Available for</div>
                        <Badge variant="gold">Consulting • Speaking</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Strategy workshops, partnership development, modernization planning, and conference sessions.
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button className="w-full" onClick={() => scrollToId("contact")}>
                          Contact
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="about"
          eyebrow="Execution discipline"
          title="About Inno"
          className="border-t"
        >
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Built for delivery</CardTitle>
                  <CardDescription>
                    A business development leader who stays close to execution so commitments translate into outcomes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    I work at the intersection of commercial strategy and delivery reality. That means aligning
                    stakeholders early, simplifying decision paths, and making sure the handoff between teams is
                    designed, not assumed.
                  </p>
                  <p>
                    My focus is industrial and regulated manufacturing, where operational readiness, quality, and
                    documentation can’t be afterthoughts. The goal is straightforward: deliver modernization and growth
                    without introducing avoidable risk.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline">MSc</Badge>
                    <Badge variant="outline">PMP</Badge>
                    <Badge variant="outline">Business development</Badge>
                    <Badge variant="outline">Manufacturing delivery</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-5">
              <div className="grid gap-4">
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Core strengths</CardTitle>
                    <CardDescription>Where I create leverage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-gold" />
                      <span>Stakeholder alignment and clarity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-gold" />
                      <span>Delivery-aware growth strategy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-gold" />
                      <span>Risk identification at interfaces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-gold" />
                      <span>Executive-ready communication</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Location</CardTitle>
                    <CardDescription>Open to global engagements</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Houston area • US and global</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        <Section id="focus" eyebrow="What I do" title="Focus areas" className="border-t">
          <div className="grid gap-4 md:grid-cols-3">
            {offerings.map((o) => (
              <Card key={o.title} className="relative overflow-hidden">
                <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-gold/10 blur-2xl" aria-hidden="true" />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-secondary p-2">
                      <o.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{o.title}</CardTitle>
                  </div>
                  <CardDescription>{o.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => scrollToId("contact")}>
                    Discuss this
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Typical engagements</CardTitle>
                <CardDescription>Fast, structured, outcome-driven</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>90-minute executive alignment session</p>
                <p>2-week modernization sequencing workshop</p>
                <p>Partnership discovery and value narrative</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What you receive</CardTitle>
                <CardDescription>Clear artifacts, not vague advice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Decision-ready options with tradeoffs</p>
                <p>Risk register for key interfaces</p>
                <p>Simple roadmap with ownership and cadence</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Working style</CardTitle>
                <CardDescription>Transparent, pragmatic, disciplined</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Start with outcomes, then design constraints</p>
                <p>Reduce ambiguity through written intent</p>
                <p>Keep communication simple and frequent</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section id="industries" eyebrow="Where I operate" title="Industries" className="border-t">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-secondary p-2">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Pharma manufacturing</CardTitle>
                </div>
                <CardDescription>Quality-first delivery in regulated environments</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Modernization and expansion work that respects documentation, validation, and operational readiness.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-secondary p-2">
                    <Factory className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Industrial manufacturing</CardTitle>
                </div>
                <CardDescription>Uptime-aware upgrades and growth programs</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Helping teams grow capacity and improve performance while protecting operations and schedule integrity.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-secondary p-2">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Regulated delivery</CardTitle>
                </div>
                <CardDescription>Execution discipline that builds trust</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Cross-functional alignment, interface management, and risk reduction in high-stakes environments.
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section id="speaking" eyebrow="Invite me" title="Speaking and events" className="border-t">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Topics I speak on</CardTitle>
                  <CardDescription>Practical sessions for operators, leaders, and delivery teams</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {[{
                    t: "Modernization without downtime",
                    d: "Sequencing work to protect operations while delivering upgrades.",
                  },
                  {
                    t: "Compliance as a growth enabler",
                    d: "Delivery discipline that improves outcomes and reduces rework.",
                  },
                  {
                    t: "Partnerships that survive handoffs",
                    d: "Commercial alignment that holds through execution.",
                  },
                  {
                    t: "Reducing interface risk",
                    d: "How to spot the handoffs that break schedules before they happen.",
                  }].map((x) => (
                    <div key={x.t} className="rounded-xl border bg-background p-4">
                      <div className="flex items-center gap-2">
                        <Speech className="h-4 w-4 text-gold" />
                        <div className="text-sm font-medium">{x.t}</div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-5">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Booking</CardTitle>
                  <CardDescription>A simple way to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Send your event details, audience, and desired outcomes.</p>
                  <p>I’ll respond with suggested angles, outline, and a clear next step.</p>
                  <Button className="w-full" onClick={() => scrollToId("contact")}>
                    Request availability
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <Section id="insights" eyebrow="Writing" title="Insights" className="border-t">
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((p) => (
              <Card key={p.title} className="group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{p.tag}</Badge>
                    <div className="text-xs text-muted-foreground">{p.date}</div>
                  </div>
                  <CardTitle className="text-base leading-snug group-hover:underline">{p.title}</CardTitle>
                  <CardDescription>{p.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.message("Coming soon", { description: "Connect a CMS or Markdown posts when ready." })}
                  >
                    Read
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Get in touch" title="Contact" className="border-t">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Let’s talk</CardTitle>
                  <CardDescription>
                    Send a short note with your goals and timeline. I’ll reply with next steps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Add your email here</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Add your LinkedIn here</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Houston area • Open to global engagements</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Send a message</CardTitle>
                  <CardDescription>This form is client-only for now. Hook it to email when you deploy.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input placeholder="Your name" {...form.register("name")} />
                        {form.formState.errors.name ? (
                          <div className="mt-1 text-xs text-destructive">
                            {form.formState.errors.name.message}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="you@company.com" {...form.register("email")} />
                        {form.formState.errors.email ? (
                          <div className="mt-1 text-xs text-destructive">
                            {form.formState.errors.email.message}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Company (optional)</label>
                      <Input placeholder="Company" {...form.register("company")} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="What are you working on, and what outcome do you want?"
                        {...form.register("message")}
                      />
                      {form.formState.errors.message ? (
                        <div className="mt-1 text-xs text-destructive">
                          {form.formState.errors.message.message}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button type="submit" size="lg">
                        Submit
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Tip: Replace “Add your email here” with your real contact details.
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <footer className="border-t">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">Inno Anene</div>
              <div className="mt-1 text-xs text-muted-foreground">Industrial Manufacturing Growth & Delivery</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <Button key={l.id} variant="ghost" size="sm" onClick={() => scrollToId(l.id)}>
                  {l.label}
                </Button>
              ))}
            </div>
          </div>
        </footer>

        <BackToTop />
      </main>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      className="fixed bottom-5 right-5 rounded-2xl border bg-background/80 p-3 shadow-sm backdrop-blur transition hover:bg-secondary"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
