import { useState } from 'react'

const Ahorcado = () => {

    const baseURL = 'https://back-sandbox.herokuapp.com/api';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNWY3N2VmNGVmYmQ2MDAwNDg2ZWQyZCIsImlhdCI6MTYzMzY0NjY0OH0.4GmmO3c_hfrjR4-hqqHsLOxyxgFeBnaa8NGUwN2IruU';
    const [letra, setLetra] = useState([]);
    

    const handleChangeInp = (e) => {
            setLetra(e.target.value);
            console.log(e.target.value);
    }

    const ahorcar = async () => {

        try{
            const response = await fetch(`${baseURL}/hanged-game/start`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await response.json()
            setLetra(json.data)
            console.log(json.data);

        } catch (error){
            alert(error)
        }
        

    }

   

    const handleChangeBut = async () => {
        try{
            const response = await fetch(`${baseURL}/hanged-game/try`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    
                },
                body: JSON.stringify({ text: letra })
            });
            const json = await response.json();

            setLetra(json.data)
            console.log(json.data);

        } catch (error){
            alert(error)
        }
    }
    
    return (
        <div>
            
            <button type="button" onClick={ahorcar}>Start</button>
            <input type="text" onChange={handleChangeInp}/>
            <button type='button' onClick={handleChangeBut}>Elegir letra</button>
            

            <div>

                <strong>{`Intentos: ${letra.attempsMade} de ${letra.totalAttemps}`}</strong>
                
                <p>{`Letras erroneas: ${letra.wrongLetters}`}</p>
                <p>{`Cantidad de letras: ${letra.totalWords}`}</p>
                
                <p style={{color: "red", 
                    border: "solid 2px black", 
                    margin: "0 30% 0 30%", 
                    letterSpacing: "10px",
                    padding: "15px"}}>
                    {`${letra.matcheds}`}
                </p>
                
                <strong>{letra.message}</strong>
            
            </div>
            
        </div>
    )
}

export default Ahorcado
