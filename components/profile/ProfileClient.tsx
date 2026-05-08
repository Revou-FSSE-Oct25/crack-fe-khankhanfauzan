import type { User } from "@/types/users";
import { SummarySidebar } from "./SummarySidebar";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { NotificationSettingsSection } from "./NotificationSettingsSection";
import { SecuritySection } from "./SecuritySection";

export function ProfileClient({ user }: { user: User | null }) {
    return (
        <main className="bg-muted min-h-svh">
            <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4">
                <aside className="w-full md:w-1/3 flex flex-col gap-4">
                    <SummarySidebar user={user || null} />
                </aside>
                <section className="flex-1 flex flex-col gap-4">
                    <PersonalInfoSection user={user} />
                    <NotificationSettingsSection />
                    <SecuritySection />
                </section>
            </div>
        </main>
    );
}
