import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Users, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router";
import TypeWriter from "typewriter-effect"

export default function LandingPage() {
  const navigate = useNavigate();


  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring" },
    }),
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 xl:px-20 py-8 space-y-28 bg-gradient-to-b text-gray-800">

      {/* Hero Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6 px-2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight text-gray-800">origin-ally</h1>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-800">
          <TypeWriter
            options={{
              strings: "Stay Connected, Live.",
              autoStart: true,
              loop: false,
              
            }}
          />
        </h1>
        {/* <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-gray-800/80">
          Real-time location sharing with ultra-low latency. Manage teams, coordinate deliveries, or keep friends in sync — all effortlessly.
        </p> */}
      </motion.div>

      {/* Group Live Location */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center px-2">
        <motion.div
          className="flex flex-col gap-y-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Group Live Location
          </h2>
          <p className="text-gray-800/80 text-base sm:text-lg lg:text-xl">
            Keep your team or friends connected wherever they are. Watch members move live on the map — perfect for events, trips, or coordination.
          </p>

          {/* Steps */}
          <div className="space-y-4 mt-6">
            {[ 
              { icon: Users, label: "Create a Group" },
              { icon: MapPin, label: "Share Your Location" },
              { icon: ClipboardCheck, label: "Track Everyone Live" },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/30 rounded-xl backdrop-blur-md shadow-md"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stepVariants}
              >
                <step.icon className="w-6 h-6 text-gray-800" />
                <p className="text-gray-800 font-medium">{step.label}</p>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => navigate("/groups")}
            variant="outline"
            className="w-full sm:w-auto max-w-xs mt-4 text-base sm:text-lg px-6 py-4 border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Create a group now! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div
          className="w-full h-64 sm:h-72 lg:h-80 bg-white/30 rounded-2xl flex items-center justify-center text-gray-700 text-lg sm:text-xl font-semibold shadow-inner backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Live Group Map Preview
        </motion.div>
      </div>

      {/* Vendor Task Tracker */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center px-2">
        <motion.div
          className="order-2 md:order-1 w-full h-64 sm:h-72 lg:h-80 bg-white/30 rounded-2xl flex items-center justify-center text-gray-800 text-lg sm:text-xl font-semibold shadow-inner backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Courier Task Tracker
        </motion.div>

        <motion.div
          className="flex flex-col gap-y-6 order-1 md:order-2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Track Tasks by Location
          </h2>
          <p className="text-gray-800/80 text-base sm:text-lg lg:text-xl">
            Vendors can monitor courier locations as they complete tasks at specific spots, giving full visibility over delivery progress.
          </p>

          {/* Steps */}
          <div className="space-y-4 mt-6">
            {[ 
              { icon: MapPin, label: "Assign Task Locations" },
              { icon: ClipboardCheck, label: "Monitor Progress" },
              { icon: Users, label: "Ensure Delivery Completion" },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/30 rounded-xl backdrop-blur-md shadow-md"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stepVariants}
              >
                <step.icon className="w-6 h-6 text-gray-800" />
                <p className="text-gray-800 font-medium">{step.label}</p>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => navigate("/assignments")}
            variant="outline"
            className="w-full sm:w-auto max-w-xs mt-4 text-base sm:text-lg px-6 py-4 border-gray-700 text-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Start your first assignment! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Final CTA */}
      <motion.div
        className="text-center space-y-6 px-2 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
          Ready to make movement smarter?
        </h3>
        <Button
          variant="outline"
          onClick={() => navigate("/sign-up")}
          size="lg"
          className="w-full sm:w-auto text-base sm:text-lg px-6 py-4 border-gray-700 text-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          Try Live Tracking Now
        </Button>
      </motion.div>
    </div>
  );
}
