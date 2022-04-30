import {LoaderFunction} from "@remix-run/node";
import authService from "~/services/auth.services";

export const loader: LoaderFunction = async ({request}) => {
    try {
        return await authService.signOut(request);
    } catch (e) {
        console.error(e)
    }

}