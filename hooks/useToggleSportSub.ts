import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { useFetchSportById } from "./useFetchSportById";
import { useNotifyUser } from "./useNotifyUser";

export function useToggleSportSub(
  userid: string | undefined,
  sportid: string | undefined
) {
  const [joined, setJoined] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendNotification } = useNotifyUser();
  const {
    sport,
    loading: sportLoading,
    error: sportError,
  } = useFetchSportById(sportid);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userid || !sportid) {
        setJoined(null);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sportsubs")
          .select("id")
          .eq("userid", userid)
          .eq("sportid", sportid);

        if (error) throw error;

        if (data.length > 1) {
          console.warn("Duplicate subscriptions detected.");
        }

        setJoined(data.length > 0);
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
  }, [userid, sportid]);

  const toggleJoin = async () => {
    if (!userid || !sportid) {
      setError("User or sport ID missing");
      return;
    }

    if (!sport) {
      setError("Sport not loaded yet");
      return;
    }

    const currentSubs = parseInt(sport.subs || "0", 10);
    const maxSubs = parseInt(sport.maxsubs || "0", 10);

    setLoading(true);
    setError(null);

    try {
      if (joined) {
        // Unjoin
        const { error } = await supabase
          .from("sportsubs")
          .delete()
          .eq("userid", userid)
          .eq("sportid", sportid);

        if (error) throw error;

        const newSubs = Math.max(currentSubs - 1, 0).toString();

        const { error: updateError } = await supabase
          .from("Sports")
          .update({ subs: newSubs })
          .eq("id", sportid);

        if (updateError) throw updateError;

        await sendNotification({
          title: `Unjoined from ${sport.title}`,
          type: "destructive",
          message: "You've left this sport and will no longer receive updates",
        });

        toast.success(`Left ${sport.title}`);
        setJoined(false);
      } else {
        // Check capacity
        if (currentSubs >= maxSubs) {
          toast.error("This sport is full. No more subscriptions allowed.");
          return;
        }

        // Join
        const { error } = await supabase
          .from("sportsubs")
          .insert([{ userid, sportid }]);

        if (error) throw error;

        const newSubs = (currentSubs + 1).toString();

        const { error: updateError } = await supabase
          .from("Sports")
          .update({ subs: newSubs })
          .eq("id", sportid);

        if (updateError) throw updateError;

        await sendNotification({
          title: `Joined ${sport.title}`,
          type: "primary",
          message: `Welcome to ${sport.title}! Don't forget to check the Time table.`,
        });

        toast.success(`Joined ${sport.title}`);
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
    toggleJoin: sport ? toggleJoin : undefined,
    loading: loading || sportLoading,
    error: error || sportError,
    sport,
  };
}
