
import './Home.css';
import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
        <div>

<h1> Welcome to the Guessing Game &nbsp;🔢 </h1>
<h4>About the Game </h4>
<p>The Guessing Game offers an engaging experience where you can test your intuition and luck.
Challenge yourself to guess the correct number between 1 and 10 within 10 attempts!
Each correct guess earns you points, with the chance to earn up to 100 points per game.
Be careful though, as each incorrect guess deducts 20 points from your score.</p>

<h4>Features</h4>
<p>Track your progress with a personalized profile page displaying game statistics, including the number of games played and won.
Compete for the top spot on the highscore leaderboard, with both daily and historical rankings available.
Your game progress is automatically saved, allowing you to pick up right where you left off whenever you return to the game.
</p>

<h4>Get Started &nbsp;🚀</h4>
<p>Ready to join? Register now to start playing!</p>
        </div>
    );
  }
}
