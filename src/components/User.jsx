function User ({user, handleUserDelete, handleView}){

    const rankColor = {1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32'};
    return (
        <div className="pl-1 parent pr-1 mb-2 has-border-sm is-flex is-justify-content-space-between" style={{position: 'relative'}}>
            <div className="card-content hover-shade p-2">
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
            <div className="is-flex hover-shade is-align-items-center has-text-weight-bold is-size-2 pr-5" style={{'color': rankColor[user.rank] || 'black'}}>
            {user.rank <= 3 && `#${user.rank}`}
            </div>
            <div style={
                {
                    position:'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            className="child">
                <button onClick={handleView} className="has-text-grey m-2 p-4 icon is-size-4">
                    <i className="fas fa-eye"></i>
                </button>
                <button onClick={() => handleUserDelete(user)} className=" has-text-danger m-2 p-4 icon is-size-4">
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}

export default User;