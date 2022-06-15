import {useCatch, useLoaderData} from "@remix-run/react";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getAuthTokenFromRequest, getUserIdFromRequest} from "~/services/session.services";
import userService, {User} from "~/services/user.services";
import AlertMessage from "~/components/alert";

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

export const action: ActionFunction = async ({request, params}) => {
    const userID = await getUserIdFromRequest(request);
    const token = await getAuthTokenFromRequest(request);
    const followingID = params.user;

    if(typeof followingID !== 'string'){
        return json({
          error: 'Invalid user'
        }, {
            status: 500
        })
    }

    try {
        await userService.follow({
            followerID: userID,
            followingID
        }, {
            token
        })
        return redirect('/users')
    } catch (e) {
        console.log(e)
        return json({
            error: 'Something went wrong'
        }, {
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
            <form method="post">
                <button type="submit" className="btn btn-warning mb-3">Follow</button>
            </form>
        </div>
    </div>)
}

export function CatchBoundary(){
    const caught = useCatch();

    if(caught.status === 400){
        return <AlertMessage message={'Unknown user!'} type={'danger'}/>
    }else {
        return <AlertMessage message={'Whoops! There was a problem loading users list'} type={'warning'}/>
    }
}