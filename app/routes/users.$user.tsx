import {useCatch, useLoaderData} from "@remix-run/react";
import {json, LoaderFunction} from "@remix-run/node";
import {getAuthTokenFromRequest} from "~/services/session.services";
import userService, {User} from "~/services/user.services";

export const loader: LoaderFunction = async ({request, params}) => {
    try {
        const token = await getAuthTokenFromRequest(request);

        const abortController = new AbortController();

        if(typeof params.user !== 'string'){
            return new Response('Unknown user', {
                status: 400
            })
        }
        const user = await userService.getUser({
            userID: params.user
        }, {token}, abortController.signal);

        return json({
            user
        })
    } catch (e) {
        return new Response('A problem occurred', {
            status: 500
        })
    }

}

export default function UserDetail(){
    const {user} = useLoaderData<{user: User}>();

    return  (<div className={'container'}>
        <div className={'card mt-3 col-10'}>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    </div>)
}

export function CatchBoundary(){
    const caught = useCatch();

    if(caught.status === 400){
        return <div className={'container'}>
            <div className="alert alert-danger mt-3" role="alert">
                Unknown user!
            </div>
        </div>
    }else {
        return <div className={'container'}>
            <div className="alert alert-warning mt-3" role="alert">
                Whoops! There was a problem loading users list
            </div>
        </div>
    }
}