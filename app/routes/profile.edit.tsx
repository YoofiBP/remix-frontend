import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {
    getAuthTokenFromRequest,
    getUserIdFromRequest
} from "~/services/session.services";
import userServices, {UnAuthenticatedError, ValidationError} from "~/services/user.services";
import {Form, useLoaderData} from "@remix-run/react";
import type {UserData} from "~/routes/profile";

export const loader: LoaderFunction = async ({request}) => {
    const token = await getAuthTokenFromRequest(request);
    const userID = await getUserIdFromRequest(request);

    try {
        const abortController = new AbortController();
        const user = await userServices.getUser({userID},{token}, abortController.signal);
        return json(user);
    } catch (err) {
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
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        const newUser: {
            [idx: string]: string
        } = {};

        if(typeof name === 'string'){
            newUser.name = name;
        }
        if(typeof email === 'string'){
            newUser.email = email;
        }
        if(typeof password === 'string'){
            newUser.password = password;
        }

        await userServices.update({userID}, {token}, newUser)

        return redirect('/profile');

    } catch (err) {
        if(err instanceof UnAuthenticatedError){
            return redirect('signin')
        } else if(err instanceof ValidationError){
            return json({
                body: ''
            },
                {
                    status: 422
                })
        }
    }

}

export default function EditUser(){
    const user = useLoaderData<UserData>();

    return (
        <div className={'container-fluid'}>
            <div className={'row justify-content-center pt-5'}>
                <div className={'col-6 card'}>
                    <div className={'p-3'}>
                        <div className={'row'}><h4>Edit Profile</h4></div>
                        <Form className={'p-5'} method={'post'}>
                            <div className={'form-group row'}>
                                <label className={'col-2'} htmlFor={'name'}>Name:</label>
                                <input defaultValue={user.name} className={'col-10 form-control'} placeholder={'Enter name'} id={'name'} name={'name'}/>
                            </div>
                            <div className={'form-group row'}>
                                <label className={'col-2'} htmlFor={'email'}>Email:</label>
                                <input defaultValue={user.email} className={'col-10 form-control'} type='email' placeholder={'Enter email'} id={'email'} name={'email'}/>
                            </div>
                            <div className={'form-group row'}>
                                <label className={'col-2'} htmlFor={'password'}>Password: </label>
                                <input className={'col-10 form-control'} type={'password'} placeholder={'Enter password to change'} id={'password'} name={'password'} />
                            </div>
                            <div className={'row justify-content-center'}>
                                <button type={'submit'} className={'btn btn-primary col-10'}>Submit</button>
                            </div>
                        </Form>
                        </div>
                </div>
            </div>
        </div>
    )
}