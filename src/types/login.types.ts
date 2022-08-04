export interface PostLoginPayload {
    email: string;
    password: string;
}
  
export interface PostLoginResponse {
    token: string;
    error?: string;
    
}

export interface LoginState{
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