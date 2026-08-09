import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col">
        <DashboardHeader />

        <div className="space-y-8 p-6 lg:p-8">
          {/* Header */}

          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
              <Settings className="h-8 w-8 text-cyan-400" />
              Settings
            </h1>

            <p className="mt-2 text-gray-400">
              Manage your account and AI Research Copilot preferences.
            </p>
          </div>

          {/* Settings Sections */}

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: User,
                title: "Profile",
                description: "Manage your profile information.",
              },
              {
                icon: Bell,
                title: "Notifications",
                description: "Email and desktop notifications.",
              },
              {
                icon: Shield,
                title: "Security",
                description: "Password and authentication settings.",
              },
              {
                icon: Palette,
                title: "Appearance",
                description: "Customize your dashboard experience.",
              },
              {
                icon: Database,
                title: "Data & Storage",
                description: "Manage uploaded research documents.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-400"
                >
                  <Icon className="h-10 w-10 text-cyan-400" />

                  <h2 className="mt-5 text-xl font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-gray-400">
                    {item.description}
                  </p>

                  <button className="mt-6 rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-300 transition hover:bg-cyan-500/10">
                    Configure
                  </button>
                </div>
              );
            })}
          </div>

          {/* AI Preferences */}

          <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">
              AI Preferences
            </h2>

            <div className="mt-6 space-y-5">
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                <span className="text-white">
                  Enable AI Suggestions
                </span>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                <span className="text-white">
                  Auto Summarize Documents
                </span>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                <span className="text-white">
                  Save Chat History
                </span>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>
            </div>

            <button className="mt-8 flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300">
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}