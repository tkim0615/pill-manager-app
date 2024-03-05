import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'

const SideEffect = ({prescription}) => {
    const [sideEffects, setSideEffects] = useState([])
    const [btnIsClicked, setBtnIsClicked] = useState(false)
    const wikiUrl = 'https://en.wikipedia.org/wiki'
    
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

  return (
        <Container>
            <Button onClick={handleClick} variant="warning" size="sm">
                    See common side effects
            </Button> 

            <ListGroup>
                {btnIsClicked?
                    <div style={{ border: '4px solid red'}}>
                            <strong>Disclaimer</strong>: List shows 5 most common side effects. This is not a comprehensive list.

                        {fiveSe.map(se => (
                            <ListGroup.Item key={se.term} >

                                <strong>Side effect</strong>: {''}
                                <a  style={{ textDecoration: "none" }}
                                    href={`${wikiUrl}/${se.term.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
                                    {se.term}
                                </a>
                            </ListGroup.Item>
                        ))}
                    </div>
                    :
                    null
                }   
            </ListGroup>
        </Container>

        )
}

export default SideEffect
