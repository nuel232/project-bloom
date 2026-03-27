import React, { useEffect, useState } from 'react';
import { submissionService } from '../services/submissionService';
import { useAuth } from '../hooks/useAuth';

const Submissions = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (user) {
                const data = await submissionService.getSubmissionsByUserId(user.uid);
                setSubmissions(data);
            }
        };

        fetchSubmissions();
    }, [user]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Submissions</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-b-2 border-gray-300 px-4 py-2">Title</th>
                        <th className="border-b-2 border-gray-300 px-4 py-2">Status</th>
                        <th className="border-b-2 border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission.id}>
                            <td className="border-b border-gray-300 px-4 py-2">{submission.title}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{submission.status}</td>
                            <td className="border-b border-gray-300 px-4 py-2">
                                {/* Add action buttons for editing or deleting submissions */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Submissions;