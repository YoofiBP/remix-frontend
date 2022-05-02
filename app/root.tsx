import type {LinksFunction, LoaderFunction, MetaFunction} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData,
} from "@remix-run/react";
import Navbar from "~/components/Navbar";
import {getAuthTokenFromRequest} from "~/services/session.services";
import {json, redirect} from "@remix-run/node";


export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css',
      integrity: 'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css'
    }
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({request}) => {
  const userID = await getAuthTokenFromRequest(request);

  const unProtectedRoutes = ['/signin', '/signup']

  if(typeof userID === 'string'){
    return json({
      isAuthenticated: true
    })
  } else {
    if(!unProtectedRoutes.includes(new URL(request.url).pathname)){
      return redirect('/signin');
    }
    return json({
    isAuthenticated: false}
    )
  }
}

export default function App() {
  const {isAuthenticated} = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>Welcome to Yoofi Remix</title>
      </head>
      <body>
      <Navbar isAuthenticated={isAuthenticated}/>
        <Outlet />
        <ScrollRestoration />
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
                integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
                crossOrigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
                integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
                crossOrigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
                integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
                crossOrigin="anonymous"/>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
