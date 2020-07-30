import React, { useState, useEffect } from 'react';
import { List, message, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';

const demo = { height: '400px', overflow: 'auto' };

function InfiniteListExample(props) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [ page, setPage] = useState(1);
	const [ totalDocs, setTotalDocs] = useState();

	useEffect(() => {
		
		fetchData(res => {
			setData(res.data.posts.docs)
			setTotalDocs(res.data.posts.totalDocs)
			setPage(res.data.posts.page + 1)
		})
	}, [])
  
	const fetchData = callback => {
	  clienteAxios.get(`/productos?limit=${8}&page=${page}`).then((res) => {
		  callback(res);
	  })
	};
  
	const handleInfiniteOnLoad = () => {
	  setLoading(true);
	  if (data.length === totalDocs) {
		message.warning('Toda la lista ha sido cargada');
		setLoading(false);
		setHasMore(false);
		return;
	  }
	  fetchData(res => {
		setData(data.concat(res.data.posts.docs));
		setLoading(false);
	  });
	};
	
	  return (
		<div style={demo}>
		  <InfiniteScroll
			initialLoad={false}
			pageStart={0}
			loadMore={handleInfiniteOnLoad}
			hasMore={!loading && hasMore}
			useWindow={false}
		  >
			<List
			  dataSource={data}
			  renderItem={item => (
				<List.Item key={item._id}>
				  <List.Item.Meta
					title={item.nombre}
				  />
				  <div>Content</div>
				</List.Item>
			  )}
			>
			  {loading && hasMore && (
				<div>
				  <Spin />
				</div>
			  )}
			</List>
		  </InfiniteScroll>
		</div>
	  );
}

export default withRouter(InfiniteListExample);
