import SingularSallePageContent from "@/components/core/SingularSallePageContent";
import { use } from "react";

type tParams = Promise<{ id: string }>;

interface SpecificTagPageProps {
  params: tParams;
}
export default function SingularSallePage({ params }: SpecificTagPageProps) {
  // Convert and validate the ID
  const { id } = use(params);

  return (
    <main className=" mx-auto px-4 py-8 bg-gradient-to-b from-black/80 to-black/90 text-white">
      <div className=" container mx-auto ">
        <SingularSallePageContent salleId={id} />
      </div>
    </main>
  );
}
