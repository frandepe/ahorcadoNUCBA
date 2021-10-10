import { useState, useEffect } from 'react'

const LoginYProductos = () => {

    const baseURL = 'https://back-sandbox.herokuapp.com/api'

        const [email,setEmail] = useState('');
        const [password,setPassword] = useState('');
        const [token, setToken] = useState(null);
        const [products, setProducts] = useState([]);
        const [page, setPage] = useState(1);
        const [total, setTotal] = useState(0)

        const limit = 5;
 
        const onChangeEmail = (e) => {
            setEmail(e.target.value)
        }

        const onChangePassword = (e) => {
            setPassword(e.target.value)
        }

        const onLogin = async () => {
            try {
                const response = await fetch(`${baseURL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const json = await response.json();
                console.log(json);
                //aca guardo el token del login en el local storage
                localStorage.setItem('token', json.token);
                setToken(json.token);

            }catch (error) {
                alert(error);
            }
        }

        const onGetProducts = async () => {
            try {
                //con ?limit=4 establecemos el limite
                //con &offset= salteamos a los proximos 4:
                //si page vale 1 ahora vale 0 (con el -1) y 0 * 4 es 0 entonces te vas a saltear 0
                //si page vale 2 page -1 es 1, * limit 4... salteate los primeros 4
                
                const response = await fetch(`${baseURL}/products?limit=${limit}&offset=${(page - 1) * limit}`, {
                    method: 'GET',
                    headers: {
                        //¿como obtenemos el header? logueandonos
                        //de esta manera si no te logueas no se muestran los productos
                        'Authorization': `Bearer ${token}`
                    }
                });

                const json = await response.json();
                setProducts(json.data.data);
                setTotal(json.data.total)

            } catch (error) {
                alert(error);
            }
        }

        const onGoBack = () => {
            if (page > 1) {
                setPage(page-1)
            }
            
        }
        const onGoAHead = () => {
            if (page < Math.ceil(total/limit)){
                setPage(page+1)
            }
            
        }

        //esto es para que a penas entre al estado, setee el token y
        //nos mantenga logueados
        useEffect(() => {
            //con get item le decimos la key que queremos buscar
            const localToken = localStorage.getItem('token');
            if (localToken) {
                setToken(localToken)
            }
            
        }, []);

        //escucha [token], si esta token, traeme los productos
        useEffect(() => {
            if (token) {
                onGetProducts()
            }
            //aca se queda escuchando a ver si token cambia para mostrar los productos
            //tambein va a estar escuchando page por si cambio de pagina llama de nuevo los siguientes products
        }, [token, page]);

    return (
        <div>
            <form>
                <input type="text" onChange={onChangeEmail}/>
                <input type="text" onChange={onChangePassword}/>
                <button type="button" onClick={onLogin}>Login</button>
            </form>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map( (p, i) => {
                            return <tr key={i}>
                                    <td>{p.name}</td>
                                    <td>{p.price}</td>
                                </tr>
                        })}
                    </tbody>
                </table>
                <div>
                    <button onClick={onGoBack}>{'<'}</button>
                    <strong style={{margin: "0 15px"}}>{page} de {Math.ceil(total/limit)}</strong>
                    <button onClick={onGoAHead}>{'>'}</button>
                </div>
            </div>
        </div>
    )
}

export default LoginYProductos
