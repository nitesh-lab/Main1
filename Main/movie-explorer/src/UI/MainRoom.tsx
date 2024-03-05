import { useQuery } from '@tanstack/react-query';
import { getUser } from '../services/userData';
import { useAuth } from '../Context/Auth';
import useAxiosPrivate from '../hooks/useAxios';
import { useNavigate } from 'react-router-dom';

function FitnessDashboard(){

  const nav=useNavigate();
  const {axiosPrivate}=useAxiosPrivate();
  const {auth}=useAuth();

  const workoutSummary=null;
  const recentActivities=null;
  
  const {data,isLoading}=useQuery({
      queryKey:["user",auth],
      queryFn:()=>getUser(auth,axiosPrivate),
      enabled:true,
      staleTime:5*60*1000,
    },);

  function onJoinRoomClick(){  
    nav("/room");   
  }

  if(!auth){
    nav("/login");
  }

  if(isLoading){
    return <div><p>loading...</p></div>
  }

  return (
    data && <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-8 lg:px-16 xl:px-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src={data.message.avatar} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
          <span className="text-lg font-semibold">{data.message.Name}</span>
        </div>
        <button onClick={onJoinRoomClick} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Join Room</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Workout Summary</h2>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <h3 className="font-semibold">Total Workouts</h3>
              <p>{workoutSummary?.totalWorkouts}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Duration</h3>
              <p>{workoutSummary?.totalDuration}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Calories Burned</h3>
              <p>{workoutSummary?.totalCaloriesBurned}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div>
            {recentActivities?.map(activity => (
              <div key={activity.id} className="mb-4">
                <h3 className="font-semibold">{activity.activityType}</h3>
                <p><strong>Duration:</strong> {activity.duration}</p>
                <p><strong>Calories Burned:</strong> {activity.caloriesBurned}</p>
                <p><strong>Date:</strong> {activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FitnessDashboard;
