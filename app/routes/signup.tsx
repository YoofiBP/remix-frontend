import {Form, Link, useActionData} from "@remix-run/react";
import type {ActionFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import userServices, {ValidationError} from '../services/user.services';
import AlertMessage from "~/components/alert";

export const action: ActionFunction = async ({request}) => {
    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string'){
            return json({
                isSuccess: false,
                error: 'Invalid data. Username, email and password required'
            }, {
                status: 400
            })
        }

        await userServices.create({
            name,
            email,
            password
        })

        return json({
            isSuccess: true,
        });
    } catch (e) {
        if(e instanceof ValidationError) {
            return json({
                isSuccess: false,
                error: e.body
            }, {
                status: 422
            })
        }

        return new Response('Something went wrong', {
            status: 500
        })
    }
}

type LoaderData = {
    error?: any;
    isSuccess: boolean;
}

export default function SignUp() {
    const data = useActionData<LoaderData>();

    if(typeof document !== 'undefined' && data?.isSuccess){
       document.getElementById('showModal')?.click()
    }

    return (
        <div className={'container-fluid'}>
            <div className={'row justify-content-center pt-4'}>
            <Form className={'col-6 card p-5'} method={'post'}>
                <h3 className={'pb-1 text-center'}>Sign Up</h3>
                <div className={'form-group row'}>
                    <label className={'col-2'} htmlFor={'name'}>Name:</label>
                    <input className={'col-10 form-control'} placeholder={'Enter name'} id={'name'} name={'name'}/>
                </div>
                <div className={'form-group row'}>
                    <label className={'col-2'} htmlFor={'email'}>Email:</label>
                    <input className={'col-10 form-control'} type='email' placeholder={'Enter email'} id={'email'} name={'email'}/>
                </div>
                <div className={'form-group row'}>
                    <label className={'col-2'} htmlFor={'password'}>Password: </label>
                    <input className={'col-10 form-control'} type={'password'} placeholder={'Enter email'} id={'password'} name={'password'} />
                </div>
                <div className={'row justify-content-center'}>
                <button type={'submit'} className={'btn btn-primary col-10'}>Submit</button>
                </div>
            </Form>
                {data?.error && <AlertMessage message={data?.error} type={'warning'}/>}
                <button hidden={true} type={'button'} id={'showModal'} data-target={'#successModal'} data-toggle={'modal'}/>
                <div className="modal fade" id="successModal" tabIndex={-1} role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">New Account</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                New account successfully created
                            </div>
                            <div className="modal-footer">
                                <Link to={'/signin'}><button type="button" className="btn btn-primary">Sign In</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CatchBoundary(){
    return <AlertMessage message={'Whoops something went wrong!'} type={'warning'}/>
}