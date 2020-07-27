import React from 'react'
import {Pagination} from 'antd';
import './pagination.scss'

export default function pagination(props) {
    const {blogs, location, history} = props;
    const currentPage = parseInt(blogs.page);
    console.log(location)

    const onChangePage = newPage => {
        history.push(`${location.pathname}?page=${newPage}`)
    }

    return (
        <div className="pagination  mb-3">
            <Pagination
                defaultCurrent={currentPage}
                total={blogs.totalDocs}
                onChange={newPage => onChangePage(newPage)}
                
            />
        </div>

    )
}
