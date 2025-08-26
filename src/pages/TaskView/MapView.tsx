import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Assignment, Task } from "../TaskDashboard";
import TaskPopupCard from "./TaskPopupCard";
import L, { LatLng } from "leaflet";
import { useSession } from "@/providers/SessionProvider";
import { FirebaseService } from "@/lib/firebase/FirebaseService";
import { ref, onValue, set } from 'firebase/database';

const db = FirebaseService.getInstance().getRealtimeDB();

type Props = {
  assignment: Assignment;
  tasks: Task[];
  onTaskAddedOrUpdated: () => void;
};

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // replace with your own
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
  className: 'user-marker-icon'
});


export default function GeocodingMapView({ assignment, tasks, onTaskAddedOrUpdated }: Props) {
  const [showAddedTasks, setShowAddedTasks] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; lat: number; lng: number }[]
  >([]);
  const [userLocation, setUserLocation] = useState<number[] | null>();
  const [assigneeLocation, setAssigneeLocation] = useState<number[] | null>(null);
  const mapRef = useRef<any>(null);
  const { userId } = useSession();

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLocation = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(newLocation);

        if(userId === assignment.assigneeId) {
          set(ref(db, `assignments/${assignment._id}`), {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: Date.now(),
          })
        }

        if (mapRef.current) {
          mapRef.current.setView(newLocation, mapRef.current.getZoom());
        }
      },
      (err) => {
        console.error("Failed to get live location", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if(userId !== assignment.ownerId) return;
    const assignmentRef = ref(db, `assignments/${assignment._id}`);
    const unsubscribe = onValue(assignmentRef, (snapshot) => {
      const val = snapshot.val() || {};
      if(val) {
        setAssigneeLocation([val.lat, val.lng]);
      }
    })

    return () => {
      unsubscribe();
    }
  },[])


  const handleSearch = async () => {
    if (!search) return;
    try {
      const result = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${search}${ userLocation && `&proximity=${userLocation[1]},${userLocation[0]}` }&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const results = result.data.features.map((location: any) => ({
        lng: location.geometry.coordinates[0],
        lat: location.geometry.coordinates[1],
        name: location.properties.full_address,
      }));
      console.log(results)
      setSearchResults(results);
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  if (!userLocation) return <p>Loading map...</p>;

  return (
    <div className="space-y-4 ">
      <div className="flex gap-2">
        <input
          className="border px-2 py-1 w-full rounded"
          type="text"
          placeholder="Search for a place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          // color="green"
          // className="bg-gray-300 data-[state=checked]:bg-blue-500"
          checked={showAddedTasks}
          onCheckedChange={setShowAddedTasks}
          id="task-toggle"
        />
        <Label htmlFor="task-toggle">Show { showAddedTasks ? "Search Results" : "Added tasks" }</Label>
      </div>
      {userLocation && (
        <MapContainer
          className="z-20"
          center={new LatLng(userLocation[0], userLocation[1])}
          zoom={12}
          style={{ height: "500px", width: "100%" }}
          // whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {
            assigneeLocation &&
            <Marker
              key="assignee-location"
              position={new LatLng(assigneeLocation[0], assigneeLocation[1])}
              icon={userIcon}
            >
              <Popup>
                <p className="font-bold">{assignment.assigneeDetails.firstName}</p>
              </Popup>
            </Marker>
          }
          <Marker
            key="user-location"
            position={new LatLng(userLocation[0], userLocation[1])}
            icon={userIcon}
          >
            <Popup>
              <p className="font-bold">YOU!</p>
            </Popup>
          </Marker>
          {
            showAddedTasks ?
            tasks.map((task, idx) => (
              <Marker
                key={`${task.name}-${idx}`}
                position={[task.latitude, task.longitude]}
              >
                <Popup>
                  <TaskPopupCard 
                    sequenceNo={idx + 1} 
                    assignment={assignment} 
                    task={task} 
                    userLat={userLocation[0]} 
                    userLng={userLocation[1]}
                    // userLat={37.7785} 
                    // userLng={-122.4056}
                    onMarkFinished={onTaskAddedOrUpdated} 
                  />
                </Popup>
              </Marker>
            ))
            :
            searchResults.map((result, idx) => (
              <Marker key={`result-${idx}`} position={[result.lat, result.lng]}>
                <Popup>
                  <p className="font-bold">Address: {result.name}</p>
                  {
                    userId === assignment.ownerId && 
                    <AddTaskPopup
                      lat={result.lat}
                      lng={result.lng}
                      assignmentId={assignment._id}
                      onSuccess={() => {
                        onTaskAddedOrUpdated()
                      }}
                    />
                  }
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>
      )}
    </div>
  );
}
