import {UnAuthenticatedError, User} from "~/services/user.services";
import {Link, useCatch, useLoaderData} from "@remix-run/react";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {commitSession, getAuthTokenFromRequest, getSessionFromRequest} from "~/services/session.services";
import userServices from "~/services/user.services";

type LoaderData = {
    users: User[];
}

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSessionFromRequest(request);
    const token = await getAuthTokenFromRequest(request);
    const abortController = new AbortController();
    try {
        const users = await userServices.list(abortController.signal, {token});
        return json({
            users
        })
    } catch (e) {
        if(e instanceof UnAuthenticatedError){
            return redirect('/signin', {
                headers: {
                    'Set-Cookie': await commitSession(session)}
            })
        }else {
            throw new Response('Something went wrong', {
                status: 500
            })
        }
    }

}

const ListItem = ({name, id}: {name: string, id: string}) => {
    return (

        <div className="row pt-3 pb-3">
            <div className={'col-11'}>
                <i className="bi bi-person-circle"/>
                <span className={'ml-3'}>{name}</span>
            </div>
            <div className={'col-1'}>
                <Link to={`/users/${id}`}>
                <i className="bi bi-arrow-right"/>
                </Link>
            </div>
        </div>

    )
}

export default function Users(){
    const {users} = useLoaderData<LoaderData>();

    return (
        <div className={'container'}>
            <div className={"row justify-content-center"}>
            <div className={'card col-8 mt-4'}>
                <h3 className={'mt-3'}>All Users</h3>
                <div className={'mb-3'}>
                {users.map(user => <ListItem id={user._id} name={user.name} key={user.email}/>)}
                </div>
            </div>
            </div>
        </div>
    )
}

export function CatchBoundary(){
    return (
        <div className={'container'}>
                <div className="alert alert-warning mt-3" role="alert">
                    Whoops! There was a problem loading users list
                </div>
        </div>
    )


}