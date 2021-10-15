import React from 'react';
import {Link} from 'react-router-dom';

const AsideBar = () =>
        <aside className="menu">
            <p className="menu-label">
                General
            </p>
            <ul className="menu-list">
                <li><Link to = "/myCars">My cars</Link></li>
                <li>
                    <Link to = "/carToBuy">Car To Buy</Link>
                </li>
            </ul>
        </aside>

export default AsideBar;