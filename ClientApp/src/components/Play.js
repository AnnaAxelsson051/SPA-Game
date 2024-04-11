
import './Play.css'
import { HubConnectionBuilder } from "@microsoft/signalr";
import authService from './api-authorization/AuthorizeService';
import { notification } from "antd";
import React, { useState, useEffect } from 'react';


const Play = () => {
    const [connection, setConnection] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [guess, setGuess] = useState('');
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false); 
    const [incompletedGame, setIncompletedGame] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const connect = new HubConnectionBuilder().withUrl("/gamehub").build();
        console.log(connect);

        setConnection(connect);
    }, []);


/* Starts a WebSocket connection 
When a "NewGame" event is received triggers a notification to inform 
user that a new game has started */

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on("NewGame", (gameid) => {
                        notification.open({
                            message: "A new Game was started",
                            description: gameId,
                        });
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);  

/* 
Gets access token from the authService to 
include in the request headers for authentication 
Fetches user profile data from server 
If successful returns the fetched user profile data. */

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
                return data;
            } catch (error) {
                console.error('An error occured while attempting to fetch user profile:', error);
            }
        };

        fetchData().then((response) => {
            setUserId(response.userId);
        });

    }, []); 

/* Checks if there's a cached game in the local storage 
and sets state variables accordingly. If a cached game 
exists and current user ID matches cached 
game's user ID sets the incompletedGame state to 
true, indicating an incomplete game for current 
user */

    useEffect(() => {
        const cachedGame = localStorage.getItem('game');
        if (cachedGame && cachedGame !== 'undefined') {
            const parsedGame = JSON.parse(cachedGame)
            if (gameId == null) {
                setGameId(parsedGame.gameId);
            }

            if (!gameStarted) {
                console.log("parsedGame", JSON.stringify(parsedGame));

                if (parsedGame.userId == userId) {
                    setIncompletedGame(true);
                }
            }
        }

    }, [gameId, userId]);

/* Sends a request to create a new game, 
updating the game state with the new game ID if success. 
Notifies other users via WebSocket if available, 
caches the game ID along with the user ID locally 
for future reference */

    const startNewGame = async () => {
        try {
            const token = await authService.getAccessToken();
            const response = await fetch('/api/game/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setGameId(data.gameId);
            if (connection) await connection.send("NotifyNewGame", data.gameId);
            setResult('');
            setMessage('');
            setGameStarted(true);
            setIncompletedGame(false);
            localStorage.setItem('game', JSON.stringify({ gameId: data.gameId, userId: userId }));
        } catch (error) {
            console.error('An error occured while attempting to start a new game:', error);
        }
    };


    return (
        <div>
            <h2>Guessing Game</h2>
            <div className="gameBox">
                <button onClick={startNewGame} className="startBoxBackGround">Start a New Game</button>
            </div>
            <p>Please make a guess between 1 to 10 </p>

            {incompletedGame ? (
                <p>Continue with previous game with gameId: {gameId}; or if you want to start new game click on Start New Game button</p>
            ) : (<p></p>)} 

            {(gameStarted || incompletedGame)  && (
                <div className="userInput">
                    <p>
                        <input type="number" className="userInputField" value={guess} onChange={(e) => setGuess(e.target.value)} />
                    </p>
                    <p>
                        <button onClick={submitGuess} className="submitGuessButton">Submit my Guess</button>
                    </p>
                    <p>{result}</p>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default Play;
