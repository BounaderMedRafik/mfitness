import { NotificationPayload } from "@/consts/core-data";
import supabase from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function useNotifyUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const sendNotification = async ({
    title,
    type,
    message,
  }: NotificationPayload) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("notifications").insert([
      {
        title,
        type,
        message,
        userid: user?.id,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
    }

    setLoading(false);
  };

  return {
    sendNotification,
    loading,
    error,
  };
}
