import Navbar from "~/components/Navbar";

export default function Profile(){
    return (
        <div className={'container-fluid'}>
            <Navbar/>
            <div className={'row justify-content-center pt-5'}>
                <div className={'col-6 card'}>
                    <div className={'p-3'}>
                    <div className={'row'}><h4>Profile</h4></div>
                    <div className={'row'}>
                        <div className={'col-2'}>
                            <i className="bi bi-person-circle"/>
                        </div>
                        <div className={'col-8'}>
                            <div className={'row'}>
                                Jane Smith
                            </div>
                            <div className={'row'}>
                                <small>
                                    jane@smith.com
                                </small>
                            </div>

                        </div>
                        <div className={'col-2'}>
                            <button className={'btn btn-light mr-2'}>
                            <i className="bi bi-pencil-fill"/>
                            </button>
                            <button className={'btn btn-light'}>
                                <i className="bi bi-trash"/>
                            </button>
                        </div>
                    </div>
                        <hr />
                        <h6>Joined Today</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}