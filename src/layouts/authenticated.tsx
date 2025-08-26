import { useSession } from "@/providers/SessionProvider";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingStickMan from "@/assets/StickManWalking.gif";

export default function AuthenticatedLayout(){

  const { userId, isLoading } = useSession();
  // console.log(userId)
  const location = useLocation();
  
  if(isLoading){
    return <div className="flex justify-center items-center"><img src={LoadingStickMan} className="size-6" /></div>
  }

  if(!userId) {
    return <Navigate to={'/login'} replace state={{ from: location }} />
  }

  return(
    <>
      <Outlet/>
    </>
  )
}