import {Form, useActionData} from "@remix-run/react";
import Navbar from "~/components/Navbar";
import type {ActionFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import userServices from '../services/user.services';

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string'){
        return json({
            error: 'Invalid data. Username, email and password required'
        }, {
            status: 400
        })
    }


    const response = await userServices.create({
            name,
            email,
            password
        })


    if(response?.status === 422 || response?.status === 400){
        return json({
            error: 'Invalid data. Username, email and password required'
        }, {
            status: 422
        })
    } else  if(response?.status === 500){
        return json({
            error: 'Something went wrong'
        }, {
            status: 500
        })
    }

    return redirect('signin')
}

export default function SignUp() {
    const errors = useActionData();
    return (
        <div className={'container-fluid'}>
            <Navbar/>
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
                {errors && <div className="alert alert-warning" role="alert">
                    {errors.error}
                </div>}
            </Form>
            </div>
        </div>
    )
}