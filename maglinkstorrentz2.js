// ==UserScript==
// @name           MagnetLinks4Torrentz2
// @description    Adds direct download links to the result pages of torrentz2.eu. It uses the so-called magnet URI scheme to provide a more user-friendly, faster way to access your favorite torrents.
// @include        https://torrentz2.eu/*
// @include        https://www.torrentz2.eu/*
// @version        1.0.0
// @namespace      https://raw.githubusercontent.com/awm4j/userscripts/master/maglinkstorrentz2.js
// ==/UserScript==



var magnetImg = '<img width="18" style="-webkit-transform: rotate(180deg);-moz-transform: rotate(180deg);-o-transform: rotate(180deg);-ms-transform: rotate(180deg);transform: rotate(180deg);" src="data:image/webm;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAADmElEQVR4nO3cv2vUcBzG8XfiyYkWURDBFvwBxUUdxF8olPoXdFB0qDg42lUU/wI3J2lH3RyUuglFOli0lFbrolgR7VAEUYcKtr3TIXEThZrkTO5y8XlekOm+5Pshvm1oaC4IIOY/FcMF4G4R5wrhdgyXijhXNwnLHsDK5QDEOQBxDkCcAxDnAMQ5AHEOQJwDEFfLuvD1wkKzXq9vaucwrRgfH3927erVY2XP8bv3i4tlj/CHRxMTby+PjOxPWuOfAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIyvxnUNzDwcgtsaOcwAEM9PZ/nVlZ2pq1bW13d2u5ZWjU2OvquVqulfufS4ObNy8fX1ra3e56Hk5PLqYsCiLMcDWjEELf76IeZrDOlHcBwURczhNtFzXUNpjpxLQ/AdNosvgWIcwDiHIA4ByDOAYhzAOIcgDgHIC7zk8Au9DGAp0kLYlgqarMInofQk7LfWSr2n6rKAcxHcL6D+41FMJa0IIAmUO/QPIWoVK1WPAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgrsqvhh0J4d56H0TwmJTXuP7BSAinkxbEsLHgPduuygHsiuHceh+EsBIVvFkIR/+2X5X5FiDOAYhzAOIcgDgHIM4BiHMA6rrt28KzHndgrqhv7y7qaEKz7Ovibwu3ljgAcQ5AnAMQ5wDEOQBxDkCcAxDnAMRV9i+CBqHvOjwpe47f1eBU2TO0qrIB7IPeG9Bb9hxV51uAOAcgzgGIcwDiHIC4zL8F7IGFEOKkNUtwaGMF346pokl4dRF+JK35Av1p58kcwBc4nLYmgu9Zz2f5fIDGJziW9zy+BYhzAOIcgDgHIM4BiHMA4hyAOAcgrhbA/SwLYzgDbEhacwvm6xDkGWgI9u6BXXnO0e2m4c0LWM5zjkfZHrrNBrCUZ59fAmh04v26UZgp+526dh8nYaoT1xIYTvt39S1AnAMQ5wDEOQBxDkCcAxDnAMS18tAm9UFQmhBOxHAlac02eLUDvuXZp9stQd8P2L3eZwHcjGC2oK1mSXkQ1MqbQQ/yzQIRRGnFfYWDX/NuVGERzADjndrPtwBxDkCcAxDnAMQ5AHEOQJwDEPcTpfh13uSSV/AAAAAASUVORK5CYII=">';
// ---------------------------
// part 1: code for the search result details
// ---------------------------
var url = null;
if ((url = location.href.match(/torrentz2\.(eu|com|org|net|info)\/([a-f0-9]{40})/))) {

	if (url != null) {
		var hash = url[2];
		
		console.debug('reading trackers');
		
		// read the tracker list
		var trackerElements = document.getElementsByClassName('trackers')[0].getElementsByTagName('dl');
		
        var trackers = '';
        for(var i=0; i<trackerElements.length; ++i){
            trackers+= '&tr=' + trackerElements[i].getElementsByTagName("dt")[0].innerText;
            
        }

		
		// default trackers
		if (trackers == '' || trackers.length <= 0) {
			console.log('Failed to load trackers, using some default trackers.');
			trackers = '&tr=http://tracker.openbittorrent.com/announce'+
				'&tr=http://tracker.publicbt.com:80/announce'+
				'&tr=http://denis.stalker.h3q.com:6969/announce';
		}
		
		// read title
		var title = document.title.substr(0, document.title.length - 17);
		if (title == '') title = 'unknown torrent';
		
		var magnet = "magnet:?xt=urn:btih:"+hash+trackers+'&dn='+title;
		
		// add downloadlink
        document.getElementById("top").getElementsByTagName("ul")[0].innerHTML+='<li><a href="'+magnet+'" style="background-color:green !important">'+magnetImg+'Maglink</a></li>';
	}

}



