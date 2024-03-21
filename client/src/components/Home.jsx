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
                        minHeight: 'calc(100vh - 80px)', // Adjusted minimum height to cover the entire viewport excluding 80px for the navbar height
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '5px', // Adjusted padding value
                        marginTop: '-80px', // Adjusted margin top to shift everything upwards
                    }}
                >
                    <Login onLogin={onLogin} />
                </div>
            )}
        </>
    );
}

export default Home;
