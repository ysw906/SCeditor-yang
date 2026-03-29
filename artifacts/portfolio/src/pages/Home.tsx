import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  useGetHero,
  useGetProjects,
  useGetCareer,
  useGetSkills,
  useGetClosing,
  useGetSettings,
  useGetContact
} from "@workspace/api-client-react";

// Reusable face for 3D wireframe cube
const CubeFace = ({ transform, size, color, opacity }: {
  transform: string; size: number; color: string; opacity: number;
}) => (
  <div style={{
    position: "absolute", width: size, height: size,
    border: `1px solid ${color}`, opacity, transform,
  }} />
);

// 3D wireframe spinning cube
const WireframeCube = ({ size = 200, pos, duration = 32, delay = 0, color = "#000", opacity = 0.07 }: {
  size?: number; pos: React.CSSProperties; duration?: number; delay?: number; color?: string; opacity?: number;
}) => {
  const half = size / 2;
  return (
    <div style={{ ...pos, position: "absolute", width: size, height: size, perspective: 900 }}>
      <motion.div
        style={{ width: size, height: size, transformStyle: "preserve-3d", position: "relative" }}
        animate={{ rotateY: [0, 360], rotateX: [18, 32, 18] }}
        transition={{
          rotateY: { duration, repeat: Infinity, ease: "linear", delay },
          rotateX: { duration: duration * 0.65, repeat: Infinity, ease: "easeInOut", delay },
        }}
      >
        <CubeFace transform={`translateZ(${half}px)`}           size={size} color={color} opacity={opacity} />
        <CubeFace transform={`translateZ(-${half}px)`}          size={size} color={color} opacity={opacity} />
        <CubeFace transform={`rotateY(90deg) translateZ(${half}px)`}   size={size} color={color} opacity={opacity} />
        <CubeFace transform={`rotateY(-90deg) translateZ(${half}px)`}  size={size} color={color} opacity={opacity} />
        <CubeFace transform={`rotateX(90deg) translateZ(${half}px)`}   size={size} color={color} opacity={opacity} />
        <CubeFace transform={`rotateX(-90deg) translateZ(${half}px)`}  size={size} color={color} opacity={opacity} />
      </motion.div>
    </div>
  );
};

// Wireframe diamond (octahedron-ish) — 4 rhombus faces
const WireframeDiamond = ({ size = 160, pos, duration = 24, delay = 0, color = "#000", opacity = 0.065 }: {
  size?: number; pos: React.CSSProperties; duration?: number; delay?: number; color?: string; opacity?: number;
}) => {
  const s = size;
  // Points: top, bottom, left, right (front half), then repeated for back half via rotation
  const pts = `${s/2},0 ${s},${s/2} ${s/2},${s} 0,${s/2}`;
  return (
    <div style={{ ...pos, position: "absolute", width: size, height: size, perspective: 700 }}>
      <motion.svg
        width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
        style={{ transformStyle: "preserve-3d", display: "block" }}
        animate={{ rotateY: [0, 360], rotateX: [-15, 20, -15] }}
        transition={{
          rotateY: { duration, repeat: Infinity, ease: "linear", delay },
          rotateX: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut", delay: delay + 2 },
        }}
      >
        {/* Outer diamond */}
        <polygon points={pts} stroke={color} strokeWidth="1" opacity={opacity} />
        {/* Inner cross lines for depth */}
        <line x1={s/2} y1={0} x2={s/2} y2={s} stroke={color} strokeWidth="0.7" opacity={opacity * 0.7} />
        <line x1={0} y1={s/2} x2={s} y2={s/2} stroke={color} strokeWidth="0.7" opacity={opacity * 0.7} />
        {/* Second rotated square for depth illusion */}
        <polygon
          points={`${s*0.25},${s*0.25} ${s*0.75},${s*0.25} ${s*0.75},${s*0.75} ${s*0.25},${s*0.75}`}
          stroke={color} strokeWidth="0.8" opacity={opacity * 0.5}
        />
        {/* Corner connectors */}
        <line x1={s/2} y1={0} x2={s*0.25} y2={s*0.25} stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
        <line x1={s}   y1={s/2} x2={s*0.75} y2={s*0.25} stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
        <line x1={s/2} y1={s} x2={s*0.75} y2={s*0.75} stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
        <line x1={0}   y1={s/2} x2={s*0.25} y2={s*0.75} stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
      </motion.svg>
    </div>
  );
};

