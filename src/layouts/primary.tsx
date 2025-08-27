// import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router";

export default function PrimaryLayout(){
  return(
    <>
      <div
        className="bg-gradient-to-b from-red-300 from-10% via-orange-300 via-80% to-yellow-200 to-100% flex flex-col h-full"
      >
        <Header/>
        <main className="flex-1 overflow-y-auto">
          <div
            className="
              px-4 py-16     /* default: mobile */
              sm:px-8 sm:py-20   /* small screens (≥640px) */
              md:px-16 md:py-24  /* medium screens (≥768px) */
              lg:px-24 lg:py-32  /* large screens (≥1024px) */
              xl:px-44 xl:py-36  /* extra large screens (≥1280px) */
            "
          >
            <Outlet />
          </div>
        </main>
        {/* <Footer/> */}
      </div>
    </>
  )
}