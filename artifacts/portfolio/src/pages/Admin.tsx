import { useState, useEffect, useRef, useCallback } from "react";
import {
  useGetMe, useLogout,
  useGetHero, useUpdateHero,
  useGetProjects, useCreateProject, useUpdateProject, useDeleteProject,
  useGetCareer, useUpdateCareer,
  useGetSkills, useUpdateSkills,
  useGetClosing, useUpdateClosing,
  useGetSettings, useUpdateSettings
} from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button, Input, Textarea, Label } from "@/components/UI";

const TABS = ['Hero', 'Projects', 'Career', 'Skills', 'Closing', 'Settings'];

const POSITION_PRESETS = [
  ["top left",    "top center",    "top right"],
  ["center left", "center",        "center right"],
  ["bottom left", "bottom center", "bottom right"],
];

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

function ImagePositionPicker({
  position,
  onChange,
}: {
  position: string;
  onChange: (pos: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">이미지 위치</Label>
      <div className="grid grid-cols-3 gap-1 w-32">
        {POSITION_PRESETS.flat().map((pos) => (
          <button
            key={pos}
            type="button"
            title={pos}
            onClick={() => onChange(pos)}
            className={`h-8 w-full border text-[9px] uppercase transition-colors ${
              position === pos
                ? "bg-foreground text-background border-foreground"
                : "bg-background hover:bg-accent border-border"
            }`}
          >
            {pos === "center" ? "●" :
             pos.includes("top") ? "↑" :
             pos.includes("bottom") ? "↓" :
             pos.includes("left") ? "←" :
             pos.includes("right") ? "→" : "·"}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={position}
        onChange={e => onChange(e.target.value)}
        placeholder="예: 50% 30%"
        className="w-full border border-border bg-background text-xs px-2 py-1 font-mono mt-1"
      />
    </div>
  );
}

function SingleImageEditor({
  image,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  index,
}: {
  image: { url: string; caption?: string; position?: string };
  onChange: (img: typeof image) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  index: number;
}) {
  const position = image.position || "center";
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange({ ...image, url });
    } catch {
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          이미지 {index + 1} {index === 0 ? "(메인)" : ""}
        </span>
        <div className="flex gap-1">
          <button type="button" onClick={onMoveUp} disabled={isFirst} className="px-2 py-1 text-xs border disabled:opacity-30 hover:bg-accent">↑</button>
          <button type="button" onClick={onMoveDown} disabled={isLast} className="px-2 py-1 text-xs border disabled:opacity-30 hover:bg-accent">↓</button>
          <button type="button" onClick={onDelete} className="px-2 py-1 text-xs border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">삭제</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Preview */}
        <div className="space-y-2">
          <Label className="text-xs">미리보기</Label>
          <div className="relative w-full aspect-video bg-muted border border-border overflow-hidden">
            {image.url ? (
              <img
                src={image.url}
                alt="preview"
                className="w-full h-full object-cover transition-all duration-300"
                style={{ objectPosition: position }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground uppercase tracking-widest">
                이미지 없음
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest border border-foreground bg-background hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
            >
              {uploading ? "업로드 중..." : "📁 파일 선택"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ImagePositionPicker
            position={position}
            onChange={pos => onChange({ ...image, position: pos })}
          />
          <div className="space-y-2">
            <Label className="text-xs">캡션 (선택)</Label>
            <Input
              value={image.caption || ""}
              onChange={e => onChange({ ...image, caption: e.target.value })}
              placeholder="이미지 설명..."
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">URL (직접 입력)</Label>
            <Input
              value={image.url}
              onChange={e => onChange({ ...image, url: e.target.value })}
              placeholder="/images/..."
              className="text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageListEditor({
  images,
  onChange,
}: {
  images: { url: string; caption?: string; position?: string }[];
  onChange: (imgs: typeof images) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const addImage = (url: string) => {
    onChange([...images, { url, caption: "", position: "center" }]);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadFile(file);
        addImage(url);
      }
    } catch {
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  }, [images]);

  const handleFileAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadFile(file);
        addImage(url);
      }
    } catch {
      alert("업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>이미지 ({images.length}장)</Label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-xs font-semibold uppercase tracking-widest px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "+ 이미지 추가"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileAdd} />
      </div>

      {/* Drop Zone */}
      <div
        ref={dropRef}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-none py-6 text-center text-xs uppercase tracking-widest transition-colors cursor-pointer ${
          dragging ? "border-foreground bg-accent" : "border-border text-muted-foreground"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? "업로드 중..." : "파일을 여기에 드래그하거나 클릭해서 추가"}
      </div>

      <div className="space-y-3">
        {images.map((img, idx) => (
          <SingleImageEditor
            key={idx}
            index={idx}
            image={img}
            isFirst={idx === 0}
            isLast={idx === images.length - 1}
            onChange={updated => {
              const next = [...images];
              next[idx] = updated;
              onChange(next);
            }}
            onDelete={() => onChange(images.filter((_, i) => i !== idx))}
            onMoveUp={() => {
              if (idx === 0) return;
              const next = [...images];
              [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
              onChange(next);
            }}
            onMoveDown={() => {
              if (idx === images.length - 1) return;
              const next = [...images];
              [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroImageUploader({
  url,
  onChange,
}: {
  url: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded);
    } catch {
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <div className="w-32 h-40 bg-muted border border-border overflow-hidden flex-shrink-0">
          {url ? (
            <img src={url} alt="profile" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">없음</div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label className="text-xs">프로필 사진</Label>
          <Input
            value={url}
            onChange={e => onChange(e.target.value)}
            placeholder="/images/profile.jpg"
            className="text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-2 text-xs font-semibold uppercase tracking-widest border border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : "📁 사진 업로드"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

const JsonEditor = ({ value, onChange, label }: { value: any; onChange: (val: any) => void; label: string }) => {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    try {
      onChange(JSON.parse(e.target.value));
      setError("");
    } catch {
      setError("JSON 형식 오류");
    }
  };

  useEffect(() => { setText(JSON.stringify(value, null, 2)); }, [value]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={text} onChange={handleChange} className="font-mono text-xs min-h-[160px]" />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const logoutMut = useLogout();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  useEffect(() => {
    if (!userLoading && (!user?.isLoggedIn || !user?.isAdmin)) {
      setLocation("/login");
    }
  }, [userLoading, user, setLocation]);

  if (userLoading) return <div className="p-8 text-sm uppercase tracking-widest">Loading...</div>;
  if (!user?.isLoggedIn || !user?.isAdmin) return null;

  const handleLogout = () => {
    logoutMut.mutate(undefined, { onSuccess: () => { window.location.href = "/login"; } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-56 border-r border-border bg-card p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Admin Panel</h2>
          <nav className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  activeTab === tab ? "bg-foreground text-background" : "hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8 space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full text-xs">← 사이트 보기</Button>
          </Link>
          <Button variant="ghost" className="w-full text-xs text-destructive hover:text-destructive" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold uppercase tracking-tight mb-6 border-b pb-4">{activeTab} 편집</h1>
          {activeTab === "Hero" && <HeroEditor />}
          {activeTab === "Projects" && <ProjectsEditor />}
          {activeTab === "Career" && <CareerEditor />}
          {activeTab === "Skills" && <SkillsEditor />}
          {activeTab === "Closing" && <ClosingEditor />}
          {activeTab === "Settings" && <SettingsEditor />}
        </div>
      </main>
    </div>
  );
}

function HeroEditor() {
  const { data, refetch } = useGetHero({ query: { retry: false } });
  const mutation = useUpdateHero();
  const [form, setForm] = useState(
    data || { title: "", subtitle: "", description: "", profileImageUrl: "", titleFontSize: "", subtitleFontSize: "", descriptionFontSize: "" }
  );

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <HeroImageUploader
        url={form.profileImageUrl || ""}
        onChange={url => setForm({ ...form, profileImageUrl: url })}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>이름 / 타이틀</Label>
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>서브타이틀</Label>
          <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>소개 문구</Label>
          <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
      {mutation.isSuccess && <p className="text-xs text-green-600">저장됐습니다</p>}
    </form>
  );
}

function ProjectsEditor() {
  const { data: projects, refetch } = useGetProjects();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const createMut = useCreateProject();
  const updateMut = useUpdateProject();
  const deleteMut = useDeleteProject();

  const handleSave = (projectData: any) => {
    if (projectData.id) {
      updateMut.mutate({ id: projectData.id, data: projectData }, { onSuccess: () => { refetch(); setEditingIndex(null); } });
    } else {
      createMut.mutate({ data: projectData }, { onSuccess: () => { refetch(); setEditingIndex(null); } });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMut.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  if (editingIndex !== null) {
    const isNew = editingIndex === -1;
    const initialData = isNew
      ? { title: "새 프로젝트", summary: "", category: "", sortOrder: 0, tags: [], images: [], details: [] }
      : projects?.[editingIndex];

    return (
      <ProjectForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => setEditingIndex(null)}
        isPending={createMut.isPending || updateMut.isPending}
      />
    );
  }

  return (
    <div>
      <Button onClick={() => setEditingIndex(-1)} className="mb-6">+ 새 프로젝트</Button>
      <div className="space-y-3">
        {projects?.sort((a, b) => a.sortOrder - b.sortOrder).map((p, idx) => (
          <div key={p.id} className="flex items-center gap-4 p-4 border bg-card">
            {p.images?.[0]?.url && (
              <img src={p.images[0].url} alt={p.title} className="w-16 h-12 object-cover flex-shrink-0 monochrome-image" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm uppercase tracking-tight truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.category} · 순서 {p.sortOrder} · 이미지 {p.images?.length || 0}장</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditingIndex(idx)}>편집</Button>
              <Button variant="ghost" size="sm" className="text-destructive border border-destructive" onClick={() => handleDelete(p.id)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ initialData, onSave, onCancel, isPending }: any) {
  const [form, setForm] = useState(initialData);
  const [activeSection, setActiveSection] = useState<"basic" | "images" | "details">("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-tight">{form.title || "프로젝트 편집"}</h2>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>취소</Button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["basic", "images", "details"] as const).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest -mb-px border-b-2 transition-colors ${
              activeSection === s ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "basic" ? "기본 정보" : s === "images" ? `이미지 (${form.images?.length || 0})` : "상세 내용"}
          </button>
        ))}
      </div>

      {activeSection === "basic" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>카테고리</Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>한 줄 설명</Label>
              <Textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>정렬 순서</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) })} required />
            </div>
          </div>
          <JsonEditor label="태그 (문자열 배열)" value={form.tags} onChange={val => setForm({ ...form, tags: val })} />
        </div>
      )}

      {activeSection === "images" && (
        <ImageListEditor
          images={form.images || []}
          onChange={imgs => setForm({ ...form, images: imgs })}
        />
      )}

      {activeSection === "details" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            각 섹션은 {"{ heading, items[], subSections[] }"} 형태입니다. subSections는 {"{ title, items[] }"} 배열입니다.
          </p>
          <JsonEditor label="상세 섹션" value={form.details} onChange={val => setForm({ ...form, details: val })} />
        </div>
      )}

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={isPending}>{isPending ? "저장 중..." : "저장"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}

function CareerEditor() {
  const { data, refetch } = useGetCareer({ query: { retry: false } });
  const mutation = useUpdateCareer();
  const [form, setForm] = useState(data || { sectionTitle: "경력", entries: [] });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>섹션 제목</Label>
        <Input value={form.sectionTitle} onChange={e => setForm({ ...form, sectionTitle: e.target.value })} />
      </div>
      <JsonEditor label="경력 항목 (period, company, role, description, sortOrder)" value={form.entries} onChange={val => setForm({ ...form, entries: val })} />
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
      {mutation.isSuccess && <p className="text-xs text-green-600">저장됐습니다</p>}
    </form>
  );
}

function SkillsEditor() {
  const { data, refetch } = useGetSkills({ query: { retry: false } });
  const mutation = useUpdateSkills();
  const [form, setForm] = useState(data || { sectionTitle: "역량", skills: [] });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>섹션 제목</Label>
        <Input value={form.sectionTitle} onChange={e => setForm({ ...form, sectionTitle: e.target.value })} />
      </div>
      <JsonEditor label="스킬 목록 (문자열 배열)" value={form.skills} onChange={val => setForm({ ...form, skills: val })} />
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
      {mutation.isSuccess && <p className="text-xs text-green-600">저장됐습니다</p>}
    </form>
  );
}

function ClosingEditor() {
  const { data, refetch } = useGetClosing({ query: { retry: false } });
  const mutation = useUpdateClosing();
  const [form, setForm] = useState(data || { text: "", fontSize: "" });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>마무리 문구</Label>
        <Textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="h-32" />
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
      {mutation.isSuccess && <p className="text-xs text-green-600">저장됐습니다</p>}
    </form>
  );
}

function SettingsEditor() {
  const { data, refetch } = useGetSettings({ query: { retry: false } });
  const mutation = useUpdateSettings();
  const [form, setForm] = useState(
    data || { siteTitle: "Portfolio", ownerName: "Admin", showCareerSection: true, showSkillsSection: true, showClosingSection: true }
  );

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>사이트 제목</Label>
          <Input value={form.siteTitle} onChange={e => setForm({ ...form, siteTitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>이름</Label>
          <Input value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} />
        </div>
      </div>
      <div className="space-y-3 p-5 border bg-card">
        <h3 className="text-sm font-bold uppercase tracking-tight">섹션 표시</h3>
        {[
          { key: "showCareerSection", label: "경력 섹션 표시" },
          { key: "showSkillsSection", label: "역량 섹션 표시" },
          { key: "showClosingSection", label: "마무리 문구 표시" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.checked })}
              className="w-4 h-4 accent-foreground"
            />
            <span className="text-xs uppercase tracking-widest">{label}</span>
          </label>
        ))}
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : "저장"}</Button>
      {mutation.isSuccess && <p className="text-xs text-green-600">저장됐습니다</p>}
    </form>
  );
}
