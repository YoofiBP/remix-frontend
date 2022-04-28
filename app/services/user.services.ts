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

type NewUser = {
    name: string;
    email: string;
    password: string;
}

export class UnAuthenticatedError extends Error {
}

const create = async (user: NewUser) => {
    try {
        const response = await fetch(generateFullBackendUrl('api/users'), {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return response;
    } catch (e) {
        console.error(e)

    }
}

const list = async () => {
    try {
        const response = await fetch(generateFullBackendUrl('api/users'), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return await response.json();
    } catch (e) {
        console.error(e)
    }
}

const getUser = async (userID: string, auth: Auth) => {

    const response = await fetch(generateFullBackendUrl('api/users/' + userID), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
    })
    if (!response.ok) {
        if (response.status === 401) throw new UnAuthenticatedError();
        throw {
            status: response.status
        }
    }
    return await response.json();

}

const getCurrentProfile = async (auth: Auth) => {
    const response = await fetch(generateFullBackendUrl('api/users/me'), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        credentials: 'include'
    })
    if (response.status === 401) throw new UnAuthenticatedError()
    return await response.json();
}

export default {create, list, getUser, getCurrentProfile};