"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Info,
  LogOut,
  Menu,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import moment from "moment";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import { NotificationPayload } from "@/consts/core-data";

const Navigation = () => {
  return (
    <div className=" bg-gradient-to-b from-black/80 to-black/90 text-white">
      <header className="  max-w-6xl mx-auto  py-3">
        <div className="container flex justify-between items-center">
          <Link href={"/"}>
            <div className="text-2xl font-bold">
              <span className="text-blue-400">M</span>Fitness
            </div>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-2 font-bold">
              <li>
                <NotificationButton />
              </li>

              <li>
                <a
                  href={"/"}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <div>Mes Plans</div>
                  <div>
                    <ArrowUpRight size={13} />
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={"/profile"}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <div>Profile</div>
                  <div>
                    <User size={13} />
                  </div>
                </a>
              </li>

              <li>
                <SignOutButton>
                  <div>
                    <Button
                      size={"sm"}
                      variant={"secondary"}
                      className=" cursor-pointer"
                    >
                      <div>Log out</div>
                      <div>
                        <LogOut size={13} />
                      </div>
                    </Button>
                  </div>
                </SignOutButton>
              </li>
            </ul>
          </nav>

          {/* //button of expand */}
          <button className="md:hidden border p-1 rounded">
            <Menu size={14} />
          </button>
        </div>
      </header>
    </div>
  );
};

const NotificationButton = () => {
  const { user } = useUser();
  const userid = user?.id;

  const { notifications, loading } = useFetchNotifications(userid);
  const [expanded, setExpanded] = useState(false);

  const visibleNotifications = expanded
    ? notifications
    : notifications.slice(0, 2);

  const getIcon = (type: NotificationPayload["type"]) => {
    switch (type) {
      case "primary":
        return <Info className="text-blue-500 mt-0.5" size={16} />;
      case "destructive":
        return <XCircle className="text-red-500 mt-0.5" size={16} />;
      case "neutral":
      default:
        return <CheckCircle2 className="text-green-500 mt-0.5" size={16} />;
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary" className="relative h-8 w-8">
            <Bell size={16} />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 p-2 space-y-2 shadow-xl rounded-xl">
          <div className="text-sm font-semibold text-muted-foreground px-2 pb-1">
            Notifications
          </div>

          <div className="border-t border-border" />

          <div className="space-y-1">
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-all cursor-pointer"
                >
                  {getIcon(n.type)}
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <div className="text-xs mt-2 text-muted-foreground flex items-center gap-2">
                      <Clock size={10} />
                      <span>{moment(n.created_at).calendar()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                {loading ? "Loading..." : "No notifications"}
              </p>
            )}
          </div>

          {notifications.length > 2 && (
            <>
              <div className="border-t border-border" />
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="w-full text-xs text-center text-muted-foreground hover:text-primary transition py-1"
              >
                {expanded ? "Show less" : "View more"}
              </button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navigation;
