import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import { json, redirect} from "@remix-run/node";
import userServices, { UnAuthenticatedError} from '../services/user.services';
import {getAuthTokenFromRequest, getUserIdFromRequest} from "~/services/session.services";
import {Link, useLoaderData, Form} from "@remix-run/react";
import dayjs from 'dayjs';
import authService from "~/services/auth.services";

export const convertBufferToImageSrc = (buffer: Buffer, mimetype: string) => {
    const b64image = Buffer.from(buffer).toString('base64');
    return `data:${mimetype};base64,${b64image}`
}

export const loader: LoaderFunction = async ({request}) => {
    const token = await getAuthTokenFromRequest(request);
    const userID = await getUserIdFromRequest(request);

    try {
        const abortController = new AbortController();
        const user = await userServices.getUser({userID},{token}, abortController.signal);
        user.image = convertBufferToImageSrc(user.image.data, user.image.contentType);
        return json(user)
    } catch (err) {
        console.error(err)
        if(err instanceof UnAuthenticatedError){
            return redirect('signin')
        }
        return json({
            error: 'Something went wrong'
        }, {
            status: 500
        })
    }
}

export const action: ActionFunction = async ({request}) => {
    try {
        const userID = await getUserIdFromRequest(request);
        const token = await getAuthTokenFromRequest(request);

        await userServices.remove({userID}, {token});

        return await authService.signOut(request);
    } catch (e) {
        if(e instanceof UnAuthenticatedError){
            return redirect('/signin');
        }
        return new Response('Something went wrong', {
            status: 500
        })
    }
}

export type UserData = {
    image: any;
    about: string;
    name: string;
    email:string;
    createdAt: string
}

export default function Profile(){
    const user = useLoaderData<UserData>();
    return (
        <div className={'container-fluid'}>
            <div className={'row justify-content-center pt-5'}>
                <div className={'col-6 card'}>
                    <div className={'p-3'}>
                    <div className={'row'}><h4>Profile</h4></div>
                    <div className={'row'}>
                        <div className={'col-2'}>
                           <img src={user.image} alt={'owners profile'} height={100} width={100} />
                        </div>
                        <div className={'col-8'}>
                            <div className={'row'}>
                                {user.name}
                            </div>
                            <div className={'row'}>
                                <small>
                                    {user.email}
                                </small>
                            </div>
                            <div className={'row'}>
                                {user.about}
                            </div>

                        </div>
                        <div className={'col-2'}>
                           <Link to={'/profile/edit'}> <button className={'btn btn-light mr-2'}>
                            <i className="bi bi-pencil-fill"/>
                            </button>
                           </Link>
                            <Form method={'post'} style={{display: 'inline-block'}}>
                            <button className={'btn btn-light'}>
                                <i className="bi bi-trash"/>
                            </button>
                            </Form>
                        </div>
                    </div>
                        <hr />
                        <h6>Joined {dayjs(user.createdAt).format('ddd MMM D YYYY')}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}