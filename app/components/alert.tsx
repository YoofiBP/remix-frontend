type Props = {
    message: string;
    type: 'warning' | 'danger'
}

export default function AlertMessage({message, type}: Props) {
    return <div className={'container'}>
        <div className={`alert alert-${type} mt-3`} role="alert">
            {message}
        </div>
    </div>
}