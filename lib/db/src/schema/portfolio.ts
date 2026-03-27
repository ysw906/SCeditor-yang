import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heroTable = pgTable("hero", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  profileImageUrl: text("profile_image_url"),
  titleFontSize: text("title_font_size").default("text-5xl"),
  subtitleFontSize: text("subtitle_font_size").default("text-2xl"),
  descriptionFontSize: text("description_font_size").default("text-base"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  details: jsonb("details").notNull().default([]),
  images: jsonb("images").notNull().default([]),
  tags: jsonb("tags").notNull().default([]),
  titleFontSize: text("title_font_size").default("text-xl"),
  summaryFontSize: text("summary_font_size").default("text-sm"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  sectionTitle: text("section_title").notNull().default("Skills"),
  skills: jsonb("skills").notNull().default([]),
  titleFontSize: text("title_font_size").default("text-3xl"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const closingTable = pgTable("closing", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  fontSize: text("font_size").default("text-xl"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").notNull().default("Portfolio"),
  ownerName: text("owner_name").notNull().default("양승우"),
  baseFontSize: text("base_font_size").default("text-base"),
  accentColor: text("accent_color").default("#000000"),
  showCareerSection: boolean("show_career_section").notNull().default(true),
  showSkillsSection: boolean("show_skills_section").notNull().default(true),
  showClosingSection: boolean("show_closing_section").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const careerTable = pgTable("career", {
  id: serial("id").primaryKey(),
  sectionTitle: text("section_title").notNull().default("Experience"),
  entries: jsonb("entries").notNull().default([]),
  titleFontSize: text("title_font_size").default("text-3xl"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHeroSchema = createInsertSchema(heroTable).omit({ id: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, updatedAt: true });
export const insertSkillsSchema = createInsertSchema(skillsTable).omit({ id: true, updatedAt: true });
export const insertClosingSchema = createInsertSchema(closingTable).omit({ id: true, updatedAt: true });
export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export const insertCareerSchema = createInsertSchema(careerTable).omit({ id: true, updatedAt: true });

export type Hero = typeof heroTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type Skills = typeof skillsTable.$inferSelect;
export type Closing = typeof closingTable.$inferSelect;
export type Settings = typeof settingsTable.$inferSelect;
export type Career = typeof careerTable.$inferSelect;
