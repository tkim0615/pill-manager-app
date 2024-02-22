import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

const SideEffect = ({prescription}) => {
    const [sideEffects, setSideEffects] = useState([])
    const [btnIsClicked, setBtnIsClicked] = useState(false)

    const handleClick =() =>{
        setBtnIsClicked(btnIsClicked=>!btnIsClicked)
        const drugName = prescription.name
        const drugNameSplit = drugName.split(' ')[0]

        fetch(`https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:${drugNameSplit}&count=patient.reaction.reactionmeddrapt.exact`)
            .then(r=>{
                if(!r.ok){
                    throw new Error('Failed to fetch adverse events')
                }else{
                    return r.json()
                }
            })
            .then(se => setSideEffects(se.results))
    }
    const fiveSe = sideEffects.slice(0, 5)
    console.log(fiveSe)


  return (

        <Container>
            <Button onClick={handleClick} variant="warning" size="sm">
                    See common side effects
            </Button> 

            <ListGroup>
                {btnIsClicked && fiveSe.map(se => (
                    <ListGroup.Item key={se.term}>
                        Side effect: {se.term}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>

        )
}

export default SideEffect
//render for each prexcription list - when clicked fetch top 5 side effects