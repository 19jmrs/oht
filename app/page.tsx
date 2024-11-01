import { HabitsTable } from "@/components/habitsTable";
import { NewHabit } from "@/components/newHabit";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="">
      <NewHabit />
      <HabitsTable />
      <Toaster />
    </div>
  );
}
