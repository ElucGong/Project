import React, { useState } from 'react'
import Homepage from './Homepage'
import History from './History'
import Works from './Works'
import './App.css'

export default function App() {
    const pages = ['首页', '经历', '作品']
    const [curPage, setCurPage] = useState(0)

    const which = () => {
        switch (curPage) {
            case 0:
                return <Homepage />;
            case 1:
                return <History />;
            case 2:
                return <Works />;
            default:
                return null;
        }
    }

    const handleClick = (index) => {
        setCurPage(index)
    }

    return (
        <div>
            {which()}

            <ul>
                {pages.map(
                    (item, index) =>
                        <li
                            key={index}
                            className={index == curPage ? 'active' : ''}
                            onClick={() => handleClick(index)}
                        >
                            {item}
                        </li>
                )}
            </ul>

        </div>
    )
}
