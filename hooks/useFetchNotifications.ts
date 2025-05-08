import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { NotificationPayload } from "@/consts/core-data";

export function useFetchNotifications(userid: string | undefined) {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) return;

    let isMounted = true;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("userid", userid)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setNotifications([]);
      } else {
        setNotifications(data || []);
      }

      setLoading(false);
    };

    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `userid=eq.${userid}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationPayload;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userid]);

  return { notifications, loading, error };
}
