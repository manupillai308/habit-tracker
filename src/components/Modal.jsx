import ReactDOM from 'react-dom';
import { useEffect } from 'react';

function Modal({title, children, actionButtons, closeButton, portalClass}) {
//   useEffect(() => {
//     document.body.classNameList.add('overflow-hidden');

//     return () => {
//       document.body.classNameList.remove('overflow-hidden');
//     };
//   }, []);

  return ReactDOM.createPortal(
    <div>
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                <p className="modal-card-title">{title}</p>
                {closeButton}
                </header>
                <section className="modal-card-body">
                    {children}
                </section>
                <footer className="modal-card-foot">
                {actionButtons}
                </footer>
            </div>
        </div>
    </div>,
    document.querySelector(portalClass)
  );
}

export default Modal;
