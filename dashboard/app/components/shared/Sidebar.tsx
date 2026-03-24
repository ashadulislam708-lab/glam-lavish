import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import { UserRoleEnum } from "~/enums";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

interface NavChild {
  to: string;
  label: string;
  groupParam?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  children?: NavChild[];
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    children: [
      { to: "/orders?group=active", label: "Active", groupParam: "active" },
      {
        to: "/orders?group=completed",
        label: "Completed",
        groupParam: "completed",
      },
      { to: "/orders?group=cancel", label: "Cancel", groupParam: "cancel" },
      { to: "/orders?group=failed", label: "Failed", groupParam: "failed" },
      { to: "/orders?group=trash", label: "Trash", groupParam: "trash" },
    ],
  },
  { to: "/customers", label: "Customers", icon: Users },
];

const adminItems: NavItem[] = [
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const isActive = (path: string): boolean => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isChildActive = (child: NavChild): boolean => {
    if (!child.groupParam) return false;
    return (
      location.pathname === "/orders" &&
      searchParams.get("group") === child.groupParam
    );
  };

  const isParentWithActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isChildActive(child));
  };

  // Auto-expand menus when navigating to a child route
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children && isActive(item.to)) {
        setExpandedMenus((prev) => new Set(prev).add(item.to));
      }
    });
  }, [location.pathname]);

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.to);
    const active = isActive(item.to);
    const hasActiveChild = isParentWithActiveChild(item);

    if (hasChildren) {
      return (
        <div key={item.to}>
          <button
            onClick={() => toggleMenu(item.to)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active || hasActiveChild
                ? "bg-indigo-50 text-indigo-600"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-0.5 border-l pl-4">
              {item.children!.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isChildActive(child)
                      ? "bg-indigo-50 font-medium text-indigo-600"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-indigo-50 text-indigo-600"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              Glam Lavish
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(renderNavItem)}
          {user?.role === UserRoleEnum.ADMIN && (
            <>
              <Separator className="my-3" />
              {adminItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            Glam Lavish Inventory v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
