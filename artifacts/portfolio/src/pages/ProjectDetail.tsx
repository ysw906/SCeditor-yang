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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-sm uppercase tracking-widest">
        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4 uppercase">Project Not Found</h1>
        <Link href="/" className="text-sm uppercase tracking-widest underline underline-offset-4">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 md:px-16 max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {project.title}
        </motion.h1>
        
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-foreground/10 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="max-w-xl text-sm md:text-base font-normal leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest">
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
      <div className="max-w-4xl mx-auto px-6 md:px-16 space-y-16">
        {project.details?.map((section, sIdx) => (
          <motion.div
            key={sIdx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-6 pb-4 border-b border-foreground/10">{section.heading}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.items?.map((item, iIdx) => (
                <p key={iIdx}>{item}</p>
              ))}
            </div>

            {section.subSections && section.subSections.length > 0 && (
              <div className="mt-8 space-y-8 pl-4 md:pl-8 border-l-2 border-foreground/8">
                {section.subSections.map((sub, ssIdx) => (
                  <div key={ssIdx}>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3">{sub.title}</h3>
                    <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {sub.items?.map((item, iIdx) => (
                        <p key={iIdx}>— {item}</p>
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
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img
              src={img.url}
              alt={img.caption}
              className="w-full h-auto bg-muted monochrome-image"
              style={{ objectPosition: img.position || 'center' }}
            />
            {img.caption && (
              <p className="mt-3 text-xs text-muted-foreground uppercase tracking-widest text-center">
                {img.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-24 border-t border-foreground/10 pt-12 text-center px-6">
        <Link href="/" className="inline-block text-sm font-semibold uppercase tracking-widest hover:opacity-50 transition-opacity">
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
