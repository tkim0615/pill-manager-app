

import React from 'react'
import pill_emoji from '../pill_emoji.png'

function UsageInstructions() {
  
  return (
    <div className="usage-instructions">
      <h2>Simple guide to Pill Manager <img src={pill_emoji} alt="Pill Emoji" style={{ width: '30px', height: '40px' }}/></h2>
      <ol>
        <li>
          Add your new prescription details. Edit or delete prescription if necessary.
        </li>
        <li>
          Once you've taken the dosage as directed, click a button to create a
          dosage history.
        </li>
        <li>
          Track all your dosage histories and monitor the progress for each
          prescription.
        </li>
        <li>
          Additionally, add any drug allergies you have. Allergy detector will
          screen whether you are taking a prescription that you are allergic to.
        </li>
      </ol>
    </div>
  );
}

export default UsageInstructions