// ---------------------------
// part 2: code for the search result overview
// ---------------------------
if (location.href.match(/torrentz2\.(eu|com|org|net|info)\/.*\?[qf]=/)) {
  function hereDoc(f) {
    return f.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
  }

	// the code to insert into torrentz.com
	var embedded_js_code = hereDoc(function() {/*!

			var xmlhttp = null;
			var current_id = -1;

			function download_torrent(id, hash) {
				xmlhttp = new XMLHttpRequest();
				
				if (xmlhttp == null) {
					alert('ERROR: Your browser does not support XML HTTP Request.');
					return;
				}
				
				var url = 'http://'+location.hostname+'/announce_'+hash;
				last_id = id;
				
				xmlhttp.onreadystatechange = function()
					{
						download_ready(id, hash);
					};
				xmlhttp.open('GET', url, true);
				xmlhttp.send(null);
			}

			function download_ready(id, hash) {
				if (id != last_id) return;
				
				if (xmlhttp.readyState == 4) {
					trackers = '&tr=' + xmlhttp.responseText.replace(/[\t\r\n]{2}/gi,'&tr=');
					trackers = trackers.substr(0, trackers.length-4);
					
					// failed to load?
					if (trackers == '' || trackers.length <= 0) {
						alert('Failed to load trackers, using some default trackers.');
					}
					
					// add default trackers
					trackers += '&tr=http://tracker.openbittorrent.com/announce'+
							'&tr=http://tracker.publicbt.com:80/announce'+
							'&tr=http://denis.stalker.h3q.com:6969/announce';
					
					// get title
					el = document.getElementById('resultelement_'+id);
					
					link = el.firstChild.firstChild;
					
					title = link.innerHTML.replace(/<\/?.*?>/gi, ''); // replace html tags
					if (title == '') title = 'unknown torrent';
					
					var magnet = "magnet:?xt=urn:btih:"+hash+"&"+trackers+'&dn='+title;
					
					// nothing pending anymore
					last_id = -1;
					
					// open magnet link
					location.href = magnet;
				}
			}
			
	*/});

	// find result div
	var elem = null;
	var arr = document.getElementsByTagName('div');
	for (i = 0; i < arr.length; i++) {
		if (arr[i].className == 'results') { elem = arr[i]; break }
	}

	// loop through result list (if available)
	if (elem != null) {

		// add some js to the page
		var head, code;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		code = document.createElement('script');
		code.type = 'text/javascript';
		code.innerHTML = embedded_js_code;
		head.appendChild(code);
		
		var el, link, name, hash, dlbutton;
		elem = elem.getElementsByTagName('dl');
		for (var i = 0; i < elem.length; i++)
		{
			el = elem[i];
			
			// change style of this element
			el.setAttribute('style','position:relative;');
			el.setAttribute('id','resultelement_'+i);
			
			// get the name and hash
			link = el.firstChild.firstChild;
			name = link.innerHTML.replace(/<\/?.*?>/gi, ''); // replace html tags
			link = link.href;
			hash = link.match(/torrentz2\.(eu|com|org|net|info)\/([a-f0-9]{40})/)[2];
			
			// append the downloadbutton
			dlbutton = document.createElement('a');
			dlbutton.innerHTML = magnetImg;
			dlbutton.setAttribute('href', 'javascript:download_torrent('+i+',"'+hash+'");');
			dlbutton.setAttribute('title', 'Download \''+name+'\'');
			dlbutton.setAttribute('id','dlbutton_'+i);
			dlbutton.setAttribute('style', 'position:absolute;right:-43px;top:4px;'+
				'border:1px #4995FF solid;'+
				'z-index:10000;'+
				'-moz-border-radius: 3px;'+
				'background: #AACDFF;'+
				'padding:0px 4px 1px;'+
				'margin-right:10px;'+
				'display:block;'+
				'font-family:Verdana;'+
				'font-size:13px;'
			);
			el.appendChild(dlbutton);
		}
	}
}

