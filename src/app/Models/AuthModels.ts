export interface IRegisterDto {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree?: boolean;
  }
  
  export interface ILoginDto {
    email: string;
    password: string;
  }