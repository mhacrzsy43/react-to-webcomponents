"use strict";
var build = true;
var aliyunUrl = build ? "./" : "https://*.oss-cn-beijing.aliyuncs.com/libs/";
timers = self.setInterval(countRun, 100);

function countRun() {
	if (status == 2) {
		speed2 = 2;
	}
	if (status == 3) {
		speed2 = 3;
	}
	if (status != 3 && val >= 88) {
		val = 88;
	}
	if (val < 100) {
		val += speed2;
	}
	if (val >= 100) {
		val = 100;
	}
	contText.text(val);
	if (isMobile() || window.innerWidth < 768) {
		$("#mad").css({
			width: 1.2 - 0.012 * val + "rem",
			left: 50 + 0.295 * val + "%",
		});
	} else {
		$("#mad").css({
			width: 0.4 - 0.004 * val + "rem",
			left: 50 + 0.1 * val + "%",
		});
	}
	if (val >= 100) {
		window.clearInterval(timers);
		if (IosOpt()) {
			showUiDom();
			draw();
		} else {
			showUiDom();
		}
	}
}
var box = new THREE.Group();
var degVec = {
	p1: new THREE.Vector3(-451, 144, -140),
	p2: new THREE.Vector3(-451, 144, 140),
	l1: new THREE.Object3D(),
	l2: new THREE.Object3D(),
	isLight: false,
};
var lunguA = [];
var speed = {
	phone: false,
	type: false,
	val: 1,
};
var lunguB = [];
var dt;
var lunguC = [];
var lunguD = [];
var houshiObj = [];
var carTypeA = [];
var carTypeB = [];
var houshi = [
	"painta_a3",
	"plastic_a13",
	"painta_a18",
	"plastic_a12",
	"painta_a31",
	"painta_a34",
];
var runCar = false;
var flaresg = [];
var paintANames = [
	"painta_a27",
	"painta_a21",
	"painta_a22",
	"painta_a9",
	"painta_a32",
	"painta_a28",
	"painta_a12",
];
var paintBNames = ["paintb_a4"];
var paintA = [];
var paintB = [];
var allColors = [
	new THREE.Color(0xa2a2a2),
	new THREE.Color(0x000000),
	new THREE.Color(0x525252),
	new THREE.Color(0x90f),
	new THREE.Color(0x622),
	new THREE.Color(0x50000),
];
var spriteBox = [];
var luntaiGroup = "";
var timer = void 0,
	renderer = void 0,
	scene = void 0,
	camera = void 0,
	cameraPoints = void 0,
	actions = void 0,
	mixer = void 0,
	clock = void 0,
	envMap = void 0,
	envMapboli = void 0,
	controls = void 0,
	Bplace = [];
