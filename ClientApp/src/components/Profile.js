//
import authService from './api-authorization/AuthorizeService';
import './Profile.css';
import React, { useState, useEffect } from 'react';

/*
fetches and displays the user profile
 information including username, games played, 
 games won and guessing attempts, using data frm 
 from the backend API. */

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await authService.getAccessToken();
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error while attempting to fetching the user profile:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>User Profile</h2>
            {profile ? (
                <div>
                   
                </div>
            ) : (
                <p>Loading</p>
            )}
        </div>
    );
};

export default Profile;

