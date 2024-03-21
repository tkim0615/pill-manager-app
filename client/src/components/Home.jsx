import React from 'react';
import Login from './Login';
import Logout from './Logout';
import UsageInstructions from './UsageInstructions';
import backgroundImage from '../background.png'; // Import your PNG file

function Home({ user, onLogin, onLogOut }) {
    return (
        <>
            {user ? (
                
                    <div>
                        <p>Welcome {user.name}!</p>
                        <UsageInstructions style={{ marginTop: '-20' }}/>
                        <Logout onLogOut={onLogOut} />
                    </div>
            ) : (
                <div
                    style={{
                        backgroundImage: `url(${backgroundImage})`, // Set the background image
                        backgroundSize: 'cover', // Make sure the background image covers the entire container
                        backgroundPosition: 'center', // Center the background image
                        minHeight: '100vh', // Set minimum height to cover the entire viewport
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div>
                        <h1>Welcome to Pill Manager</h1>
                        <p>Manage your prescriptions with ease. Sign up or log in to get started.</p>
                    </div>
                    <Login onLogin={onLogin} />
                </div>
            )}
        </>
    );
}

export default Home;
