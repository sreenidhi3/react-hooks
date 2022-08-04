import { PostLoginPayload, PostLoginResponse } from "../types/login.types";
import { UsersResponse, User, SingleUserResponse } from "../types/users.types";

export const getUsers = ():Promise<UsersResponse>=>{
    return fetch("https://reqres.in/api/users")
        .then((res) => res.json()
        ).then((data)=>{
            return data as UsersResponse
        })
}


export const getUser = (id:string):Promise<SingleUserResponse>=>{
    return fetch(`https://reqres.in/api/users/${id}`)
        .then((res) => res.json()
        ).then((data)=>{
            return data as SingleUserResponse
        })
}