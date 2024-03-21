import React from 'react';
import pillEmoji from '../pill_emoji.png';
import './UsageInstructions.css'; // Import CSS file for additional styling

function UsageInstructions() {
  return (
    <div className="usage-instructions">
      <h2 className="instruction-title">
        Simple guide to Pill Manager{' '}
        <img src={pillEmoji} alt="Pill Emoji" className="pill-emoji" />
      </h2>
      <ol className="instruction-list">
        <li className="instruction-item">
          <span className="instruction-step">Step 1:</span> Add your new prescription details. Edit or delete prescription if necessary.
        </li>
        <li className="instruction-item">
          <span className="instruction-step">Step 2:</span> Once you've taken the dosage as directed, click a button to create a dosage history.
        </li>
        <li className="instruction-item">
          <span className="instruction-step">Step 3:</span> Track all your dosage histories and monitor the progress for each prescription.
        </li>
        <li className="instruction-item">
          <span className="instruction-step">Step 4:</span> Additionally, add any drug allergies you have. Allergy detector will screen whether you are taking a prescription that you are allergic to.
        </li>
      </ol>
    </div>
  );
}

export default UsageInstructions;
