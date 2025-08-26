import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { API } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import MapView from './MapView';
import { useSession } from '@/providers/SessionProvider';
import { motion, AnimatePresence } from 'framer-motion';

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  dob: Date;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
};

type GroupData = {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  ownerDetails: User;
  memberDetails: User[];
};

export default function GroupView() {
  const { groupId } = useParams();
  const { userId } = useSession();
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember,setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    async function fetchGroup() {
      setLoading(true);
      if (!groupId) return;
      try {
        await API.METHODS.GET(
          API.ENDPOINTS.group.get(groupId),
          {},
          { withCredentials: true },
          {
            onSuccess: (data) => {
              setGroupData(data);
            },
            onError: (error) => console.error(error),
          }
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [groupId]);

  if (loading || !groupId) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!groupData) return <div className="p-6">Group not found or access denied.</div>;

  return (
    <div className="p-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {/* Group Info Card */}
        <motion.div
          key="group-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className='bg-gradient-to-b from-indigo-200/40 shadow-lg'>
            <CardHeader>
              <CardTitle>{groupData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{groupData.description}</p>
              <div className="text-sm">
                <div className="font-semibold">Owner: {groupData.ownerDetails.firstName} {groupData.ownerDetails.lastName}</div> 
                <div>Phone: {groupData.ownerDetails.phoneNo}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members Card */}
        <motion.div
          key="members"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          
        >
          <Card className='bg-gradient-to-b from-purple-200/40 shadow-lg'>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupData.memberDetails.map((member, index) => (
                  <motion.div
                    key={member._id}
                    className={`cursor-pointer flex items-center gap-4 border p-4 rounded-xl shadow-sm hover:bg-white/70 ${selectedMember == member._id ? "bg-white/70" : "bg-inherit"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => setSelectedMember(member._id)}
                  >
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.firstName}`} />
                      <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                      <div className="text-xs text-muted-foreground">Phone: {member.phoneNo}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Card */}
        <motion.div
          key="map"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className='bg-gradient-to-b from-green-200/20 to-blue-200/40 shadow-lg'>
            <CardHeader>
              <CardTitle>Member Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[380px] bg-muted rounded-xl flex items-center justify-center">
                <MapView groupId={groupId} userId={userId} memberDetails={groupData.memberDetails} selectedMember={selectedMember} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
