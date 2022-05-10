import {createCookieSessionStorage, redirect} from "@remix-run/node";

const { getSession, destroySession, commitSession} = createCookieSessionStorage({
    cookie: {
        name: '__frontSession',
        httpOnly: true,
        secure: true,
        secrets: [process.env.COOKIE_SECRET || 'devsecret'],
        expires: new Date(Date.now() + 900000),
        sameSite: 'lax',
        path: '/'
    }
});

export const getSessionFromRequest = async (request: Request) => {
    return await getSession(request.headers.get('Cookie'));
}

export const getUserIdFromRequest = async (request: Request) => {
    const session = await getSessionFromRequest(request);
    const userID = session.get('userID');
    if(!userID){
        return null;
    }
    return userID;
}

export const getAuthTokenFromRequest = async (request: Request) => {
    const session = await getSessionFromRequest(request);
    const token = session.get('token');
    if(!token){
        return null;
    }
    return token;
}

export const createUserSession = async (userID: string, token: string) => {
    const session = await getSession();
    session.set('token', token);
    session.set('userID', userID);

    return redirect('profile', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })
}

export {getSession, commitSession, destroySession}