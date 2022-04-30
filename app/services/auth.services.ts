import {generateFullBackendUrl, processErrorResponse} from "~/services/user.services";
import {destroySession, getSessionFromRequest} from "~/services/session.services";
import {redirect} from "@remix-run/node";

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

        await processErrorResponse(response);
        return await response.json();
}

const signOut = async (request:Request) => {
    const session = await getSessionFromRequest(request);

    const response = await fetch(generateFullBackendUrl('/auth/signout'));
    await processErrorResponse(response);

    return redirect('signin', {
        headers: {
            'Set-Cookie': await destroySession(session)
        }
    })
}

export default  { signIn, signOut }