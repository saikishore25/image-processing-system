
import { NavLink } from "react-router-dom";
import { ImagePlus, Images, Layers } from "lucide-react";

export default function Sidebar() {
    const links = [
        { name: "Process Image", path: "/", icon: ImagePlus },
        { name: "My Images", path: "/images", icon: Images },
    ];

    return (
        <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-5">
            <div className="mb-12 flex items-center gap-3 px-2">
                <div className="rounded-xl bg-blue-600 p-2">
                    <Layers size={22} />
                </div>
                <div>
                    <h1 className="text-lg font-bold">PixelForge</h1>
                    <p className="text-xs text-slate-400">Image Processing</p>
                </div>
            </div>

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Workspace
            </p>

            <nav className="space-y-2">
                {links.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <Icon size={19} />
                        {name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium">Image Processing System</p>
                <p className="mt-1 text-xs text-slate-500">
                    Upload once. Get multiple optimized versions.
                </p>
            </div>
        </aside>
    );
}
