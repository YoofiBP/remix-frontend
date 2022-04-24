import config from '../config/config';

export const generateFullBackendUrl = (route: string) => {
    if(route[0] === '/'){
        route = route.substring(1)
    }
    return `${config.backendBaseUrl}/${route}`;
}

type NewUser = {
    name: string;
    email: string;
    password: string;
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

export default {create};