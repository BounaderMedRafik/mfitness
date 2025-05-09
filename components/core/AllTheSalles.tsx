"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBranches } from "@/hooks/useFetchSalles";
import SingularSallePageContent from "./SingularSallePageContent";
import { useJoinedSalle } from "@/hooks/useJoinedSalle";
import { useUser } from "@clerk/nextjs";

const AllTheSalles = () => {
  const { user } = useUser();
  const { salleId, loading: loadingJoinedSalle } = useJoinedSalle(
    user?.id || ""
  );
  const { branches, loading, error } = useBranches();

  if (loadingJoinedSalle || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Skeleton className="w-48 h-8 mx-auto mb-6" />
        <Skeleton className="w-full h-64 max-w-3xl mx-auto" />
      </div>
    );
  }

  if (salleId) {
    return (
      <div className="bg-gradient-to-b from-black/80 to-black/90 text-white">
        <div className="container mx-auto px-4 py-8">
          <SingularSallePageContent salleId={salleId} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erreur de chargement des branches
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black/80 to-black/90 text-white">
      <div className="container mx-auto px-4 py-8 ">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Branches</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Découvrez nos centres de fitness haut de gamme à travers la région,
            chacun offrant des installations uniques et des programmes
            d'entraînement.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <Skeleton className="w-full h-48 rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-32 mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="group overflow-hidden transition-all hover:shadow-lg p-0"
              >
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    {branch.image ? (
                      <img
                        src={branch.image}
                        alt={branch.title || "Branch image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      En vedette
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-1">
                    {branch.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {branch.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{branch.coordinations}</span>
                  </div>
                  <Link href={`/salle/${branch.id}`} passHref>
                    <Button className="w-full" variant="outline">
                      Afficher les détails
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTheSalles;
