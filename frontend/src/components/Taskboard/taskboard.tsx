"use client"

import { Metadata } from "next";
import { useEffect, useState } from "react";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import io from "@/logic/socket";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker built using Tanstack Table.",
};

interface Tasks {
  id: string,
  title: string,
  status: string,
  label: string,
  priority: string,
  garden_id: string,
}

function formatTime(timestamp : string) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }).replace(/,/, '');
};

let timeNow = formatTime(new Date().toISOString());

export default function TaskBoard() {
  const user_id = sessionStorage.getItem('user_id');
  const router = useRouter();

  if (!user_id) {
    router.push('/NotLoggedIn')
  }

  const [currentTime, setCurrentTime] = useState<String>(timeNow);

  io.emit('userHasGarden', {
    user_id: user_id
  })

  let user_has_garden;

  io.on('userGardenStatus', (status) => {
      user_has_garden = status.user_has_garden
    }
  )
  io.off('userGardenStatus')

  if (user_has_garden == false) {
    return (
      <div className="container w-full flex flex-col justify-center min-h-[75vh] max-h-max mt-8">
          <div className="flex flex-col items-center mx-auto">
            <h1>You have not claimed a plot yet. Please claim a plot to view the data.</h1>
            <Button onClick={() => router.push('/PlotStatus')} className="min-w-[50%] mt-2">Claim Plot</Button>
          </div>
      </div>
      )
  }

  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [incomingTasks, setIncomingTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    const updateCurrentTimeInterval = setInterval(() => {
      setCurrentTime(formatTime(new Date().toISOString()));
    }, 1000);

    io.emit("fetchTasks", {
      user_id: sessionStorage.getItem("user_id")
    });

    io.on("TaskBoardTasks", (data) => {
      setIncomingTasks(data.task_board_tasks);
      if (JSON.stringify(tasks) !== JSON.stringify(incomingTasks)) {
        setTasks(incomingTasks);
      }
      io.off("TaskBoardTasks");
    });

    return () => {
      io.off("updateGraphData")
      clearInterval(updateCurrentTimeInterval);
    };
  }, [currentTime])

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex min-h-[70vh]">
      <div className="items-center">
        <div className="flex justify-between">
          <h1 className="ml-2 pt-4">current time: {currentTime}</h1>
          <Button asChild>
            <Link 
            href="/TaskBoard/TaskCreate"
            >
              Create Task
            </Link>
          </Button>
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
