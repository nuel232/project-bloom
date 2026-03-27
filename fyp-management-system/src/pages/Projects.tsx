import React, { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        try {
            await projectService.deleteProject(id);
            setProjects(projects.filter(project => project.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Projects</h1>
            {user?.role === 'admin' && <button onClick={() => {/* logic to create a new project */}}>Create Project</button>}
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.name}
                        {user?.role === 'admin' && (
                            <>
                                <button onClick={() => {/* logic to edit project */}}>Edit</button>
                                <button onClick={() => handleDelete(project.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;