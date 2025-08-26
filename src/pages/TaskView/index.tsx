import { useEffect, useCallback, useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { API } from "@/api"
import { Assignment } from "../TaskDashboard"
import TaskSequenceList from "./TaskSequenceList"
import GeocodingMapView from "@/pages/TaskView/MapView"
import AssignUserPopover from "./AssignUserPopup"
import { useSession } from "@/providers/SessionProvider"
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";



export default function TaskView() {
  const { assignmentId } = useParams()
  const { userId } = useSession()
  const [assignment, setAssignment] = useState<Assignment & any>(null)

  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return
    try {
      await API.METHODS.GET(API.ENDPOINTS.assignment.get(assignmentId), {}, { withCredentials: true }, {
        onSuccess: (res) => setAssignment(res.data),
        onError: (err) => toast.error(err.message),
      })
    } catch {
      toast.error("Failed to fetch task")
    }
  }, [assignmentId])

  useEffect(() => {
    fetchAssignment()
  }, [])


  if (!assignmentId || !assignment) {
    return (
      <div className="flex justify-center items-center h-full">
        <AssignmentDetailSkeleton />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={assignmentId} // ensures animation when assignment changes
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col p-4 space-y-6"
      >
        {/* Assignment Info Card */}
        <Card className="bg-gradient-to-b from-purple-200/40 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{assignment.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                <p className="text-sm">Due: {new Date(assignment.dueDate).toDateString()}</p>
                <p className="text-lg">Assigned to: {assignment.assigneeDetails?.firstName || "Unassigned"}</p>
              </div>
              {userId === assignment.ownerId && (
                <AssignUserPopover
                  assignmentId={assignmentId}
                  onTaskAssigned={fetchAssignment}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="font-semibold text-sm mb-2">Tasks:</h2>
            <TaskSequenceList tasks={assignment.tasks || []} />
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="bg-gradient-to-b from-green-200/20 to-blue-200/40 shadow-2xl">
          <CardHeader>
            <CardTitle>Map</CardTitle>
          </CardHeader>
          <CardContent>
            <GeocodingMapView
              assignment={assignment}
              tasks={assignment.tasks || []}
              onTaskAddedOrUpdated={fetchAssignment}
            />
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}


export function AssignmentDetailSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col p-4 space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-20 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Skeleton className="h-6 w-full rounded-md" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-16" />
        </CardHeader>
        <CardContent>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Skeleton className="h-64 w-full rounded-lg" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
