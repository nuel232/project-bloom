import React, { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { getStandups } from '../services/standupService';
import { useAuth } from '../hooks/useAuth';

const Standups: React.FC = () => {
    const { user } = useAuth();
    const [standups, setStandups] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(getStandups(), (snapshot) => {
            const standupData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStandups(standupData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Standup Meetings</h1>
            {user && (
                <div>
                    <h2 className="text-xl mt-4">Welcome, {user.email}</h2>
                    <ul className="mt-2">
                        {standups.map(standup => (
                            <li key={standup.id} className="border-b py-2">
                                <h3 className="font-semibold">{standup.title}</h3>
                                <p>{standup.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Standups;