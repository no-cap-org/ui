import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Assignment } from "."
import { useNavigate } from "react-router"
import { Skeleton } from "@/components/ui/skeleton";


export default function AssignmentCard({ assignment }: { assignment: Assignment }) {

  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/assignments/${assignment._id}`)} className="cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white/65 via-white/75 to-white">
      
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-4xl font-semibold text-primary">
          {assignment.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-muted-foreground">Number of tasks</p>
          <p className="text-base">{assignment.tasks.length}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Description</p>
          <p className="text-base">{assignment.description || "No description provided."}</p>
        </div>

        <div>
          <p className="font-medium text-muted-foreground">Due Date</p>
          <p className="text-base">{new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}



export function AssignmentCardSkeleton() {
  return (
    <Card className="rounded-2xl shadow-md ">
      <CardHeader className="space-y-1 pb-2">
        <Skeleton className="h-8 w-40" /> {/* title */}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-5 w-56" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-5 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
