export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface ResponseObject {
  code: number;
  data?: User | User[];
}
