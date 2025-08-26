// components/Task/TaskSequenceList.tsx
import { Task } from "@/pages/TaskDashboard"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"


export default function TaskSequenceList({ tasks }: { tasks: Task[] }) {

  if(!tasks.length){
    return <p>No tasks to show</p>
  }

  return (
    <div className="space-y-2 mt-4">
      {tasks.map((task, index) => (
        <TaskSequenceItem key={index} task={task} index={index} />
      ))}
    </div>
  )
}

interface Props {
  task: Task
  index: number
}

function TaskSequenceItem({ task, index }: Props) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "FINISHED":
        return <CheckCircle2 color="green" size={30} />
      case "ACTIVE":
      default:
        return <Circle className="text-gray-400" size={30} />
    }
  }

  return (
    <div className="flex items-start space-x-4 py-2">
      <div className="flex flex-col items-center">
        <Badge variant="outline" className="rounded-full px-2 py-0 text-lg border-2">{index + 1}</Badge>
        <div className="h-full border-l border-gray-300 dark:border-gray-600 mt-1" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{task.name}</h3>
          {getStatusIcon()}
        </div>
        <p className="text-lg text-muted-foreground">{task.description}</p>
      </div>
    </div>
  )
}
