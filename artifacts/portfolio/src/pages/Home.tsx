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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: heroData } = useGetHero();
  const { data: projectsData } = useGetProjects();
  const { data: careerData } = useGetCareer();
  const { data: skillsData } = useGetSkills();
  const { data: closingData } = useGetClosing();
  const { data: settings } = useGetSettings();

  // Fallbacks if DB is empty
  const hero = heroData || {
    title: "SCIENCE ONLINE CONTENT PLANNER",
    subtitle: "Bridging the gap between complex science and public curiosity.",
    description: "Dedicated content planner specializing in transforming intricate scientific concepts into engaging, accessible online narratives. Welcome to my portfolio.",
    profileImageUrl: `${import.meta.env.BASE_URL}images/hero-profile.png`
  };

  const projects = projectsData?.length ? projectsData : [
    { id: 1, title: "Quantum Physics Series", category: "Video Production", summary: "A 5-part series explaining quantum mechanics.", images: [{ url: `${import.meta.env.BASE_URL}images/project-1.png`, caption: "" }], tags: [] },
    { id: 2, title: "Lab Explorations", category: "Editorial", summary: "Inside the world's most advanced laboratories.", images: [{ url: `${import.meta.env.BASE_URL}images/project-2.png`, caption: "" }], tags: [] },
    { id: 3, title: "Data Visualization", category: "Interactive", summary: "Making genomic data easy to understand.", images: [{ url: `${import.meta.env.BASE_URL}images/project-3.png`, caption: "" }], tags: [] },
  ];

  const career = careerData || {
    sectionTitle: "Professional Journey",
    entries: [
      { period: "2021 - Present", company: "Science Media Co.", role: "Lead Content Planner", description: "Orchestrating digital science campaigns and managing a team of writers." }
    ]
  };

  const skills = skillsData || {
    sectionTitle: "Core Competencies",
    skills: ["Content Strategy", "Scientific Writing", "Video Production", "Data Visualization", "SEO", "Public Speaking"]
  };

  const closing = closingData || { text: "Science is not just a subject, it's a way of looking at the world." };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-foreground z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <motion.h1 
              className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9] mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: hero.titleFontSize }}
            >
              {hero.title}
            </motion.h1>
            <motion.p 
              className="font-sans text-lg md:text-xl font-light tracking-wide mb-6 uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontSize: hero.subtitleFontSize }}
            >
              {hero.subtitle}
            </motion.p>
            <motion.p 
              className="font-sans text-base max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ fontSize: hero.descriptionFontSize }}
            >
              {hero.description}
            </motion.p>
          </div>
          <motion.div 
            className="order-1 lg:order-2 relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden bg-muted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {hero.profileImageUrl && (
              <motion.img 
                src={hero.profileImageUrl} 
                alt="Profile" 
                className="object-cover w-full h-full monochrome-image"
                style={{ y }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      {settings?.showCareerSection !== false && (
        <section id="projects" className="py-32 px-6 md:px-12 bg-foreground text-background">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="font-display text-4xl md:text-6xl uppercase tracking-tighter mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Selected Works
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              {projects.map((project, idx) => {
                const colSpan = idx % 3 === 0 ? "md:col-span-8" : idx % 3 === 1 ? "md:col-span-4 mt-0 md:mt-32" : "md:col-span-12";
                return (
                  <Link key={project.id} href={`/project/${project.id}`} className={cn("group block", colSpan)}>
                    <motion.div 
                      className="relative overflow-hidden bg-muted mb-6 aspect-[4/3]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      <img 
                        src={project.images?.[0]?.url || `${import.meta.env.BASE_URL}images/project-1.png`} 
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105 monochrome-image"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors duration-500" />
                    </motion.div>
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-2 group-hover:text-muted-foreground transition-colors">{project.title}</h3>
                        <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest">{project.category}</p>
                      </div>
                      <span className="font-sans text-xs uppercase tracking-widest border border-background/20 px-4 py-2 group-hover:bg-background group-hover:text-foreground transition-colors">
                        View Project
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CAREER TIMELINE */}
      {settings?.showCareerSection !== false && (
        <section id="career" className="py-32 px-6 md:px-12 bg-background">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="font-display text-4xl md:text-6xl uppercase tracking-tighter mb-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {career.sectionTitle}
            </motion.h2>

            <div className="border-l border-foreground/20 pl-8 md:pl-12 space-y-24 ml-4 md:ml-0">
              {career.entries.map((entry, idx) => (
                <motion.div 
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="absolute -left-[41px] md:-left-[57px] top-1 w-4 h-4 bg-background border-2 border-foreground rounded-full" />
                  <div className="text-sm font-sans uppercase tracking-widest text-muted-foreground mb-4">{entry.period}</div>
                  <h4 className="font-display text-3xl md:text-4xl mb-2 uppercase tracking-tight">{entry.role}</h4>
                  <div className="font-sans font-bold text-lg mb-6 uppercase tracking-widest">{entry.company}</div>
                  <p className="font-sans text-muted-foreground leading-relaxed max-w-2xl">{entry.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {settings?.showSkillsSection !== false && (
        <section id="skills" className="py-32 px-6 md:px-12 bg-foreground text-background overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2 
              className="font-sans text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {skills.sectionTitle}
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-16 md:gap-y-8">
              {skills.skills.map((skill, idx) => (
                <motion.span 
                  key={idx} 
                  className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter hover:text-muted-foreground transition-colors cursor-default"
                  initial={{ opacity: 0, y: 20 }}
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
        <section className="py-48 px-6 md:px-12 bg-background flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <h2 
              className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight"
              style={{ fontSize: closing.fontSize }}
            >
              "{closing.text}"
            </h2>
          </motion.div>
        </section>
      )}
    </div>
  );
}
