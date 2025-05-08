// hooks/useJoinedSalle.ts
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useJoinedSalle(userId: string) {
  const [salleId, setSalleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchJoinedSalle = async () => {
      const { data, error } = await supabase
        .from("sallesubs")
        .select("salleid")
        .eq("userid", userId)
        .single();

      if (data && data.salleid) setSalleId(data.salleid);
      setLoading(false);
    };

    fetchJoinedSalle();
  }, [userId]);

  return { salleId, loading };
}