var namesBody = [
	"che_xin_1_:transform22",
	"che_xin_1_:transform10",
	"polySurface1106",
	"polySurface1074",
	"polySurface1073",
	"polySurface1072",
	"polySurface1086",
];
var carModel = "";
sceneInit();
//联系QQ 1074587055 ，大量优质three.js源码
function sceneInit() {
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector("#cc"),
		antialias: true,
		alpha: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.toneMappingExposure = 0.9;
	renderer.toneMapping = THREE.LinearToneMapping;
	renderer.toneMappingWhitePoint = 1;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		6000
	);
	camera.position.set(-1398, 733, 685);
	controls = new THREE.OrbitControls(camera, document.querySelector("#cc"));
	controls.target.set(0, 100, 0);
	clock = new THREE.Clock();
	controls.enableDamping = true;
	controls.dampingFactor = 0.15;
	controls.panSpeed = 0.1;
	controls.zoomSpeed = 0.2;
	controls.rotateSpeed = 0.05;
	controls.enableKeys = false;
	controls.enablePan = false;
	controls.minDistance = 1450;
	controls.maxDistance = isMobile() ? 2500 : 1950;
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI * 0.45;
	controls.minAzimuthAngle = -Infinity;
	controls.maxAzimuthAngle = Infinity;
	window.addEventListener("resize", onWindowResize, false);
	lightInit();
	envMaps();
	initSprite();
	$("body").show();
	$("#logoLoading").show();
	modelInit();
	if (!IosOpt()) {
		draw();
	}
	lensflares();
	inintGround();
} //联系QQ 1074587055 ，大量优质three.js源码
function lightInit() {
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
	scene.add(ambientLight);
	var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.65);
	hemiLight.position.set(0, 500, 0);
	scene.add(hemiLight);
	var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
	var light = new THREE.DirectionalLight(0xffffff, 0.75);
	light.position.set(-400, 800, 0);
	light.target;
	scene.add(light);
	var spotLight = new THREE.SpotLight(0xffffff, 1, 1600);
	spotLight.position.set(15, 600, 1000);
	spotLight.angle = Math.PI / 7;
	spotLight.penumbra = 0.12;
	spotLight.decay = 2;
	spotLight.lookAt(0, 0, 0);
	scene.add(spotLight);
}
function draw() {
	requestAnimationFrame(draw);
	dt = clock.getDelta();
	TWEEN.update();
	if (mixer) mixer.update(dt);
	controls.update();
	if (runCar) modelControl();
	renderer.render(scene, camera);
	var deg1 = THREE.Math.radToDeg(degVec.p1.angleTo(camera.position));
	var deg2 = THREE.Math.radToDeg(degVec.p2.angleTo(camera.position));
	resizeFlares(deg1, deg2);
}
function modelInit() {
	function loadModel() {
		if (carModel) {
			animateInit(carModel.scene, carModel.animations);
			carModel.scene.scale.set(1000, 1000, 1000);
			drawModel(carModel.scene);
			scene.add(carModel.scene);
			raycasterShow();
		} else {
		}
	}
	var manager = new THREE.LoadingManager(loadModel);
	var loading = 0;
	manager.onProgress = function (item, loaded, total) {
		var val = parseInt((loaded / 30).toFixed(2) * 100);
		if (loaded == total) {
			status = 3;
		}
	}; //联系QQ 1074587055 ，大量优质three.js源码
	var loader = new THREE.GLTFLoader(manager);
	loader.load(
		"./model/car.gltf",
		function (gltf) {
			carModel = gltf;
		},
		onProgress,
		onError
	);

	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = (xhr.loaded / xhr.total) * 100;
			var value = Math.round(percentComplete, 2);
			if (value == 100) {
				status = 2;
			}
		}
	}
	function onError(e) {
		console.log(e);
	}
}
function animateInit(model, animations) {
	mixer = new THREE.AnimationMixer(model);
	actions = {};
	for (var i = 0; i < animations.length; i++) {
		var clip = animations[i];
		var action = mixer.clipAction(clip);
		actions[clip.name] = action;
		action.clampWhenFinished = true;
		action.loop = THREE.LoopOnce;
	}
}
function drawModel(model) {
	var fs = 0;
	model.traverse(function (object) {
		if (object.isMesh) {
			object.material.combine = THREE.MixOperation;
			if (object.name.indexOf("pSphere") != -1) {
				dispose(object);
			}
			if (object.name.indexOf("paint") != -1) {
				object.material.envMap = envMapboli;
				(object.material.reflectivity = 1),
					(object.material.refractionRatio = 1);
				object.material.envMapIntensity = 1;
			}
			if (object.name.indexOf("glass") != -1) {
				object.material.envMap = envMap;
				object.material.metalness = 1;
				object.material.roughness = 0;
				object.material.refractionRatio = 1;
				object.material.reflectivity = 1;
				object.material.transparent = true;
				object.material.opacity = 0.8;
				object.material.envMapIntensity = 20;
			}
			if (object.name.indexOf("glassa") != -1) {
				object.material.envMap = envMap;
				object.material.color = new THREE.Color(0x000000);
				object.material.metalness = 1;
				object.material.roughness = 0;
				object.material.refractionRatio = 1;
				object.material.reflectivity = 1;
				object.material.transparent = true;
				object.material.opacity = 0.5;
				object.material.envMapIntensity = 1;
			}
			if (object.name.indexOf("glassB") != -1) {
				object.material.envMap = envMap;
				object.material.color = new THREE.Color(0xa52a2a);
				object.material.metalness = 1;
				object.material.roughness = 0;
				object.material.refractionRatio = 1;
				object.material.reflectivity = 1;
				object.material.transparent = true;
				object.material.opacity = 0.8;
				object.material.envMapIntensity = 1;
			}
			if (object.name.indexOf("glassC") != -1) {
				object.material.envMap = envMap;
				object.material.color = new THREE.Color(0xffffff);
				object.material.metalness = 1;
				object.material.roughness = 0;
				object.material.refractionRatio = 1;
				object.material.reflectivity = 1;
				object.material.transparent = true;
				object.material.opacity = 0.5;
				object.material.envMapIntensity = 1;
			}
			if (
				object.name.indexOf("pCube") != -1 ||
				object.name.indexOf("pcube") != -1
			) {
				object.visible = false;
			}
			if (
				object.name.indexOf("metal") != -1 ||
				object.name.indexOf("lungu") != -1 ||
				object.name.indexOf("shachepan") != -1
			) {
				(object.material.reflectivity = 1),
					(object.material.refractionRatio = 1);
				object.material.envMapIntensity = 1;
				if (object.name.indexOf("lungu") != -1) {
					object.material.envMap = envMap;
					object.material.roughness = 0.1;
					object.material.metalness = 0.5;
					(object.material.reflectivity = 1),
						(object.material.refractionRatio = 3);
					object.material.envMapIntensity = 7;
				}
				if (paintBNames.indexOf(object.name) != -1) {
				}
			}
			if (object.name.indexOf("plastic") != -1) {
				(object.material.reflectivity = 1),
					(object.material.refractionRatio = 1);
				object.material.envMapIntensity = 1;
			}
		}
		if (paintANames.indexOf(object.name) != -1) {
			if (object.type == "Group") {
				object.children.map(function (t) {
					paintA.push(t);
				});
			} else {
				paintA.push(object);
			}
		}
		if (paintBNames.indexOf(object.name) != -1) {
			if (object.type == "Group") {
				object.children.map(function (t) {
					paintB.push(t);
				});
			} else {
				paintB.push(object);
			}
		}
		if (object.name.indexOf("xuanzhuan_cube") != -1) {
			luntaiGroup = object;
			object.material.opacity = 0;
			object.material.transparent = true;
			object.children.map(function (f) {
				if (f.name.indexOf("lungu") != -1) {
					if (f.name.indexOf("lunguA") != -1) {
						lunguA.push(f);
					}
					if (f.name.indexOf("lunguB") != -1) {
						lunguB.push(f);
					}
					if (f.name.indexOf("lunguC") != -1) {
						f.children.map(function (t) {
							lunguC.push(t);
						});
					}
					if (f.name.indexOf("lunguD") != -1) {
						lunguD.push(f);
					}
				}
			});
			toggleLungu(0);
		}
		if (object.name.indexOf("second") != -1) {
			if (object.type == "Group") {
				object.children.map(function (t) {
					carTypeA.push(t);
				});
			} else {
				carTypeA.push(object);
			}
		}
		if (object.name.indexOf("first") != -1) {
			if (object.type == "Group") {
				object.children.map(function (t) {
					carTypeB.push(t);
				});
			} else {
				carTypeB.push(object);
			}
		}
	});
} //联系QQ 1074587055 ，大量优质three.js源码
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
function envMaps() {
	var path1 = aliyunUrl + "vr/";
	var format = ".jpg";
	envMapboli = new THREE.CubeTextureLoader().load([
		path1 + "CubeMap_R_0001" + format,
		path1 + "CubeMap_L_0001" + format,
		path1 + "CubeMap_U_0001" + format,
		path1 + "CubeMap_D_0001" + format,
		path1 + "CubeMap_B_0001" + format,
		path1 + "CubeMap_F_0001" + format,
	]);
	envMapboli.format = THREE.RGBFormat;
	envMapboli.minFilter = THREE.LinearFilter;
	envMap = envMapboli;
	var geometry = new THREE.SphereBufferGeometry(2500, 24, 24);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		map: new THREE.TextureLoader().load("./img/TOY.jpg"),
		side: THREE.BackSide,
	});
	material.map.flipY = false;
	var sphere = new THREE.Mesh(geometry, material);
	sphere.rotation.x = -Math.PI;
	sphere.rotation.y = -Math.PI / 2;
	sphere.name = "bgSphere";
	sphere.position.y += 200;
	scene.add(sphere);
}
function raycasterShow() {
	animateInit(carModel.scene, carModel.animations);
	document.addEventListener("click", ray);
	document.addEventListener("touchstart", ray);
	scene.getObjectByName("biaozhu14").position.y = 0.06;
	scene.getObjectByName("biaozhu14").material.transparent = true;
	scene.getObjectByName("biaozhu14").material.opacity = 0;
	scene.getObjectByName("biaozhu14").material.alphaTest = 0.05;
	scene.getObjectByName("dimian").position.y = -0.002;
	scene.getObjectByName("dimian").material.color = new THREE.Color(0x000000);
	var clonems = scene.getObjectByName("polySurface3316").material.clone();
	scene.getObjectByName("polySurface3316").material = clonems.clone();
	scene.getObjectByName("polySurface3316").material.roughness = 1;
	scene.getObjectByName("polySurface3316").material.metalness = 0.1;
	scene.getObjectByName("polySurface4326").position.x = -0.002;
	toggleCarColor(2);
	houshi.map(function (f) {
		var o = scene.getObjectByName(f);
		if (!o) {
			return false;
		}
		var m = o.material.clone();
		o.material = m.clone();
		if (o.name == "painta_a31" || o.name == "painta_a34") {
			o.material.color = new THREE.Color(0x525252);
			o.material.envMap = envMapboli;
			o.material.envMapIntensity = 5;
			houshiObj.push(o);
		} else {
			o.material.color = new THREE.Color(0x102);
		}
	});
	scene.getObjectByName("glass_ab11").material.color = new THREE.Color(
		0x202020
	);
	scene.getObjectByName("glass_ab11").material.opacity = 0.85;
	var cloneglass = scene.getObjectByName("glass_a10_cc7").material.clone();
	scene.getObjectByName("glass_a10_cc7").material = clonems.clone();
	scene.getObjectByName("glass_a10_cc7").material.color = new THREE.Color(
		0x000000
	);
	scene.getObjectByName("glass_a10_cc7").material.opacity = 0.75;
	scene.getObjectByName("glass_a10_cc7").material.transparent = true;
	dispose(scene.getObjectByName("glassC_a2"));
	dispose(scene.getObjectByName("glassC_a3"));

	function ray() {
		var Sx = "";
		var Sy = "";
		if (isMobile()) {
			speed.phone = true;
			Sx = event.touches[0].pageX;
			Sy = event.touches[0].pageY;
		} else {
			Sx = event.clientX;
			Sy = event.clientY;
		}
		var x = (Sx / $("#cc").width()) * 2 - 1;
		var y = -(Sy / $("#cc").height()) * 2 + 1;
		var standardVector = new THREE.Vector3(x, y, 0.5);
		var worldVector = standardVector.unproject(camera);
		var ray = worldVector.sub(camera.position).normalize();
		var raycaster = new THREE.Raycaster(camera.position, ray);
		var intersects = raycaster.intersectObjects(Bplace);
		if (intersects.length > 0) {
			var obj = intersects[0].object;
			if (obj.name.indexOf("sprite") != -1) {
				if (!obj.anStats) {
					actions[obj.anType].reset().play();
					obj.anStats = 1;
					tweenPos(obj, obj.vec2);
				} else {
					tweenAn(actions[obj.anType]);
					obj.anStats = 0;
					tweenPos(obj, obj.vec1);
				}
			}
		}
	}
} //联系QQ 1074587055 ，大量优质three.js源码
domColorToggle();
$.event.special.swipe.horizontalDistanceThreshold = 10;

