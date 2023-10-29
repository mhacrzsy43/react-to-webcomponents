var timers = "";
$("#cc").hide();
$("h3").hide();
$("#lc").hide();
$("body").hide();
let val = 0;
let status = 1;
let speed2 = 1;
let texts = "";
let contText = $("#container span");
getRem2(414, 100);
window.onbeforeunload = function (event) {
	if (IosOpt()) {
		debugger;
	}
};
function getRem2(pwidth, prem) {
	var html = document.getElementsByTagName("html")[0];
	var oWidth =
		document.body.clientWidth || document.documentElement.clientWidth;
	html.style.fontSize = (oWidth / pwidth) * prem + "px";
}
//联系QQ 1074587055 ，大量优质three.js源码
function isMobile() {
	if (
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	)
		return true;
	return false;
}
function IosOpt() {
	let mobileIos = false;
	let isIos = navigator.userAgent
		.toLowerCase()
		.match(/cpu iphone os (.*?) like mac os/);
	if (isIos) {
		//ios
		let info = isIos[1].replace(/_/g, ".").split(".")[0];
		if (info < 13) {
			mobileIos = true;
		}
	} else {
		// other
	}

	return mobileIos;
}
$(document.body).css({
	"overflow-x": "hidden",
	"overflow-y": "hidden",
});
function typeSet() {
	$("#carT1 li").eq(1).trigger("click");
	$("#bgCar").trigger("click");
}

function showUiDom() {
	typeSet();
	$("#cc").show();
	$("#ui").show();
	$("h3").show();
	$("#logoLoading").hide();
	$("#container").hide();
	$("#container").remove();
	$("#mad").remove();
	$("#logoLoading").remove();
	$("#logoLoading").remove();
	//$("#btnOk",parent.document).show();
	$("#back", parent.document).show();
}
