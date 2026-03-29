import { Router, type IRouter } from "express";
import type { RequestHandler } from "express";
import { db } from "@workspace/db";
import {
  heroTable, projectsTable, skillsTable, closingTable, settingsTable, careerTable, contactTable
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  const session = req.session as any;
  if (!session.userId || !session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

router.get("/hero", (async (_req, res) => {
  const rows = await db.select().from(heroTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      title: "양승우",
      subtitle: "Science Online Content Planner",
      description: "초·중·고 과학 교과서 개발 경험을 기반으로,\n영상, 인터랙티브 콘텐츠, 디지털 교과서까지 확장하며\n학습자의 이해 흐름을 중심으로 콘텐츠를 설계합니다.",
      profileImageUrl: null,
      titleFontSize: "text-6xl",
      subtitleFontSize: "text-2xl",
      descriptionFontSize: "text-base",
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/hero", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(heroTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(heroTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(heroTable).set({ ...body, updatedAt: new Date() }).where(eq(heroTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);

router.get("/projects", (async (_req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(projectsTable.sortOrder);
  return res.json(rows);
}) as RequestHandler);

router.post("/projects", requireAdmin, (async (req, res) => {
  const body = req.body;
  const inserted = await db.insert(projectsTable).values(body).returning();
  return res.status(201).json(inserted[0]);
}) as RequestHandler);

router.get("/projects/:id", (async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Project not found" });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/projects/:id", requireAdmin, (async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body;
  const updated = await db.update(projectsTable).set({ ...body, updatedAt: new Date() }).where(eq(projectsTable.id, id)).returning();
  if (updated.length === 0) {
    return res.status(404).json({ error: "Project not found" });
  }
  return res.json(updated[0]);
}) as RequestHandler);

router.delete("/projects/:id", requireAdmin, (async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  return res.json({ success: true, message: "Project deleted" });
}) as RequestHandler);

router.get("/skills", (async (_req, res) => {
  const rows = await db.select().from(skillsTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      sectionTitle: "Skills",
      skills: ["콘텐츠 기획", "스토리보드 작성", "교육과정 분석", "디지털 콘텐츠 설계", "UI/UX 협업", "영상 콘텐츠 기획"],
      titleFontSize: "text-3xl",
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/skills", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(skillsTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(skillsTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(skillsTable).set({ ...body, updatedAt: new Date() }).where(eq(skillsTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);

router.get("/closing", (async (_req, res) => {
  const rows = await db.select().from(closingTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      text: "학습자는 정보를 '읽는 것'보다\n'경험하는 것'에서 더 깊이 이해한다고 생각합니다.\n\n저는 과학 개념을 전달하는 것을 넘어,\n학습자가 자연스럽게 이해할 수 있는 흐름을 설계하는\n콘텐츠 기획자가 되고자 합니다.",
      fontSize: "text-xl",
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/closing", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(closingTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(closingTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(closingTable).set({ ...body, updatedAt: new Date() }).where(eq(closingTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);

router.get("/settings", (async (_req, res) => {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      siteTitle: "양승우 포트폴리오",
      ownerName: "양승우",
      baseFontSize: "text-base",
      accentColor: "#000000",
      showCareerSection: true,
      showSkillsSection: true,
      showClosingSection: true,
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/settings", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(settingsTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(settingsTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(settingsTable).set({ ...body, updatedAt: new Date() }).where(eq(settingsTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);

router.get("/career", (async (_req, res) => {
  const rows = await db.select().from(careerTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      sectionTitle: "경력",
      entries: [
        {
          period: "2025.07 ~ 현재",
          company: "(주)대교",
          role: "수리개발팀 사원",
          description: "2022 개정 눈높이과학·써밋과학 교재 개발 및 동영상강의 교안 작성",
          sortOrder: 1
        },
        {
          period: "2024.02 ~ 2025.05",
          company: "동아출판(주)",
          role: "초등과학팀 대리 파트장",
          description: "2022 개정 초등과학 검정도서 물리 영역 개발 총괄, 두클래스 디지털 콘텐츠 기획 및 개발",
          sortOrder: 2
        },
        {
          period: "2022.10 ~ 2024.02",
          company: "(주)비상교육",
          role: "초등과학Cell 대리",
          description: "2022 개정 초등과학 3~6학년 검정도서 개발, 물리 단원 원고 작업",
          sortOrder: 3
        },
        {
          period: "2021.06 ~ 2022.10",
          company: "(주)비상교과서",
          role: "과학교과서2Cell 대리",
          description: "2015 개정 초등·중고등 과학 검정도서 물리영역 개발 및 디지털교과서 개발",
          sortOrder: 4
        },
        {
          period: "2017.06 ~ 2021.06",
          company: "(주)비상교육",
          role: "국정교과서Cell 대리",
          description: "2015 개정 고등·초등과학 검정·국정도서 개발, 물리 영역 개발 총괄",
          sortOrder: 5
        }
      ],
      titleFontSize: "text-3xl"
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/career", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(careerTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(careerTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(careerTable).set({ ...body, updatedAt: new Date() }).where(eq(careerTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);

export default router;

router.get("/contact", (async (_req, res) => {
  const rows = await db.select().from(contactTable).limit(1);
  if (rows.length === 0) {
    return res.json({
      sectionTitle: "Contact",
      email: "swyang.sci@gmail.com",
      phone: "",
      location: "서울, 대한민국",
      links: [],
      note: ""
    });
  }
  return res.json(rows[0]);
}) as RequestHandler);

router.put("/contact", requireAdmin, (async (req, res) => {
  const body = req.body;
  const rows = await db.select().from(contactTable).limit(1);
  let result;
  if (rows.length === 0) {
    const inserted = await db.insert(contactTable).values(body).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(contactTable).set({ ...body, updatedAt: new Date() }).where(eq(contactTable.id, rows[0].id)).returning();
    result = updated[0];
  }
  return res.json(result);
}) as RequestHandler);
