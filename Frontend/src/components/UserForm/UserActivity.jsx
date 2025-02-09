import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";

const UserActivity = () => {
	const [userActivity, setUserActivity] = useState([]);

	useEffect(() => {
	  const fetchUserActivity = async () => {
		try {
		  const token = localStorage.getItem("token");
  

  
		  if (!token) {
			console.error("Missing token or userId");
			return;
		  }
  
		  const response = await axios.get('https://startupbihar.in/api/activity/userActivities', {
			headers: { Authorization: token },
		  });
  
		  console.log("API Response:", response.data);
		  setUserActivity(response.data.activities );
		} catch (error) {
		  console.error("Error fetching user activity:", error);
		}
	  };
  
	  fetchUserActivity();
	}, []);
  
const getRelativeTime = (date) => {
		return formatDistanceToNow(parseISO(date), { addSuffix: true });
	};
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {userActivity.length > 0 ? (
        userActivity.map((activity, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-4 items-center">
    
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.subtitle}</p>
              </div>
            </div>

      
			<div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						

						<div className="flex items-end gap-3  ">
							<p className="mt-1 text-sm/6 ">
								{getRelativeTime(activity.timestamp)}
							</p>
						</div>
					</div>
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500 py-4 text-center">No recent activity found.</p>
      )}
    </ul>
  );
};

export default UserActivity;
