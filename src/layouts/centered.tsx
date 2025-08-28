import Header from "@/components/header";
import { Outlet } from "react-router";

export function CenteredLayout(){

  return(
    <>
      <Header />
      <div className="bg-gradient-to-b from-red-300 from-10% via-orange-300 via-80% to-yellow-200 to-100% w-screen h-screen flex items-center justify-center">
        <Outlet/>
      </div>
    </>
  )

}