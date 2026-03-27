import { useState, useEffect } from "react";
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

// A helper for robust JSON editing to handle complex arrays (details, images, tags) safely
const JsonEditor = ({ value, onChange, label }: { value: any, onChange: (val: any) => void, label: string }) => {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      onChange(parsed);
      setError('');
    } catch {
      setError('Invalid JSON');
    }
  };

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]); // Sync if external changes happen

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={text} onChange={handleChange} className="font-mono text-xs min-h-[200px]" />
      {error && <p className="text-destructive text-xs font-sans">{error}</p>}
    </div>
  );
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  const logoutMut = useLogout();
  
  const [activeTab, setActiveTab] = useState(TABS[0]);

  if (userLoading) return <div className="p-8 font-display uppercase">Loading...</div>;
  
  if (!user?.isLoggedIn || !user?.isAdmin) {
    setLocation("/login");
    return null;
  }

  const handleLogout = () => {
    logoutMut.mutate(undefined, {
      onSuccess: () => { window.location.href = "/login"; }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col justify-between">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tighter mb-8">Admin Panel</h2>
          <nav className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                  activeTab === tab ? 'bg-foreground text-background' : 'hover:bg-accent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-12 space-y-4">
          <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>View Site</Button>
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl uppercase tracking-tight mb-8 border-b pb-4">{activeTab} Editor</h1>
          
          {activeTab === 'Hero' && <HeroEditor />}
          {activeTab === 'Projects' && <ProjectsEditor />}
          {activeTab === 'Career' && <CareerEditor />}
          {activeTab === 'Skills' && <SkillsEditor />}
          {activeTab === 'Closing' && <ClosingEditor />}
          {activeTab === 'Settings' && <SettingsEditor />}
        </div>
      </main>
    </div>
  );
}

// --- Specific Editors ---

function HeroEditor() {
  const { data, refetch } = useGetHero({ query: { retry: false } });
  const mutation = useUpdateHero();
  const [form, setForm] = useState(data || { title: '', subtitle: '', description: '', profileImageUrl: '', titleFontSize: '', subtitleFontSize: '', descriptionFontSize: '' });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Title Font Size</Label>
          <Input placeholder="e.g. 5rem, clamp(3rem, 5vw, 6rem)" value={form.titleFontSize || ''} onChange={e => setForm({...form, titleFontSize: e.target.value})} />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Subtitle</Label>
          <Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Subtitle Font Size</Label>
          <Input value={form.subtitleFontSize || ''} onChange={e => setForm({...form, subtitleFontSize: e.target.value})} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Description Font Size</Label>
          <Input value={form.descriptionFontSize || ''} onChange={e => setForm({...form, descriptionFontSize: e.target.value})} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Profile Image URL</Label>
          <Input value={form.profileImageUrl || ''} onChange={e => setForm({...form, profileImageUrl: e.target.value})} />
        </div>
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Hero"}</Button>
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
      updateMut.mutate({ id: projectData.id, data: projectData }, { onSuccess: () => { refetch(); setEditingIndex(null); }});
    } else {
      createMut.mutate({ data: projectData }, { onSuccess: () => { refetch(); setEditingIndex(null); }});
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteMut.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  if (editingIndex !== null) {
    const isNew = editingIndex === -1;
    const initialData = isNew ? { title: 'New Project', summary: '', category: '', sortOrder: 0, tags: [], images: [], details: [] } : projects?.[editingIndex];
    
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
      <Button onClick={() => setEditingIndex(-1)} className="mb-8">Create New Project</Button>
      <div className="space-y-4">
        {projects?.sort((a, b) => a.sortOrder - b.sortOrder).map((p, idx) => (
          <div key={p.id} className="flex items-center justify-between p-4 border bg-card">
            <div>
              <div className="font-display text-xl uppercase tracking-tight">{p.title}</div>
              <div className="text-xs text-muted-foreground uppercase">{p.category} • Order: {p.sortOrder}</div>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setEditingIndex(idx)}>Edit</Button>
              <Button variant="ghost" className="text-destructive border-destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ initialData, onSave, onCancel, isPending }: any) {
  const [form, setForm] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase tracking-tighter">Editing Project</h2>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Summary</Label>
          <Textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} required />
        </div>
        <div className="space-y-2">
          <Label>Title Font Size (optional)</Label>
          <Input value={form.titleFontSize || ''} onChange={e => setForm({...form, titleFontSize: e.target.value})} />
        </div>
      </div>

      <JsonEditor label="Tags (Array of strings)" value={form.tags} onChange={val => setForm({...form, tags: val})} />
      <JsonEditor label="Images (Array of {url, caption, position})" value={form.images} onChange={val => setForm({...form, images: val})} />
      <JsonEditor label="Details Sections (Array of {heading, items[], subSections[]})" value={form.details} onChange={val => setForm({...form, details: val})} />

      <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Project"}</Button>
    </form>
  );
}

function CareerEditor() {
  const { data, refetch } = useGetCareer({ query: { retry: false } });
  const mutation = useUpdateCareer();
  const [form, setForm] = useState(data || { sectionTitle: 'Professional Journey', entries: [], titleFontSize: '' });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input value={form.sectionTitle} onChange={e => setForm({...form, sectionTitle: e.target.value})} />
      </div>
      <JsonEditor label="Career Entries (Array of {period, company, role, description, sortOrder})" value={form.entries} onChange={val => setForm({...form, entries: val})} />
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Career"}</Button>
    </form>
  );
}

function SkillsEditor() {
  const { data, refetch } = useGetSkills({ query: { retry: false } });
  const mutation = useUpdateSkills();
  const [form, setForm] = useState(data || { sectionTitle: 'Core Competencies', skills: [], titleFontSize: '' });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input value={form.sectionTitle} onChange={e => setForm({...form, sectionTitle: e.target.value})} />
      </div>
      <JsonEditor label="Skills (Array of strings)" value={form.skills} onChange={val => setForm({...form, skills: val})} />
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Skills"}</Button>
    </form>
  );
}

