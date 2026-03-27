import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full">
            <div className="p-4">
                <h2 className="text-lg font-bold">FYP Management System</h2>
            </div>
            <nav className="mt-4">
                <ul>
                    <li>
                        <Link to="/dashboard" className="block p-2 hover:bg-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/projects" className="block p-2 hover:bg-gray-700">
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link to="/submissions" className="block p-2 hover:bg-gray-700">
                            Submissions
                        </Link>
                    </li>
                    <li>
                        <Link to="/feedback" className="block p-2 hover:bg-gray-700">
                            Feedback
                        </Link>
                    </li>
                    <li>
                        <Link to="/standups" className="block p-2 hover:bg-gray-700">
                            Standups
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;