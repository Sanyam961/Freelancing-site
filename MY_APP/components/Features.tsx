import { ShieldCheck, Globe, Zap as Flash } from "lucide-react";
import SimpleRiveAnimation from "@/components/SimpleRiveAnimation";

const features = [
  {
    title: "Secure Escrow",
    description: "Built-in payment protection ensures freelancers get paid and clients get quality results.",
    icon: ShieldCheck,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Zero Latency",
    description: "Real-time communication and project updates powered by the Convex edge network.",
    icon: Flash,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    title: "Global Collaboration",
    description: "Seamlessly work with talent across 150+ countries with effortless currency conversion.",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Priority Support",
    description: "24/7 dedicated assistance for high-stakes projects and enterprise integrations.",
    icon: ShieldCheck,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none -mt-32 -mr-32">
        <SimpleRiveAnimation src="/p-3d.riv" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#111827] shadow-sm mb-6">
            Scale Fast
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight font-extrabold text-[#111827] mb-6 leading-[1.1]">
            Everything you need to scale your operations.
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-xl leading-relaxed">
            SKILLIFY is more than just a marketplace. It&apos;s a complete operating system for the future of work, connecting you with the right people at the right time.
          </p>
          <div className="w-full max-w-sm h-[300px] relative -ml-8">
            <SimpleRiveAnimation src="/large-balloon.riv" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-white border border-[#111827]/10 shadow-[4px_4px_0px_#111827] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#111827] mb-3">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
