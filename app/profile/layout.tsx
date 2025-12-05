import { ProfileSidebar } from "@/components/ProfileSidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-10 max-w-7xl mx-auto py-10" >


      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
