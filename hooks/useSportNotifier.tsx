"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useNotifyUser } from "./useNotifyUser";
import { useFetchSportById } from "./useFetchSportById";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export function RandomSportNotifier({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { sendNotification } = useNotifyUser();
  const [randomSportId, setRandomSportId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false); // ✅ To avoid duplicate notifications

  useEffect(() => {
    if (!isLoaded || !user?.id || checked) return;

    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("sportsubs")
        .select("sportid")
        .eq("userid", user.id);

      setChecked(true); // ✅ Mark as checked so it doesn’t rerun

      if (error) {
        console.error("Erreur Supabase:", error.message);
        return;
      }

      if (!data || data.length === 0) {
        const msg =
          "Vous n'êtes inscrit à aucun sport pour le moment. Choisissez-en un et commencez à vous entraîner !";
        toast.error(msg);
        sendNotification({
          title: "👋 Rejoindre un sport",
          type: "destructive",
          message: msg,
        });
        return;
      }

      const random = data[Math.floor(Math.random() * data.length)];
      setRandomSportId(random.sportid);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded, user?.id, checked]);

  const { sport } = useFetchSportById(randomSportId || undefined);

  useEffect(() => {
    if (!sport?.title) return;

    const msg = `Il est temps de participer à "${sport.title}" !`;
    toast(msg);
    sendNotification({
      title: `🏃 Temps pour ${sport.title}`,
      type: "neutral",
      message: msg,
    });
  }, [sport]);

  return <>{children}</>;
}
