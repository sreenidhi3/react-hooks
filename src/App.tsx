import { useEffect, useMemo, useReducer, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import { postLogin } from './services/login.services';
import { getUser, getUsers } from './services/user.services';
import { User } from './types/users.types';

let emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

interface LoginState{
  email:{
    value: string;
    error: string;
    touched: boolean;
  },
  password:{
    value: string;
    error: string;
    touched: boolean;
  }
}

interface ReducerAction{
  type: string;
  payload?:any;
}

const LoginReducer = (state:LoginState, action:ReducerAction):LoginState=>{
  switch (action.type){
    case "ON_EMAIL_CHANGE":
      let updatedEmail = {value: action.payload, error:""}
      if(! emailRegex.test(action.payload)){
        updatedEmail.error = "Enter a valid email"
      }
      return {...state, email: {...state.email, ...updatedEmail} }
    case "ON_PASSWORD_CHANGE":
      let updatedPassword = {value: action.payload, error:""}
      if(action.payload.length < 6){
        updatedPassword.error="Password should be greater than 6 characters"
      }
      return {...state, password:{...state.password, ...updatedPassword} }
    case "SET_EMAIL_TOUCHED":
      return {...state, email:{...state.email, touched:true}}
    case "SET_PASSWORD_TOUCHED":
      return {...state, password:{...state.password, touched:true}}
    default:
      return state
  }
}

const Login=()=>{
  const [token, setToken] = useState<string>("")
  let navigate = useNavigate()
  let initialState = {
    email:{
      value: "eve.holt@reqres.in",
      error: "",
      touched: false
    },
    password:{
      value: "cityslicka",
      error: "",
      touched: false
    }
  }

  const [loginState, dispatch] =  useReducer(LoginReducer,initialState)

  const handleSubmit = async ()=>{
   const token = postLogin({email: loginState.email.value, password:loginState.password.value}).then((data)=>{
      setToken(data.token);
      console.log(data)
  }).then((data)=>navigate("/users")).catch(err => console.log(err))
}

  return (
    <div >
      <header style={{padding: "3rem", margin:"auto"}}>

        <div>
          <label> Email: <br/>
            <input type="text" placeholder='Email' 
              value={loginState.email.value} 
              onChange={(e)=>dispatch({type: "ON_EMAIL_CHANGE", payload: e.target.value})}
              onBlur={()=>dispatch({type:"SET_EMAIL_TOUCHED"})}    
            />
          </label>
          {loginState.email.touched && <p  style={{color:"red", fontSize: "12px"}}>{loginState.email.error}</p>}
        </div>

        <div>
          <label> Password: <br/>
            <input type="password" placeholder='Password' 
              value={loginState.password.value} 
              onChange={(e)=>dispatch({type: "ON_PASSWORD_CHANGE", payload: e.target.value})}
              onBlur={()=>dispatch({type:"SET_PASSWORD_TOUCHED"})}    
            />
          </label>
          {loginState.password.touched &&  <p style={{color:"red", fontSize: "12px"}}>{loginState.password.error}</p>}
        </div>  

        <button onClick={handleSubmit}>Login</button>

        <h4>{token}</h4>
      </header>
    </div>
  );
}

const UserDetails=()=>{
  const [user, setUser] = useState<User>()
  // const [id, setId] = useState<string | undefined>()
  
  let  {userId} = useParams();
  // console.log(useParams())
  useEffect(()=>{
   getUser(userId as string).then((res)=>setUser(res.data))
  },[])
  console.log(user)
  return(
    <div>
      <img src = {user?.avatar} alt = {user?.first_name}/>
      <div>
        {user?.first_name } {user?.last_name}
        <br/>
        {user?.email}
      </div>
    </div>
  )
}

const UserList=()=>{
  const [users, setUsers] = useState<User[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [isAscending, setAscending] = useState<boolean>(true)

  const filteredUsers= useMemo(()=>
    users.filter(
      (user)=>
        user.first_name.toLowerCase().includes(searchText.toLowerCase()) || 
        user.last_name.toLowerCase().includes(searchText.toLowerCase())
      ), [users, searchText]
    )

  const sortedUsers = useMemo(()=>
    isAscending ? 
      filteredUsers.sort((a,b)=> a.first_name >b.first_name ? 1 : -1) 
      : filteredUsers.sort((a,b)=> a.first_name < b.first_name ? 1: -1 )
      ,[filteredUsers, isAscending])

  useEffect(()=>{
    getUsers().then((data)=> setUsers(data.data))
    // console.log(users)
  },[])

  return(
    <div>
      <input type="text" placeholder="Search..." onChange={(e)=>setSearchText(e.target.value)}/>
      <button onClick={()=>setAscending(!isAscending)}>
        {isAscending ? "Sort Descending" :"Sort Ascending"}
      </button>
    <table>
      <tbody>
      <tr>
        <th>Avatar</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
      </tr>
      {sortedUsers.map((user)=> 
        <tr key={user.id} >
        <td><Link to={user.id.toString()}><img src={user.avatar}/></Link></td>
        <td>{user.first_name}</td>
        <td>{user.last_name}</td>
        <td>{user.email}</td>
      </tr>
      )}
      </tbody>
    </table>
    </div>
  )

}

function App() {
  // const [email, setEmail] =  useState<string>("eve.holt@reqres.in")
  // const [password, setPassword] =  useState<string>("cityslicka")
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/users" element={<UserList/>}/>
      <Route path="/users/:userId" element={<UserDetails />} />
    </Routes>
  </BrowserRouter>)
}

export default App;
