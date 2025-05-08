import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { useNotifyUser } from "./useNotifyUser";
import { useFetchSalleById } from "./useFetchSalleById";

export function useToggleSalleSub(
  userid: string | undefined,
  salleid: string | undefined
) {
  const [joined, setJoined] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendNotification } = useNotifyUser();
  const {
    salle,
    loading: SalleLoading,
    error: SalleError,
  } = useFetchSalleById(salleid);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userid || !salleid) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sallesubs")
          .select("id")
          .eq("userid", userid)
          .eq("salleid", salleid)
          .maybeSingle();

        if (error) throw error;
        setJoined(!!data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to check subscription"
        );
        setJoined(null);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [userid, salleid]);

  const toggleJoin = async () => {
    if (!userid || !salleid) {
      setError("User or salle ID missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (joined) {
        // 1. Unsubscribe from the salle
        const { error: salleUnsubError } = await supabase
          .from("sallesubs")
          .delete()
          .eq("userid", userid)
          .eq("salleid", salleid);

        if (salleUnsubError) throw salleUnsubError;

        // 2. Get all sport IDs where SalleID = salleid
        const { data: sportsInSalle, error: sportFetchError } = await supabase
          .from("Sports")
          .select("id")
          .eq("SalleID", salleid);

        if (sportFetchError) throw sportFetchError;

        const sportIds = sportsInSalle?.map((sport) => sport.id);
        if (sportIds.length > 0) {
          // 3. Unsubscribe from all sportsubs for these sport IDs
          const { error: sportSubDeleteError } = await supabase
            .from("sportsubs")
            .delete()
            .in("sportid", sportIds)
            .eq("userid", userid);

          if (sportSubDeleteError) throw sportSubDeleteError;
        }

        if (!salle) throw new Error("Salle information not available");

        await sendNotification({
          title: `Unjoined from ${salle.title}`,
          type: "destructive",
          message: "You've left this salle and all related sports.",
        });

        toast.success(`Left ${salle.title} and all related sports`);
        setJoined(false);
      } else {
        // Join process
        const { error } = await supabase
          .from("sallesubs")
          .insert([{ userid, salleid }]);

        if (error) throw error;

        if (!salle) throw new Error("Salle information not available");

        await sendNotification({
          title: `Joined ${salle.title}`,
          type: "primary",
          message: `Welcome to ${salle.title}! You're now subscribed.`,
        });

        toast.success(`Joined ${salle.title}`);
        setJoined(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    joined,
    toggleJoin: salle ? toggleJoin : undefined,
    loading: loading || SalleLoading,
    error: error || SalleError,
    salle,
  };
}
