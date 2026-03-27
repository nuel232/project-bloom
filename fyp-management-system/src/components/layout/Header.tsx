import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">FYP Management System</h1>
            <div>
                {/* User information or actions can be added here */}
            </div>
        </header>
    );
};

export default Header;