import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';


const PrescriptionProgressBar = ({dosageTaken, totalDose}) => {
    const progress = Math.floor((dosageTaken / totalDose) * 100)

    return (

        <ProgressBar now={progress} label={`${progress}% (${dosageTaken} of ${totalDose} doses taken)`} />
  )
}

export default PrescriptionProgressBar