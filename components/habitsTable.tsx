"use client";
import { getHabits, trackHabit } from "@/app/actions/action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "./datePicker";
import { useFormState } from "react-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { date } from "drizzle-orm/mysql-core";
import { Calendar } from "./ui/calendar";
import { Toast, ToastAction } from "./ui/toast";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: number;
  name: string;
}

export function HabitsTable() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDates, setSelectedDates] = useState<{
    [key: number]: Date | undefined;
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHabits() {
      const habitsData = await getHabits();
      setHabits(habitsData);
    }
    fetchHabits();
  }, []);

  function completeHabit(
    event: React.MouseEvent<HTMLButtonElement>,
    habitId: number,
    date: Date | undefined
  ) {
    event.preventDefault();
    const stringDate = date ? format(date, "yyyy-MM-dd") : "";
    trackHabit(habitId, stringDate).then((res) => {
      if (res.message === "200") {
        toast({
          title: "Habit Completed! 🎉✅",
          variant: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    });
  }
  // Function to handle date change
  function handleDateChange(habitId: number, date: Date | undefined) {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [habitId]: date,
    }));
  }

  return (
    <Table>
      <TableCaption>Track Your Habits Freely!</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Habit</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {habits.map((habit) => (
          <TableRow key={habit?.id}>
            <TableCell>{habit.name}</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {selectedDates[habit.id] ? (
                      format(selectedDates[habit.id]!, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDates[habit.id]}
                    onSelect={(date) => handleDateChange(habit.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>
              <Button
                type="submit"
                onClick={(event) =>
                  completeHabit(event, habit.id, selectedDates[habit.id])
                }
              >
                Click to Complete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
