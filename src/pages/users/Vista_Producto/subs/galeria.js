import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import ImageGallery from 'react-image-gallery';
import ReactImageMagnify from 'react-image-magnify';
import { notification, Spin } from 'antd';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';
import './galeria_custom.scss';

function Galeria(props) {
	const [ count, setCount ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const idproducto = props.id;
	const [ galeria, setGaleria ] = useState([]);
	const [ imagen, setImagen ] = useState([
		{
			original: '',
			thumbnail: ''
		}
	]);

	const [ imagenZoom, setImagenZoom ] = useState();

	function onLoad(imagen) {
		const url = imagen.target.src.split('.com/');// se hace asi porque al poner la variable con la url saltaban warnings del src estaba undefind
		setImagenZoom(url[1]);
	}

	const galery = {
		showPlayButton: false,
		showNav: false,
		showFullscreenButton: false,
		renderItem: myRenderItem,
		onThumbnailClick: onLoad
	};

	if (count < galeria.length) {
		setCount(count + 1);
	}

	useEffect(
		() => {
			async function obtenerImagen() {
				await clienteAxios.get(`/productos/${idproducto}`).then((res) => {
					setImagenZoom(res.data.imagen);
					setImagen([
						{
							original: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${res.data.imagen}`,
							thumbnail: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${res.data.imagen}`
						}
					]);
				});
			}
			async function obtenerGaleria() {
				setLoading(true);
				await clienteAxios
					.get(`/galeria/${idproducto}`)
					.then((res) => {
						setGaleria(res.data.imagenes);
						setLoading(false);
					})
					.catch((res) => {
						if (res.response.status === 404 || res.response.status === 500) {
							setLoading(false);
							notification.error({
								message: 'Error',
								description: res.response.data.message,
								duration: 2
							});
						} else {
							setLoading(false);
							notification.error({
								message: 'Error',
								description: 'Hubo un error',
								duration: 2
							});
						}
					});
			}
			obtenerImagen();
			obtenerGaleria();
		},
		[ idproducto ]
	);

	useEffect(
		() => {
			galeria.forEach((res) => {
				return imagen.push({
					original: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${res.url}`,
					thumbnail: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${res.url}`
				});
			});
		},
		[ count, galeria, imagen ]
	);

	const propiedadesImageMagnify= {
		smallImage: {
			alt: 'imagen-producto',
			src: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagenZoom}`,
			isFluidWidth: true
		},
		largeImage: {
			src: `https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagenZoom}`,
			width: 1140,
			height: 980
		},
		enlargedImagePortalId: 'zoom-render'
	}

	function myRenderItem() {
		return (
			<ReactImageMagnify
				imageClassName="image-gallery-image"
				enlargedImageContainerClassName="image-gallery-image-large-container"
				enlargedImageClassName="image-gallery-image-large"
				className="imagen-gallery-container"
				{...propiedadesImageMagnify}
			/>
		);
	}

	return (
		<Spin spinning={loading}>
			<ImageGallery items={imagen} {...galery} />
		</Spin>
	);
}

export default Galeria;
