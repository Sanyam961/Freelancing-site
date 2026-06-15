import { Code, PenTool, Video, TrendingUp } from "lucide-react";

const services = [
  {
    title: "Software Development",
    description: "Hire elite developers to build robust web, mobile, and custom software applications tailored to your business needs.",
    icon: Code,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Video Editing",
    description: "Transform raw footage into captivating stories with professional video editors, motion graphics, and visual effects.",
    icon: Video,
    color: "text-purple-500",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "Content Creation",
    description: "Engage your audience with high-quality SEO writing, copywriting, and creative design from top-tier creators.",
    icon: PenTool,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Marketing",
    description: "Scale your revenue with expert digital marketers, SEO specialists, campaign managers, and growth hackers.",
    icon: TrendingUp,
    color: "text-[#f2a642]",
    bg: "bg-[#f2a642]/10 border-[#f2a642]/20",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#FFFDF5] border-t border-[#111827]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#111827] mb-6 uppercase">
            Top Services
          </h2>
          <p className="text-lg text-neutral-600 font-medium">
            Explore the core skills and professional services offered by our world-class freelancers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-none bg-white border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111827] transition-all duration-300 group flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-full ${service.bg} border-2 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`h-7 w-7 ${service.color}`} />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3 uppercase tracking-wide">{service.title}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm flex-1">
                {service.description}
              </p>
              <button className="mt-8 text-left text-sm font-bold flex items-center gap-2 group-hover:text-[#42A596] transition-colors">
                FIND EXPERTS &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}