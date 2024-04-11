//
import React, { useState, useEffect } from 'react';
import './TopList.css';

// Retrieves the highest scores data from the server 
// updates the component's state with the received data

const TopList = () => {
    const [highestScores, setHighestScores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/top-list');
                const data = await response.json();
                setHighestScores(data);
            } catch (error) {
                console.error('Error fetching the highest scores:', error);
            }
        };

        fetchData();
    }, []);

    //renders a list of highest scores, displaying each user's name 
    //and their highest points achieved
    return (
        <div>
            <h2 className="headLine">Highest Scores</h2>
            <ul className="">
                {highestScores.map(score => (
                    <li key={score.userId}>
                        User Name: {score.userName},
                        Highest Points: {score.highestPoints}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopList;
