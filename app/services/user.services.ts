import config from '../config/config';

export const generateFullBackendUrl = (route: string) => {
    if (route[0] === '/') {
        route = route.substring(1)
    }
    return `${config.backendBaseUrl}/${route}`;
}

type Auth = {
    token: string;
}

export type User = {
    _id: string;
    name: string;
    email: string;
    password: string;
}

type UserParams = {
    userID: string;
}

export class UnAuthenticatedError extends Error {

}

export class ValidationError  {
    body:any

    constructor(body: any) {
        this.body = body;
    }
}

export const processErrorResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            throw new UnAuthenticatedError();
        } else if (response.status  === 422) {
            throw new ValidationError(await response.json());
        }
        else {
            throw {
                status: response.status,
                body: await response.json()
            }
        }
    }
}

const create = async (user: Omit<User, '_id'>) => {
    const response = await fetch(generateFullBackendUrl('api/users'), {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    await processErrorResponse(response);
    return await response.json();
}

const list = async (signal: AbortSignal, auth: Auth) => {
    const response = await fetch(generateFullBackendUrl('api/users'), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        signal
    })
    await processErrorResponse(response);
    return await response.json();
}

const getUser = async (params: UserParams, auth: Auth, signal: AbortSignal) => {
    const response = await fetch(generateFullBackendUrl('api/users/' + params.userID), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        signal
    })
    await processErrorResponse(response)
    return await response.json();
}

const update = async (params: UserParams, auth: Auth, user: FormData) => {
    const response = await fetch(generateFullBackendUrl('api/users/' + params.userID), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        body: user
    })
    await processErrorResponse(response);
    return await response.json();
}

const remove = async (params: UserParams, auth: Auth) => {
    const response = await fetch(generateFullBackendUrl('api/users/' + params.userID), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        method: 'DELETE',
    })

    await processErrorResponse(response);
    return await response.json();
}


export default {create, list, getUser, update, remove};