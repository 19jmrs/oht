"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createHabit } from "@/app/actions/action";
import { useToast } from "@/hooks/use-toast";

export function NewHabit() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  async function getHabitData(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (inputRef.current) {
      const habitData = inputRef.current.value;
      const ret = await createHabit(habitData);
      if (ret.message === "200") {
        toast({
          title: "Success!",
          description: "You have successfully created a new habit",
          variant: "default",
        });
        setOpen(false);
      } else {
        toast({
          title: "An error occurred while creating your habit.",
          variant: "destructive",
          description: ret.message,
        });
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Habit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>Add a new habit to your list</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" ref={inputRef} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={getHabitData}>
            Add Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
