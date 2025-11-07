import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <p className="text-slate-600 dark:text-slate-400">Use the sections below to manage your content. This area is protected by Basic Auth.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SectionCard title="Projects" href="/admin/projects" description="Create, edit, delete, reorder projects" />
        <SectionCard title="Reading" href="/admin/reading" description="Manage books, progress, and notes" />
        <SectionCard title="About" href="/admin/about" description="Edit profile and sections" />
        <SectionCard title="Blogs" href="/admin/blogs" description="Write and edit articles" />
        <SectionCard title="Adventures and Expreriences" href="/admin/adventures" description="Write and edit adventures and experiences" />
        <SectionCard title="Backups" href="/admin/backups" description="Restore from backups" />
      </div>
    </div>
  );
}

function SectionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link 
      href={href}
      className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-slate-100 hover:shadow-md dark:hover:shadow-slate-900/50"
    >
      <div className="font-semibold mb-2 text-slate-900 dark:text-slate-100">{title}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{description}</div>
    </Link>
  );
}


