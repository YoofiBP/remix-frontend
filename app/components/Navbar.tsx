import {Link} from "@remix-run/react";

type Props = {
    isAuthenticated: boolean;
}

export default function Navbar({isAuthenticated = false}: Props){
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">MERN SKELETON</Link>
            <Link to={'/'}><i className="bi bi-house-door-fill" style={{color: 'red'}}/></Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {isAuthenticated && <><li className="nav-item">
                        <Link className={"nav-link"} to={"/users"}>Users</Link>
                    </li>
                        <li className="nav-item">
                            <Link className={"nav-link"} to={"/logout"}>Logout</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link"} to={"/profile"}>Profile</Link>
                        </li>
                    </>}
                    {!isAuthenticated && <><li className="nav-item">
                        <Link className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin">Sign In</Link>
                    </li>
                        </>}
                </ul>
            </div>
        </nav>
    )
}