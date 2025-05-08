import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Sport } from "@/consts/core-data"; // Make sure this type exists

export function useFetchSportById(id: string | undefined) {
  const [sport, setSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSport = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Sports")
        .select("*")
        .eq("id", id);

      if (error) {
        setError(error.message);
        setSport(null);
      } else {
        setSport(data[0]);
      }

      setLoading(false);
    };

    fetchSport();
  }, [id]);

  return { sport, loading, error };
}
