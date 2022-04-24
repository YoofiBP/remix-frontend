import Navbar from "~/components/Navbar";
import {Form} from "@remix-run/react";
import authService from '../services/auth.services';
import {ActionFunction, json, redirect} from "@remix-run/node";

export const action: ActionFunction = async ({request})  => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if(typeof email !== 'string' || typeof password !== 'string'){
        return json({
            error: 'Invalid credentials'
        },
            {
                status: 400
            })
    }

    const response = await authService.signIn({
        email,
        password
    })

    const cookies = response?.headers.get('set-cookie');

    if(cookies){
        return redirect('profile', {
            headers: {
                'Set-Cookie': cookies
            }
        });
    }else {
        return json({
            error: 'Login failed'
        }, {
            status: 500
        })
    }


}

export default function SignIn(){
    return (
        <div className={'container-fluid'}>
            <Navbar/>
            <div className={'row justify-content-center pt-4'}>
                <Form className={'col-6 card p-5'} method={'post'}>
                    <h3 className={'pb-1 text-center'}>Sign In</h3>
                    <div className={'form-group row'}>
                        <label className={'col-2'} htmlFor={'email'}>Email:</label>
                        <input className={'col-10 form-control'} type='email' placeholder={'Enter email'} id={'email'} name={'email'}/>
                    </div>
                    <div className={'form-group row'}>
                        <label className={'col-2'} htmlFor={'password'}>Password: </label>
                        <input className={'col-10 form-control'} type={'password'} placeholder={'Enter email'} id={'password'} name={'password'}/>
                    </div>
                    <div className={'row justify-content-center'}>
                        <button type={'submit'} className={'btn btn-primary col-10'}>Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}