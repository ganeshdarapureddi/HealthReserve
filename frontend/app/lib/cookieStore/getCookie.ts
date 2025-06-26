 "use server"
import { cookies } from 'next/headers';

import { Decrypt } from '../auth';

export async function GetCookie(key:string):Promise<string|null>{

    const userCookie = (await cookies()).get(key)?.value;
  
    const validatedCookie = Decrypt(userCookie);
    return validatedCookie;
    
}

export default async function GetTokenFromCookie(key:string){
    const userCookie = (await cookies()).get(key)?.value;
    console.log("token from Cookie:",userCookie)
    return userCookie;
}