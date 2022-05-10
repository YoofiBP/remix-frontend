import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {
    json,
    redirect,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData
} from "@remix-run/node";
import {
    getAuthTokenFromRequest,
    getUserIdFromRequest
} from "~/services/session.services";
import userServices, {UnAuthenticatedError, ValidationError} from "~/services/user.services";
import {Form, useLoaderData} from "@remix-run/react";
import type {UserData} from "~/routes/profile";
import {convertBufferToImageSrc} from "~/routes/profile";

export const loader: LoaderFunction = async ({request}) => {
    const token = await getAuthTokenFromRequest(request);
    const userID = await getUserIdFromRequest(request);

    try {
        const abortController = new AbortController();
        const user = await userServices.getUser({userID},{token}, abortController.signal);
        user.image = convertBufferToImageSrc(user.image.data, user.image.contentType);
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
        const uploadHandler = unstable_createMemoryUploadHandler({maxFileSize: 500_000})
        const formData = await unstable_parseMultipartFormData(request, uploadHandler);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const about = formData.get('about');
        const profilePicture = formData.get('picture');

        const newUserData = new FormData();

        if(typeof name === 'string'){
            newUserData.set('name', name)
        }
        if(typeof email === 'string'){
            newUserData.set('email', email)
        }
        if(typeof password === 'string'){
            newUserData.set('password', password)
        }
        if(typeof about === 'string'){
            newUserData.set('about', about);
        }
        if(profilePicture instanceof File){
            newUserData.set('picture', profilePicture)
        }

        await userServices.update({userID}, {token}, newUserData)

        return redirect('/profile');

    } catch (err) {
        console.error(err)
        if(err instanceof UnAuthenticatedError){
            return redirect('signin')
        } else if(err instanceof ValidationError){
            return json({
                body: ''
            },
                {
                    status: 422
                })
        } else {
            return json({
                body: ''
            },  {
                status: 500
            })
        }
    }

}

export default function EditUser(){
    const user = useLoaderData<UserData>();

    const handleFileChange = (event:any) => {
        const image = event.target.files[0];
        if(image){
            const imageUrl = URL.createObjectURL(image);
            const imagePlaceholder = document?.getElementById('userImage') as HTMLImageElement;
            if(imagePlaceholder){
                imagePlaceholder.src = imageUrl
            }
        }
    }

    return (
        <div className={'container-fluid'}>
            <div className={'row justify-content-center pt-5'}>
                <div className={'col-6 card'}>
                    <div className={'p-3'}>
                        <div className={'row'}><h4>Edit Profile</h4></div>
                        <Form className={'p-5'} method={'post'} encType={'multipart/form-data'}>
                            <div className={'form-group align-items-center'}>
                                <div className={'row  justify-content-center'}>
                                    <img id={'userImage'} src={user.image} alt={'owners profile'} height={100} width={100} />
                                </div>
                                <div className={'row  justify-content-center'}>
                                    <input accept={'image/*'}  type={'file'} name={'picture'} id={'picture'} onChange={handleFileChange}/>
                                </div>
                            </div>
                            <div className={'form-group row'}>
                                <label className={'col-2'} htmlFor={'name'}>Name:</label>
                                <input defaultValue={user.name} className={'col-10 form-control'} placeholder={'Enter name'} id={'name'} name={'name'}/>
                            </div>
                            <div className={'form-group row'}>
                                <label className={'col-2'} htmlFor={'about'}>About:</label>
                                <textarea rows={4} defaultValue={user.about} className={'col-10 form-control'} placeholder={'Enter About'} id={'about'} name={'about'}/>
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