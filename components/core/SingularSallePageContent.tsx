"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Salle, Sport } from "@/consts/core-data";
import { useBranches } from "@/hooks/useFetchSalles";
import { useToggleSalleSub } from "@/hooks/useToggleSalleSub";
import supabase from "@/lib/supabase";
import { SignedIn, useUser } from "@clerk/nextjs";
import {
  ArrowLeftIcon,
  ArrowRight,
  CheckCircle,
  Loader2,
  LogOut,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { useToggleSportSub } from "@/hooks/useToggleSportSub";

interface SingularSallePageContentProps {
  salleId: string;
}

const SingularSallePageContent = ({
  salleId,
}: SingularSallePageContentProps) => {
  const router = useRouter();
  const { branches, fetchSportsForSalle, allsports } = useBranches();
  const [loadingSports, setLoadingSports] = useState(true);

  const [branch, setBranch] = useState<Salle | null>(null);
  const [loadingBranch, setLoadingBranch] = useState(true);
  const { user } = useUser();

  const { joined, toggleJoin, loading, error } = useToggleSalleSub(
    user?.id,
    salleId
  );

  // fetch sports and salle
  useEffect(() => {
    const loadData = async () => {
      try {
        // Find the branch
        const foundBranch = branches.find((b) => b.id === salleId);
        if (!foundBranch) {
          // If not in cache, try fetching directly
          const { data, error } = await supabase
            .from("Salles")
            .select("*")
            .eq("id", salleId)
            .single();

          if (error || !data) {
            return notFound();
          }
          setBranch(data);
        } else {
          setBranch(foundBranch);
        }

        // Load sports
      } catch (error) {
        console.error("Error loading salle data:", error);
      } finally {
        setLoadingBranch(false);
        setLoadingSports(false);
      }
    };

    loadData();
  }, [salleId, branches, fetchSportsForSalle]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = async () => {
    if (!toggleJoin) return;

    if (joined) {
      setDialogOpen(true); // Ask for confirmation before unjoining
    } else {
      try {
        await toggleJoin();
      } catch (err) {
        toast.error("Failed to join");
      }
    }
  };

  const confirmUnjoin = async () => {
    try {
      await toggleJoin?.();
      setDialogOpen(false);
      router.refresh(); // Refresh the page to update UI
    } catch (err) {
      toast.error("Failed to leave");
    }
  };

  if (loadingBranch || !branch) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-full md:w-1/2 h-64 md:h-96 rounded-lg" />
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-20 w-full mt-4" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/4 mt-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Branch Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 max-w-6xl mx-auto">
        <div className="w-full max-w-6xl mx-auto">
          {branch.image ? (
            <img
              src={branch.image}
              alt={branch.title || "Branch image"}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{branch.title}</h1>
            </div>
            <div>
              <Button
                variant={joined ? "default" : "secondary"}
                onClick={handleClick}
                disabled={loading || !toggleJoin}
              >
                <div className="flex items-center gap-2">
                  <div>{joined ? "Joined" : "Join now"}</div>
                  <div>
                    {joined ? <LogOut size={13} /> : <ArrowRight size={13} />}
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <p className="text-gray-100 mb-6 whitespace-pre-line">
            {branch.description}
          </p>

          <div className="bg-blue-50/15 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-100">{branch.coordinations}</p>
          </div>

          <div className="relative w-full h-0 pb-[56.25%]">
            <iframe
              src={branch.googleloc}
              width="600"
              height="450"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute top-0 left-0 w-full h-full object-cover md:h-44"
            ></iframe>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave {branch.title}?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to unjoin this branch? You will need to join
              again to access any updates.
            </p>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmUnjoin}
                disabled={loading}
              >
                {loading ? "Leaving..." : "Confirm Unjoin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sports Section */}
      <section className="mb-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Available Sports</h2>

        {loadingSports ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            ))}
          </div>
        ) : allsports.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              No sports currently available at this location
            </p>
            <Button variant="outline" asChild>
              <Link href="/branches">Browse other branches</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allsports.map((sport, i) => (
              <SportCard key={i} {...sport} />
            ))}
          </div>
        )}
      </section>

      {/* Back Button */}
      <SignedIn>
        {!joined && (
          <div className="flex justify-start max-w-6xl mx-auto mt-8 text-black">
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to all branches
              </Link>
            </Button>
          </div>
        )}
      </SignedIn>
    </>
  );
};

export const SportCard: FC<Sport> = ({
  id,
  image,
  title,
  description,
  timetable,
  maxsubs,
  subs,
}) => {
  const { user } = useUser();
  const {
    joined,
    toggleJoin,
    loading: toggleLoading,
    error,
    sport,
  } = useToggleSportSub(user?.id, id);

  const maxSubsNumber = parseInt(maxsubs);
  const currentSubsNumber = parseInt(subs);
  const isFull = currentSubsNumber >= maxSubsNumber;

  if (!sport) {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border shadow-sm hover:shadow-lg transition-shadow bg-white overflow-hidden flex flex-col">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={title || "Sport image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description}
          </p>

          {timetable && (
            <details className="mt-3">
              <summary className="text-sm font-medium text-blue-600 cursor-pointer">
                View Schedule
              </summary>
              <div
                className="text-black"
                dangerouslySetInnerHTML={{ __html: timetable }}
              />
            </details>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs text-gray-600 font-medium">
            <span>Spots Taken</span>
            <span>
              {currentSubsNumber}/{maxSubsNumber}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? "bg-red-500" : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (currentSubsNumber / maxSubsNumber) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className=" mt-3">
            <button
              onClick={toggleJoin}
              disabled={toggleLoading || !toggleJoin || (!joined && isFull)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition ${
                joined
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {toggleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : joined ? (
                <>
                  <XCircle className="w-5 h-5" />
                  Unjoin
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Join
                </>
              )}
            </button>
          </div>

          {isFull && !joined && (
            <p className="text-yellow-600 text-xs mt-2 font-medium">
              This sport is full. You can't join for now.
            </p>
          )}

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SingularSallePageContent;
