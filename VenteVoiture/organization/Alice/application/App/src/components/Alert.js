import React from 'react';

function Alert({message, classN, display, setAlert}) {
    return (
        display ?
            <div className="columns">
                <div className="column is-8 is-offset-2-desktop is-offset-1-tablet">
                    <article className={"message " + classN}>
                        <div className="message-header">
                            <p>{classN === "is-success" ? "Success" : "Error"}</p>
                            <button className="delete" aria-label="delete" onClick={() => setAlert(false)}/>
                        </div>
                        <div className="message-body">
                            {message}
                        </div>
                    </article>
                </div>
            </div> :
            null
    );
}

/*
<div className="columns">
    <div className="column is-8 is-offset-2">
        <div className={"notification " + classN + " is-light"}>
            <button className="delete" />
            {message}
        </div>
    </div>
</div>*/
export default Alert;