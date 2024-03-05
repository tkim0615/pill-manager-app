import React from 'react';
import Login from './Login'
import Logout from './Logout'
import UsageInstructions from './UsageInstructions'


function Home({user, onLogin, onLogOut}) {
    
  return(
    <>
      {user ? 
              (<div>
              <p>Welcome {user.name}!</p>
              <UsageInstructions />
              <Logout onLogOut={onLogOut}/>
              </div>) 
              : 
              (<div>
                <div>
                  <h1>Welcome to Pill Manager</h1>
                    <p>
                      Manage your prescriptions with ease. Sign up or log in to get
                      started.
                    </p>
                </div>
              <Login onLogin={onLogin} />
              </div>)
          }
    
    </>
  )}

export default Home;

