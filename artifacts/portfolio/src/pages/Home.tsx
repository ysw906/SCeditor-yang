import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  useGetHero,
  useGetProjects,
  useGetCareer,
  useGetSkills,
  useGetClosing,
  useGetSettings
} from "@workspace/api-client-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const { data: heroData } = useGetHero();
  const { data: projectsData } = useGetProjects();
  const { data: careerData } = useGetCareer();
  const { data: skillsData } = useGetSkills();
  const { data: closingData } = useGetClosing();
  const { data: settings } = useGetSettings();

  const hero = heroData || {
    title: "양승우",
    subtitle: "Science Online Content Planner",
    description: "초·중·고 과학 교과서 개발 경험을 기반으로, 영상, 인터랙티브 콘텐츠, 디지털 교과서까지 확장하며 학습자의 이해 흐름을 중심으로 콘텐츠를 설계합니다.",
    profileImageUrl: `/images/profile.jpg`
  };

  const projects = projectsData?.length ? projectsData : [
    { id: 1, title: "과학 교과서 개발", category: "교과서 개발", summary: "교육과정 기반 개념 위계를 설계하고 학습 흐름 중심으로 교과서를 개발한 프로젝트", images: [{ url: `/images/project-1.png`, caption: "" }], tags: [] },
    { id: 2, title: "디지털 콘텐츠 개발", category: "디지털 콘텐츠", summary: "영상, 인터랙티브 콘텐츠, 디지털 교과서를 학습 흐름에 맞춰 설계한 프로젝트", images: [{ url: `/images/project-2.png`, caption: "" }], tags: [] },
    { id: 3, title: "디지털화 기획 경진대회 대상", category: "수상 / 기획", summary: "사내 출판의 디지털화를 도모하기 위한 구독형 서비스 및 메타버스 플랫폼 기획안", images: [{ url: `/images/project-3.png`, caption: "" }], tags: [] },
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

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-16 overflow-hidden">
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
        <section id="projects" className="py-24 px-6 md:px-16 bg-foreground text-background">
          <div className="max-w-6xl mx-auto">
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
        <section id="career" className="py-24 px-6 md:px-16 bg-background">
          <div className="max-w-4xl mx-auto">
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
              {career.entries.map((entry, idx) => (
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
        <section id="skills" className="py-24 px-6 md:px-16 bg-foreground text-background">
          <div className="max-w-6xl mx-auto">
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
              {skills.skills.map((skill, idx) => (
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
        <section className="py-32 px-6 md:px-16 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">Philosophy</p>
            <p
              className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed whitespace-pre-line"
            >
              {closing.text}
            </p>
          </motion.div>
        </section>
      )}
    </div>
  );
}