function ClosingEditor() {
  const { data, refetch } = useGetClosing({ query: { retry: false } });
  const mutation = useUpdateClosing();
  const [form, setForm] = useState(data || { text: '', fontSize: '' });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label>Closing Quote / Text</Label>
        <Textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="h-32" />
      </div>
      <div className="space-y-2">
        <Label>Font Size (optional)</Label>
        <Input value={form.fontSize || ''} onChange={e => setForm({...form, fontSize: e.target.value})} />
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Closing"}</Button>
    </form>
  );
}

function SettingsEditor() {
  const { data, refetch } = useGetSettings({ query: { retry: false } });
  const mutation = useUpdateSettings();
  const [form, setForm] = useState(data || { siteTitle: 'Portfolio', ownerName: 'Admin', showCareerSection: true, showSkillsSection: true, showClosingSection: true });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form }, { onSuccess: () => refetch() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Site Title</Label>
          <Input value={form.siteTitle} onChange={e => setForm({...form, siteTitle: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Owner Name</Label>
          <Input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} />
        </div>
      </div>
      
      <div className="space-y-4 p-6 border bg-card">
        <h3 className="font-display text-lg uppercase tracking-tight">Section Visibility</h3>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" checked={form.showCareerSection} onChange={e => setForm({...form, showCareerSection: e.target.checked})} className="w-4 h-4 accent-foreground" />
          <span className="font-sans text-sm uppercase tracking-widest">Show Career Section</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" checked={form.showSkillsSection} onChange={e => setForm({...form, showSkillsSection: e.target.checked})} className="w-4 h-4 accent-foreground" />
          <span className="font-sans text-sm uppercase tracking-widest">Show Skills Section</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" checked={form.showClosingSection} onChange={e => setForm({...form, showClosingSection: e.target.checked})} className="w-4 h-4 accent-foreground" />
          <span className="font-sans text-sm uppercase tracking-widest">Show Closing Section</span>
        </label>
      </div>

      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Settings"}</Button>
    </form>
  );
}
