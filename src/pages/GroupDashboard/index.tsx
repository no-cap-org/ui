import { API } from "@/api";
import { useSession } from "@/providers/SessionProvider";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { CreateGroupPopup } from "./CreateGroupPopup";
import { GroupTable } from "./group-view/GroupTable";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupDashboard() {
  const [groups, setGroups] = useState([]);
  const { userId } = useSession();

  const fetchGroups = useCallback(() => {
    API.METHODS.GET(
      API.ENDPOINTS.group.getAll(userId),
      {},
      { withCredentials: true },
      {
        onSuccess: (response) => {
          setGroups(response.data);
          toast.success("Fetched groups successfully");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to fetch group data");
        },
      }
    );
  }, [userId]);

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <motion.div
      className="flex flex-col w-full p-4 sm:py-0 sm:px-6 lg:px-12 xl:px-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <motion.p
        className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center sm:text-left"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Your Groups
      </motion.p>

      {/* Create Group Button */}
      <motion.div
        className="flex justify-center sm:justify-start py-4 sm:py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CreateGroupPopup onGroupCreated={fetchGroups} />
      </motion.div>

      {/* Group Table */}
      <AnimatePresence>
        <motion.div
          key="group-table"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="overflow-x-auto w-full"
        >
        
          <GroupTable data={groups} onRefresh={fetchGroups} /> 
          
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
