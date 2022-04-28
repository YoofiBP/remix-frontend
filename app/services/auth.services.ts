import {generateFullBackendUrl, UnAuthenticatedError} from "~/services/user.services";

type LoginCreds = {
    email: string;
    password: string;
}

const signIn = async (credentials: LoginCreds) => {
        const response = await fetch(generateFullBackendUrl('/auth/signin'), {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if(!response.ok){
            if(response.status === 401) throw new UnAuthenticatedError()
            throw {
                status: response.status,
                body: await response.json()
            }
        }
        return await response.json();
}

export default  { signIn }