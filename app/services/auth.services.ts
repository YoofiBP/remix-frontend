import {generateFullBackendUrl} from "~/services/user.services";

type LoginCreds = {
    email: string;
    password: string;
}

const signIn = async (credentials: LoginCreds) => {
    try {
        const response = await fetch(generateFullBackendUrl('/auth/signin'), {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return response;
    } catch (e) {
        console.log(e);
    }
}

export default  { signIn }