import React, {useState, useEffect} from 'react'


function Doctor() {
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        fetch('/doctors')
          .then((r) => {
            if (!r.ok) {
              throw new Error('Failed to load doctors');
            }
            return r.json();
          })
          .then((data) => setDoctors(data))
      }, []);


  return (
    <div>Doctor</div>
  )
}

export default Doctor