import React from 'react';
import Login from './Login';
import Logout from './Logout';
import UsageInstructions from './UsageInstructions';
import backgroundImage from '../background.png';

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
                        backgroundImage: `url(${backgroundImage})`, 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', 
                        minHeight: '100vh', 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '5px',
                        marginTop: '-80px', 
                    }}
                >
                    <Login onLogin={onLogin} />
                </div>
            )}
        </>
    );
}

export default Home;
