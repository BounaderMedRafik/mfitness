import { Salle, Sport } from "@/consts/core-data";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useBranches = () => {
  const [branches, setBranches] = useState<Salle[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [allsports, setAllsports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all branches (Salles)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from("Salles")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setBranches(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch branches"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
    fetchAllSports();
  }, []);

  // Fetch sports for a specific Salle
  const fetchSportsForSalle = async (salleId: string) => {
    try {
      const { data, error } = await supabase
        .from("Sports")
        .select("*")
        .eq("SalleID", salleId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching sports:", err);
      return [];
    }
  };

  // Fetch all sports
  const fetchAllSports = async () => {
    const { data, error } = await supabase.from("Sports").select("*");
    if (error) throw error;
    setAllsports(data);
    return data;
  };

  return {
    branches,
    sports,
    allsports,
    loading,
    error,
    fetchSportsForSalle,
    fetchAllSports,
  };
};
