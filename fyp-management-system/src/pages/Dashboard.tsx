import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { projectService } from '../services/projectService';

const Dashboard: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                const fetchedProjects = await projectService.getProjectsByUser(user.uid);
                setProjects(fetchedProjects);
            }
        };

        fetchProjects();
    }, [user]);

    return (
        <div className="dashboard">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="mt-4">
                <h2 className="text-xl">Your Projects</h2>
                <ul>
                    {projects.map(project => (
                        <li key={project.id} className="border-b py-2">
                            {project.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;