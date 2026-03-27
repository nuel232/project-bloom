import React, { useEffect, useState } from 'react';
import { getFeedbacks } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';

const Feedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await getFeedbacks();
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      {user && (
        <div>
          <h2 className="text-xl">Your Feedbacks</h2>
          <ul>
            {feedbacks.map((feedback) => (
              <li key={feedback.id} className="border-b py-2">
                <p>{feedback.comment}</p>
                <p className="text-gray-500">Submitted by: {feedback.submittedBy}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!user && <p>Please log in to view your feedback.</p>}
    </div>
  );
};

export default Feedback;