function User ({user}){

    const rankColor = {1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32'};
    return (
        <div className=" pl-1 pr-1 mb-2 has-border-sm is-flex is-justify-content-space-between">
            <div className="card-content p-2">
                <div className="media">
                <div className="media-left">
                    <figure className="image is-48x48">
                    <img
                        src={user.avatar}
                        alt="avatar"
                    />
                    </figure>
                </div>
                <div className="scroll media-content">
                    <p className="has-text-weight-semibold is-size-5">{user.name}</p>
                    <p className="subtitle is-6">{user.pts} <span className="icon" style={{color: '#FFD700'}}>
                                <i className="fas fa-star"></i>
                    </span></p>
                </div>
                </div>
            </div>
            <div className="is-flex is-align-items-center has-text-weight-bold is-size-2 pr-5" style={{'color': rankColor[user.rank] || 'black'}}>
            {user.rank <= 3 && `#${user.rank}`}
            </div>
        </div>
    );
}

export default User;