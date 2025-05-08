import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Salle } from "@/consts/core-data";

export function useFetchSalleById(id: string | undefined) {
  const [salle, setSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalle = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Salles")
        .select("*")
        .eq("id", id);

      if (error) {
        setError(error.message);
        setSalle(null);
      } else {
        setSalle(data[0]);
      }

      setLoading(false);
    };

    fetchSalle();
  }, [id]);

  return { salle, loading, error };
}
