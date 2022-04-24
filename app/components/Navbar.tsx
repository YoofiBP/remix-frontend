import {Link} from "@remix-run/react";

export default function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">MERN SKELETON</Link>
            <Link to={'/'}><i className="bi bi-house-door-fill" style={{color: 'red'}}/></Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin">Sign In</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}