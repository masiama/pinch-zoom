let panning = false;
let zooming = false;

let startX0;
let startY0;
let startX1;
let startY1;
let endX0;
let endY0;
let endX1;
let endY1;
let startDistance;
let width;
let height;

let cZoom = 1.0;
let cOffsetX = 0;
let cOffsetY = 0;
let cWidth;
let cHeight;

let nZoom;
let nHeight;
let nWidth;
let nOffsetX;
let nOffsetY;
let centerX;
let centerY;
let percentX;
let percentY;

let img;

let start = e => {
	img = document.querySelector('img');
	img.height = height = cHeight = img.height;
	img.width = width = cWidth = img.width;
	
	cOffsetX = (window.innerWidth - width) / 2;
	cOffsetY = (window.innerHeight - height) / 2;
	
	img.style.left = cOffsetX + 'px';
	img.style.top = cOffsetY + 'px';
	
	img.ontouchstart = touchStart;
	img.ontouchmove = touchMove;
	img.ontouchend = touchEnd;
	img.ontouchcancel = touchCancel;
}

let touchStart = e => {
	panning = false;
	zooming = false;
	if (e.touches.length == 1) {
		panning = true;
		startX0 = e.touches[0].pageX;
		startY0 = e.touches[0].pageY;
	}
	if (e.touches.length == 2) {
		zooming = true;
		startX0 = e.touches[0].pageX;
		startY0 = e.touches[0].pageY;
		startX1 = e.touches[1].pageX;
		startY1 = e.touches[1].pageY;
		
		centerX = (startX0 + startX1) / 2;
		centerY = (startY0 + startY1) / 2;
		percentX = (centerX - cOffsetX) / cWidth;
		percentY = (centerY - cOffsetY) / cHeight;
		startDistance = Math.sqrt(Math.pow((startX1 - startX0), 2) + Math.pow((startY1 - startY0), 2));
	}
}

let touchMove = e => {
	e.preventDefault();
	
	if (panning) {
		endX0 = e.touches[0].pageX;
		endY0 = e.touches[0].pageY;
		nOffsetX = cOffsetX + endX0 - startX0;
		nOffsetY = cOffsetY + endY0 - startY0;
		img.style.left = nOffsetX + 'px';
		img.style.top = nOffsetY + 'px';
	}
	if (zooming) {
		endX0 = e.touches[0].pageX;
		endY0 = e.touches[0].pageY;
		endX1 = e.touches[1].pageX;
		endY1 = e.touches[1].pageY;
		
		nZoom = Math.sqrt(Math.pow(endX1 - endX0, 2) + Math.pow(endY1 - endY0, 2)) / startDistance * cZoom;
		nWidth = width * nZoom;
		nHeight = height * nZoom;
		
		nOffsetX = cOffsetX + (cWidth - nWidth) * percentX + (endX0 + endX1) / 2 - centerX;
		nOffsetY = cOffsetY + (cHeight - nHeight) * percentY + (endY0 + endY1) / 2 - centerY;
		
		img.style.left = nOffsetX + 'px';
		img.style.top = nOffsetY + 'px';
		img.width = nWidth;
		img.height = nHeight;
	}
}

let touchEnd = e => {
	if (panning) panning = false;
	if (zooming) {
		zooming = false;
		cOffsetX = nOffsetX;
		cOffsetY = nOffsetY;
		cWidth = nWidth;
		cHeight = nHeight;
		cZoom = nZoom;
	}
	cOffsetX = nOffsetX;
	cOffsetY = nOffsetY;
}

let touchCancel = e => panning = zooming = false;