const LightBg = ({ variant = 0 }: { variant?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <WireframeCube size={280} pos={{ top: -80, right: -60 }} duration={38} delay={0}  color="#000" opacity={0.065} />
    <WireframeDiamond size={160} pos={{ bottom: 60, left: 40 }}  duration={26} delay={5}  color="#000" opacity={0.07} />
    {variant === 0 && (
      <WireframeCube size={140} pos={{ top: "35%", right: "20%" }} duration={28} delay={10} color="#000" opacity={0.05} />
    )}
    {variant === 1 && (
      <WireframeDiamond size={220} pos={{ top: "15%", left: "25%" }} duration={32} delay={8}  color="#000" opacity={0.05} />
    )}
  </div>
);

const DarkBg = ({ variant = 0 }: { variant?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <WireframeCube size={320} pos={{ top: -100, left: -80 }} duration={42} delay={2}  color="#fff" opacity={0.07} />
    <WireframeDiamond size={180} pos={{ bottom: 50, right: 60 }} duration={28} delay={7}  color="#fff" opacity={0.075} />
    {variant === 0 && (
      <WireframeCube size={160} pos={{ top: "40%", right: "10%" }} duration={30} delay={14} color="#fff" opacity={0.055} />
    )}
    {variant === 1 && (
      <WireframeDiamond size={240} pos={{ top: "20%", right: "18%" }} duration={35} delay={6}  color="#fff" opacity={0.06} />
    )}
  </div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const { data: heroData } = useGetHero();
  const { data: projectsData } = useGetProjects();
  const { data: careerData } = useGetCareer();
  const { data: skillsData } = useGetSkills();
  const { data: closingData } = useGetClosing();
  const { data: settings } = useGetSettings();
  const { data: contactData } = useGetContact();

  const hero = heroData || {
    title: "양승우",
    subtitle: "Science Online Content Planner",
    description: "초·중·고 과학 교과서 개발 경험을 기반으로, 영상, 인터랙티브 콘텐츠, 디지털 교과서까지 확장하며 학습자의 이해 흐름을 중심으로 콘텐츠를 설계합니다.",
    profileImageUrl: `/images/profile.jpg`
  };

  const projects = Array.isArray(projectsData) && projectsData.length
  ? projectsData
  : [
    {
      id: 1,
      title: "과학 교과서 개발",
      category: "교과서 개발",
      summary: "교육과정 기반 개념 위계를 설계...",
      images: [{ url: `/images/project-1.png`, caption: "" }],
      tags: []
    },
    {
      id: 2,
      title: "디지털 콘텐츠 개발",
      category: "디지털 콘텐츠",
      summary: "영상, 인터랙티브 콘텐츠...",
      images: [{ url: `/images/project-2.png`, caption: "" }],
      tags: []
    },
    {
      id: 3,
      title: "디지털화 기획 경진대회 대상",
      category: "수상 / 기획",
      summary: "구독형 서비스 및 메타버스...",
      images: [{ url: `/images/project-3.png`, caption: "" }],
      tags: []
    }
  ];

  const career = careerData || {
    sectionTitle: "경력",
    entries: [
      { period: "2025.07 ~ 현재", company: "(주)대교", role: "수리개발팀 사원", description: "2022 개정 눈높이과학·써밋과학 교재 개발 및 동영상강의 교안 작성" }
    ]
  };

  const skills = skillsData || {
    sectionTitle: "Skills",
    skills: ["콘텐츠 기획", "스토리보드 작성", "교육과정 분석", "디지털 콘텐츠 설계", "UI/UX 협업", "영상 콘텐츠 기획"]
  };

  const closing = closingData || { text: "학습자는 정보를 '읽는 것'보다\n'경험하는 것'에서 더 깊이 이해한다고 생각합니다.\n\n저는 과학 개념을 전달하는 것을 넘어,\n학습자가 자연스럽게 이해할 수 있는 흐름을 설계하는\n콘텐츠 기획자가 되고자 합니다." };

  const contact = contactData || {
    sectionTitle: "Contact",
    email: "swyang.sci@gmail.com",
    phone: "",
    location: "서울, 대한민국",
    note: ""
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-16 overflow-hidden">
        <LightBg variant={0} />
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center relative z-10">
          {/* Text */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Portfolio
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              className="text-base md:text-lg font-medium text-muted-foreground mb-6 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              className="w-12 h-[2px] bg-foreground mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ originX: 0 }}
            />
            <motion.p
              className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {hero.description}
            </motion.p>
          </div>

          {/* Profile Image */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-2 relative w-full max-w-xs mx-auto lg:max-w-none"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              {hero.profileImageUrl && (
                <motion.img
                  src={hero.profileImageUrl}
                  alt="Profile"
                  className="object-cover w-full h-full monochrome-image"
                  style={{ y }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      {settings?.showCareerSection !== false && (
        <section id="projects" className="relative overflow-hidden py-24 px-6 md:px-16 bg-foreground text-background">
          <DarkBg variant={0} />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              className="flex items-baseline justify-between mb-16 border-b border-background/10 pb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Selected Works
              </h2>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Projects</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {projects.map((project, idx) => (
                <Link key={project.id} href={`/project/${project.id}`} className="group block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="relative overflow-hidden bg-white/5 mb-4 aspect-[4/3]">
                      <img
                        src={project.images?.[0]?.url || `/images/project-1.png`}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 monochrome-image"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors duration-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{project.category}</span>
                      <h3 className="text-base md:text-lg font-bold leading-snug group-hover:opacity-60 transition-opacity">{project.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.summary}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Project</span>
                      <span>→</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CAREER TIMELINE */}
      {settings?.showCareerSection !== false && (
        <section id="career" className="relative overflow-hidden py-24 px-6 md:px-16 bg-background">
          <LightBg variant={1} />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              className="flex items-baseline justify-between mb-16 border-b border-foreground/10 pb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                {career.sectionTitle}
              </h2>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Experience</span>
            </motion.div>

            <div className="space-y-0">
            {Array.isArray(career.entries) &&
              career.entries.map((entry, idx) => (
                <motion.div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 py-8 border-b border-foreground/8 last:border-b-0"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <div className="md:col-span-1 pt-0.5">
                    <span className="text-xs font-medium text-muted-foreground tracking-wide leading-relaxed">{entry.period}</span>
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="text-base font-bold mb-1 leading-snug">{entry.role}</h4>
                    <div className="text-sm font-semibold text-muted-foreground mb-3">{entry.company}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {settings?.showSkillsSection !== false && (
        <section id="skills" className="relative overflow-hidden py-24 px-6 md:px-16 bg-foreground text-background">
          <DarkBg variant={1} />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              className="flex items-baseline justify-between mb-12 border-b border-background/10 pb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                {skills.sectionTitle}
              </h2>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Competencies</span>
            </motion.div>
            <div className="flex flex-wrap gap-3">
            {Array.isArray(skills.skills) && 
              skills.skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block border border-background/20 px-4 py-2 text-sm font-medium hover:bg-background hover:text-foreground transition-colors cursor-default"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING */}
      {settings?.showClosingSection !== false && (
        <section className="relative overflow-hidden py-32 px-6 md:px-16 bg-background">
          <LightBg variant={1} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">Philosophy</p>
            <p className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed whitespace-pre-line">
              {closing.text}
            </p>
          </motion.div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden py-24 px-6 md:px-16 bg-foreground text-background">
        <DarkBg variant={1} />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="flex items-baseline justify-between mb-16 border-b border-background/10 pb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
              {contact.sectionTitle}
            </h2>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Get in Touch</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: contact info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {contact.email && (
                <div className="group">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-base md:text-lg font-medium hover:opacity-60 transition-opacity break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-base md:text-lg font-medium hover:opacity-60 transition-opacity">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.location && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Location</p>
                  <p className="text-base md:text-lg font-medium">{contact.location}</p>
                </div>
              )}
            </motion.div>

            {/* Right: note */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {contact.note && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Note</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{contact.note}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer line */}
          <motion.div
            className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              © {new Date().getFullYear()} {hero.title}
            </p>
            <Link href="/login" className="text-xs text-muted-foreground uppercase tracking-widest hover:opacity-60 transition-opacity">
              Admin
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
