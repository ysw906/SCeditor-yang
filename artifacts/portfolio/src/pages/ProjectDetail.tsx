import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProject } from "@workspace/api-client-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, isLoading } = useGetProject(Number(id), { query: { retry: false } });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-display text-2xl uppercase tracking-widest">
        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Loading
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-display">
        <h1 className="text-4xl mb-4 uppercase">Project Not Found</h1>
        <Link href="/" className="font-sans text-sm uppercase tracking-widest underline underline-offset-4">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Huge Header */}
      <div className="pt-40 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-8xl lg:text-9xl font-display uppercase tracking-tighter leading-[0.85] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ fontSize: project.titleFontSize }}
        >
          {project.title}
        </motion.h1>
        
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-foreground/10 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="max-w-xl font-sans text-lg md:text-xl font-light leading-relaxed" style={{ fontSize: project.summaryFontSize }}>
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-sans font-semibold uppercase tracking-widest">
            <span className="bg-foreground text-background px-4 py-2">{project.category}</span>
            {project.tags?.map(tag => (
              <span key={tag} className="border border-foreground/20 px-4 py-2">{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Image */}
      {project.images?.[0] && (
        <motion.div 
          className="w-full h-[60vh] md:h-[80vh] bg-muted mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <img 
            src={project.images[0].url} 
            alt={project.images[0].caption || project.title} 
            className="w-full h-full object-cover monochrome-image"
            style={{ objectPosition: project.images[0].position || 'center' }}
          />
        </motion.div>
      )}

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-32">
        {project.details?.map((section, sIdx) => (
          <motion.div 
            key={sIdx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-8 pb-4 border-b border-foreground/10">{section.heading}</h2>
            <div className="space-y-6 text-lg font-sans font-light leading-relaxed">
              {section.items?.map((item, iIdx) => (
                <p key={iIdx}>{item}</p>
              ))}
            </div>

            {section.subSections && section.subSections.length > 0 && (
              <div className="mt-16 space-y-12 pl-4 md:pl-12 border-l border-foreground/10">
                {section.subSections.map((sub, ssIdx) => (
                  <div key={ssIdx}>
                    <h3 className="font-display text-2xl uppercase tracking-tight mb-4">{sub.title}</h3>
                    <div className="space-y-4 text-base font-sans font-light leading-relaxed text-muted-foreground">
                      {sub.items?.map((item, iIdx) => (
                        <p key={iIdx}>{item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Remaining Images */}
        {project.images?.slice(1).map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-auto bg-muted monochrome-image"
              style={{ objectPosition: img.position || 'center' }}
            />
            {img.caption && (
              <p className="mt-4 text-sm font-sans text-muted-foreground uppercase tracking-widest text-center">
                {img.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Next Project / Footer area */}
      <div className="mt-40 border-t border-foreground/10 pt-16 text-center px-6">
        <Link href="/" className="inline-block font-display text-4xl md:text-6xl uppercase tracking-tighter hover:text-muted-foreground transition-colors">
          Back to Index
        </Link>
      </div>
    </div>
  );
}