function domColorToggle() {
	var index = 0;
	$(".pre").on("click", function () {
		if (index == 0) {
			return false;
		} else {
			index--;
			var leftVal = -index * 0.65 + "rem";
			$("#toggleColor").animate(
				{
					left: leftVal,
				},
				800
			);
		}
	});
	$(".next").on("click", function () {
		if (index >= 6) {
			return false;
		} else {
			index++;
			var leftVal = -index * 0.65 + "rem";
			$("#toggleColor").animate(
				{
					left: leftVal,
				},
				800
			);
		}
	});
	$("#toggleColor").on("click", "li", function (e) {
		if ($(this).find("div").hasClass("togs")) {
			return false;
		}
		$(this).find("div").addClass("togs");
		$(this).siblings().find("div").removeClass("togs");
		toggleCarColor(
			$(this).attr("ad").split("&")[0],
			$(this).attr("ad").split("&")[1]
		);
	});
	$("#toggleColor").bind("swipeleft", function (e) {
		if (!isMobile()) return false;
		if (index >= 6) {
			return false;
		} else {
			index += 3;
			var leftVal = -index * 0.65 + "rem";
			$("#toggleColor").animate(
				{
					left: leftVal,
				},
				250
			);
		}
	});
	$("#toggleColor").bind("swiperight", function (e) {
		if (!isMobile()) return false;
		if (index == 0) {
			return false;
		} else {
			index -= 3;
			var leftVal = -index * 0.65 + "rem";
			$("#toggleColor").animate(
				{
					left: leftVal,
				},
				250
			);
		}
	});
	$("#lungu").on("click", "li", function (e) {
		$("#lungubg li").eq($(this).index()).addClass("opaLungu");
		$("#lungubg li").eq($(this).index()).siblings().removeClass("opaLungu");
		toggleLungu($(this).index());
		$("#lungu").animate(
			{
				opacity: "toggle",
			},
			800
		);
		$("#lungubg").animate(
			{
				opacity: "toggle",
			},
			800
		);
	});
	var chex = true;
	$("#carT1").on("click", "li", function (e) {
		chex = !chex;
		$("#carT2 li").eq($(this).index()).addClass("opaLungu");
		$("#carT2 li").eq($(this).index()).siblings().removeClass("opaLungu");
		if ($(this).index()) {
			$("#bgCar img").eq(1).show();
			$("#bgCar img").eq(0).hide();
		} else {
			$("#bgCar img").eq(0).show();
			$("#bgCar img").eq(1).hide();
		}
		toggleCar($(this).index());
		$("#carT1").animate(
			{
				opacity: "toggle",
			},
			800
		);
		$("#carT2").animate(
			{
				opacity: "toggle",
			},
			800
		);
	});
	$("#lightBtn").on("click", function () {
		degVec.isLight = !degVec.isLight;
		var ob = $(this).find("section");
		speed.type = !speed.type;
		ob.text() == "开启车灯" ? ob.text("关闭车灯") : ob.text("开启车灯");
	});
	$("#sizeBtn").on("click", function () {
		var val = scene.getObjectByName("biaozhu14").material.opacity;
		updateLines(scene.getObjectByName("biaozhu14"), val == 1 ? 0 : 1);
	});
	$("#runBtn").on("click", function () {
		runCar = !runCar;
		scene.getObjectByName("ground").visible =
			!scene.getObjectByName("ground").visible;
		scene.getObjectByName("ground2").visible =
			!scene.getObjectByName("ground2").visible;
		if (runCar) {
			$("#runCar img").eq(1).show();
			$("#runCar img").eq(0).hide();
			$(this).find("section").text("一键停止");
		} else {
			$("#runCar img").eq(0).show();
			$("#runCar img").eq(1).hide();
			$(this).find("section").text("一键启动");
		}
	});
	$(".hubBtn").on("click", function () {
		$("#lungu").animate(
			{
				opacity: "toggle",
			},
			800
		);
		$("#lungubg").animate(
			{
				opacity: "toggle",
			},
			800
		);
	});
	$(".typeBtn").on("click", function () {
		chex = !chex;
		$("#carT1").animate(
			{
				opacity: "toggle",
			},
			800
		);
		$("#carT2").animate(
			{
				opacity: "toggle",
			},
			800
		);
	});
} //联系QQ 1074587055 ，大量优质three.js源码
function inintGround() {
	var ground = new THREE.TextureLoader().load("img/ground2.jpg");
	ground.wrapS = ground.wrapT = THREE.RepeatWrapping;
	ground.repeat.set(1, 1);
	var mesh = new THREE.Mesh(
		new THREE.CircleBufferGeometry(1200, 48),
		new THREE.MeshBasicMaterial({
			map: ground,
			side: THREE.DoubleSide,
			transparent: false,
		})
	);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = isMobile() ? -10 : -10;
	mesh.name = "ground";
	mesh.visible = false;
	scene.add(mesh);
	var mask2 = new THREE.Mesh(
		new THREE.CircleBufferGeometry(2800, 36),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load("img/changjing2.jpg"),
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.955,
			alphaTest: 0.1,
		})
	);
	mask2.rotation.x = -Math.PI / 2;
	if (isNaN(IEVersion())) {
		mesh.material.blending = THREE.CustomBlending;
		mesh.material.blendEquation = THREE.MinEquation;
		mesh.material.blendSrc = THREE.SrcAlphaFactor;
		mesh.material.blendDst = THREE.OneMinusSrcAlphaFactor;
		mask2.material.blending = THREE.CustomBlending;
		mask2.material.blendEquation = THREE.MaxEquation;
		mask2.material.blendSrc = THREE.SrcAlphaFactor;
		mask2.material.blendDst = THREE.OneMinusSrcAlphaFactor;
	}
	mask2.position.y = 2;
	mask2.visible = false;
	mask2.name = "ground2";
	scene.add(mask2);
}
function modelControl() {
	scene.getObjectByName("ground").material.map.offset.x -= 0.004;
	if (speed.type && speed.phone) {
		speed.val = 2;
	} else {
		speed.val = 1;
	}
	scene.getObjectByName("xuanzhuan_cube").rotation.z += 0.1 * speed.val;
	scene.getObjectByName("xuanzhuan_cube2").rotation.z += 0.1 * speed.val;
	scene.getObjectByName("xuanzhuan_cube3").rotation.z += 0.1 * speed.val;
	scene.getObjectByName("xuanzhuan_cube4").rotation.z += 0.1 * speed.val;
}
function resizeFlares(deg1, deg2) {
	if (!degVec.isLight) {
		degVec.l1.visible = false;
		degVec.l2.visible = false;
	} else {
		if (deg1 < 90 && deg2 < 90) {
			degVec.l1.visible = true;
			degVec.l2.visible = true;
		} else if (deg1 <= 90) {
			degVec.l1.visible = true;
			degVec.l2.visible = false;
		} else if (deg2 <= 90) {
			degVec.l1.visible = false;
			degVec.l2.visible = true;
		} else {
			degVec.l1.visible = false;
			degVec.l2.visible = false;
		}
	}
}
function lensflares() {
	var textureLoader = new THREE.TextureLoader();
	var textureFlare0 = textureLoader.load("img/lensflare/po.png");
	var colorLight = new THREE.Color(0xffffff);
	addLight2(0.08, 0.8, 0.5, -388, 188, -138, degVec.l1, 125, colorLight);
	addLight2(0.08, 0.8, 0.5, -388, 188, 138, degVec.l2, 125, colorLight);
	addLight2(0.08, 0.8, 0.5, -388, 132, -144, degVec.l1, 100, colorLight);
	addLight2(0.08, 0.8, 0.5, -388, 132, 144, degVec.l2, 100, colorLight);

	function addLight2(h, s, l, x, y, z, obj, size, color) {
		var lensflare = new THREE.Lensflare();
		lensflare.addElement(
			new THREE.LensflareElement(textureFlare0, size, 0, color)
		);
		obj.add(lensflare);
		obj.visible = false;
		scene.add(obj);
		lensflare.position.set(x, y, z);
	}
}
function initSprite() {
	var ves = [
		{
			name: "sprite1",
			pos: new THREE.Vector3(-13.0, 197.0, 204.0),
			pos2: new THREE.Vector3(-77.0, 197.0, 354),
			type: "a",
		},
		{
			name: "sprite2",
			pos: new THREE.Vector3(179.0, 197.0, 204.0),
			pos2: new THREE.Vector3(128.0, 215.0, 329),
			type: "b",
		},
		{
			name: "sprite3",
			pos: new THREE.Vector3(13.0, 197, -196),
			pos2: new THREE.Vector3(-77.0, 197.0, -355),
			type: "c",
		},
		{
			name: "sprite4",
			pos: new THREE.Vector3(179, 197, -196),
			pos2: new THREE.Vector3(126.0, 214.0, -328),
			type: "d",
		},
		{
			name: "sprite5",
			pos: new THREE.Vector3(504, 216, -4),
			pos2: new THREE.Vector3(515.0, 413.0, 7),
			type: "e",
		},
		{
			name: "sprite6",
			pos: new THREE.Vector3(45, 350, -4),
			pos2: new THREE.Vector3(79.0, 350.0, -4),
			type: "f",
		},
	];
	var spMat = new THREE.SpriteMaterial({
		color: 0xffffff,
		map: new THREE.TextureLoader().load("./img/pointSprite.png"),
		transparent: true,
		alphaTest: 0.2,
	});
	for (var i = 0; i < ves.length; i++) {
		var sprite = new THREE.Sprite(spMat);
		sprite.position.copy(ves[i].pos);
		sprite.anType = ves[i].type;
		sprite.anStats = 0;
		sprite.vec2 = ves[i].pos2;
		sprite.vec1 = ves[i].pos;
		sprite.name = ves[i].name;
		Bplace.push(sprite);
		scene.add(sprite);
		spriteBox.push(sprite);
		biling(sprite, 40);
	}
	var vz = void 0;

	function biling(a, val) {
		var animates = new TWEEN.Tween(a.scale)
			.to(
				{
					x: val,
					y: val,
				},
				600
			)
			.easing(TWEEN.Easing.Linear.None)
			.start()
			.onComplete(function () {
				vz = val == 65 ? 35 : 65;
				animates = null;
				biling(a, vz);
			});
	}
} //联系QQ 1074587055 ，大量优质three.js源码
function tweenAn(a) {
	var animates = new TWEEN.Tween(a)
		.to(
			{
				time: 0,
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null;
		});
}
function toggleLungu(index) {
	if (index == 0) {
		ab(lunguA, true),
			ab(lunguB, false),
			ab(lunguC, false),
			ab(lunguD, false);
	}
	if (index == 1) {
		ab(lunguA, false),
			ab(lunguB, true),
			ab(lunguC, false),
			ab(lunguD, false);
	}
	if (index == 2) {
		ab(lunguA, false),
			ab(lunguB, false),
			ab(lunguC, true),
			ab(lunguD, false);
	}
	if (index == 3) {
		ab(lunguA, false),
			ab(lunguB, false),
			ab(lunguC, false),
			ab(lunguD, true);
	}
}
function toggleCar(index) {
	if (index == 0) {
		ab(carTypeA, true), ab(carTypeB, false);
	}
	if (index == 1) {
		ab(carTypeA, false), ab(carTypeB, true);
	}
}
function ab(arr, type) {
	if (type) {
		arr.map(function (t) {
			t.visible = true;
		});
	} else {
		arr.map(function (t) {
			t.visible = false;
		});
	}
}
function updateLines(obj, val) {
	var animates = new TWEEN.Tween(obj.material)
		.to(
			{
				opacity: val,
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null;
		});
}
function toggleCarColor(index, other) {
	if (index == 0) {
		intensityV(3);
	} else if (index == 2) {
		intensityV(7);
	} else {
		intensityV(15);
	}
	if (!other) {
		colorTo(paintA, allColors[index]), colorTo(paintB, allColors[index]);
		colorTo(houshiObj, allColors[index]);
	} else {
		colorTo(houshiObj, allColors[1]);
		colorTo(paintA, allColors[index]);
		colorTo(paintB, allColors[other]);
	}
}
function intensityV(val) {
	paintA.map(function (u) {
		tweenVal(u.material, val, 0, 0.59);
	});
	paintB.map(function (u) {
		tweenVal(u.material, val, 0, 0.59);
	});
}
function tweenVal(valA, valB, valR, valM) {
	var animates = new TWEEN.Tween(valA)
		.to(
			{
				envMapIntensity: valB,
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null;
		});
}
function colorTo(arr, color) {
	arr.map(function (g) {
		an(g.material.color, color);
	});

	function an(a, b) {
		var animates = new TWEEN.Tween(a)
			.to(
				{
					r: b.r,
					g: b.g,
					b: b.b,
				},
				600
			)
			.easing(TWEEN.Easing.Linear.None)
			.start()
			.onComplete(function () {
				animates = null;
			});
	}
} //联系QQ 1074587055 ，大量优质three.js源码
function tweenPos(obj, b) {
	var animates = new TWEEN.Tween(obj.position)
		.to(
			{
				x: b.x,
				y: b.y,
				z: b.z,
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null;
		});
}

$("#toggleColor li").eq(2).trigger("click");

function anText(val) {
	$("#container").text("loading..." + val + "%");
}
function anAni(val) {
	if (isMobile() || window.innerWidth < 768) {
		$("#mad").css({
			width: 1.2 - 0.012 * val + "rem",
			left: 50 + 0.295 * val + "%",
		});
	} else {
		$("#mad").css({
			width: 0.4 - 0.004 * val + "rem",
			left: 50 + 0.1 * val + "%",
		});
	}
}
function dispose(obj) {
	if (obj.material.map) {
		obj.material.map.dispose();
	}
	obj.material.dispose();
	obj.geometry.dispose();
	obj.visible = false;
}
function IEVersion() {
	var userAgent = navigator.userAgent;
	var isIE =
		userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
	var isIE11 =
		userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (fIEVersion == 7) {
			return 7;
		} else if (fIEVersion == 8) {
			return 8;
		} else if (fIEVersion == 9) {
			return 9;
		} else if (fIEVersion == 10) {
			return 10;
		} else {
			return 6;
		}
	} else if (isEdge) {
		return "edge";
	} else if (isIE11) {
		return 11;
	} else {
		return "edge";
	}
}
