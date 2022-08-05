var Card = function (window, data) {
    const actionTime = 1000
    const transformTime = 1000
    const sceneCameraZ = 1000
    const items = data.list
    var table = [
        { filename: items[0].filename, y: 1, x: 2 },
        { filename: items[1].filename, y: 1, x: 3 },
        { filename: items[2].filename, y: 1, x: 5 },
        { filename: items[3].filename, y: 1, x: 6 },

        { filename: items[4].filename, y: 2, x: 1 },
        { filename: items[5].filename, y: 2, x: 2 },
        { filename: items[6].filename, y: 2, x: 3 },
        { filename: items[7].filename, y: 2, x: 4 },
        { filename: items[8].filename, y: 2, x: 5 },
        { filename: items[9].filename, y: 2, x: 6 },
        { filename: items[10].filename, y: 2, x: 7 },

        { filename: items[11].filename, y: 3, x: 1 },
        { filename: items[12].filename, y: 3, x: 2 },
        { filename: items[13].filename, y: 3, x: 3 },
        { filename: items[14].filename, y: 3, x: 4 },
        { filename: items[15].filename, y: 3, x: 5 },
        { filename: items[16].filename, y: 3, x: 6 },
        { filename: items[17].filename, y: 3, x: 7 },

        { filename: items[18].filename, y: 4, x: 2 },
        { filename: items[19].filename, y: 4, x: 3 },
        { filename: items[20].filename, y: 4, x: 4 },
        { filename: items[21].filename, y: 4, x: 5 },
        { filename: items[22].filename, y: 4, x: 6 },

        { filename: items[23].filename, y: 5, x: 3 },
        { filename: items[24].filename, y: 5, x: 4 },
        { filename: items[25].filename, y: 5, x: 5 },

        { filename: items[26].filename, y: 6, x: 4 },
    ];

    var camera, scene, sceneText, renderer, CURRENT_SCENE = 1;
    var controls;
    var nowNode;
    var lastmod = 'table'

    var objectsOther = []; // 用来删除 ♥场景 的object
    var objectsXin = []; // 用来删除 ♥场景 的object
    var objects = []; // 所有的Objects
    var objectsText = [];
    var targets = { table: [], sphere: [], helix: [], grid: [], text: [] };

    var Init = function () {
        init();
        animate();
    }

    // 注册屏幕点击事件
    $(window).on("click", function () {
        if (nowNode) {
            var e = $(".element")[nowNode.index]
            var obj = objects[nowNode.index]
            returnTransform(e, obj)
        }
        nowNode = null;
    })

    // 保存数据
    function saveTransform(index) {
        nowNode = {};
        nowNode.index = index;
        var obj = objects[index];
        nowNode.rotation = {};
        nowNode.rotation.x = obj.rotation.x;
        nowNode.rotation.y = obj.rotation.y;
        nowNode.rotation.z = obj.rotation.z;
        nowNode.position = {};
        nowNode.position.x = obj.position.x;
        nowNode.position.y = obj.position.y;
        nowNode.position.z = obj.position.z;
        nowNode.camera = { position: {} }
        nowNode.camera.position.z = camera.position.z
    }

    function showBigCard(_this) {
        if (nowNode) {  // 如果已经有点开的卡片 则先恢复
            var node = $(".element")[nowNode.index]
            var o = objects[nowNode.index]
            returnTransform(node, o)
        }
        var index = $(_this).index();
        saveTransform(index);
        var obj = objects[index];
        var z = camera.position.z >= 0 ? 800 : -800;
        new TWEEN.Tween(camera.position)
            .to({ z: camera.position.z >= 0 ? 1600 : -1600 }, actionTime)
            .start();
        new TWEEN.Tween(obj.rotation)
            .to({ x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }, actionTime)
            .easing(TWEEN.Easing.Linear.None)
            .start();
        new TWEEN.Tween(obj.position)
            .to({ z }, actionTime)
            .easing(TWEEN.Easing.Linear.None)
            .start();
        new TWEEN.Tween(_this)
            .to({}, actionTime)
            .onUpdate(render)
            .start();
        _this.classList.add("btnClick");
    }
    // 卡片点击事件
    function btnClick(e) {
        showBigCard(this)
        e.stopPropagation()
    }

    // 恢复初始位置
    function returnTransform(element, obj) {
        console.log("nowNode", nowNode)
        console.log("obj", obj)
        element.style.transition = "all 2s";
        element.classList.remove("btnClick");
        new TWEEN.Tween(obj.rotation)
            .to({ x: nowNode.rotation.x, y: nowNode.rotation.y, z: nowNode.rotation.z }, actionTime)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(obj.position)
            .to({ x: nowNode.position.x, y: nowNode.position.y, z: nowNode.position.z }, actionTime)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(camera.position)
            .to({ z: nowNode.camera.position.z }, actionTime)
            .start();
        new TWEEN.Tween(this)
            .to({}, actionTime)
            .onUpdate(render)
            .start();
    }

    function handleTextAction(index, useActionNumber, delay = 120) {
        const obj = objectsText[index]
        const initXY = targets.text[index]
        function action(x, y, z, rx, ry, rz, isOffset) {
            function run() {
                new TWEEN.Tween(obj.position)
                    .to(
                        isOffset
                            ? { x: obj.position.x + x, y: obj.position.y + y, z: obj.position.z + z }
                            : { x: x, y: y, z: z },
                        delay
                    )
                    .easing(TWEEN.Easing.Linear.None)
                    .start()
                new TWEEN.Tween(obj.rotation)
                    .to(
                        isOffset
                            ? { x: obj.rotation.x + rx, y: obj.rotation.y + ry, z: obj.rotation.z + rz }
                            : { x: rx, y: ry, z: rz },
                        delay
                    )
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start()
                return new Promise((resolve) => {
                    new TWEEN.Tween(this)
                        .to({}, actionTime)
                        .onUpdate(render)
                        .start();
                    setTimeout(() => {
                        resolve()
                    }, delay)
                })
            }

            obj.task = obj.task.then(() => run())
        }

        const actionGroup = [
            [
                [+20, +20, 0, 0, 0, 0, true],
                [-20, -20, 0, 0, 0, 0, true],
            ],
            [
                [+20, -20, 0, 0, 0, 0, true],
                [-20, +20, 0, 0, 0, 0, true],
            ],
            [
                [-20, +20, 0, 0, 0, 0, true],
                [+20, -20, 0, 0, 0, 0, true],
            ],
            [
                [-20, -20, 0, 0, 0, 0, true],
                [+20, +20, 0, 0, 0, 0, true],
            ],
        ]
            ;[
                ...actionGroup[useActionNumber === undefined ? Math.floor(Math.random() * 4) : useActionNumber],
                [initXY.position.x, initXY.position.y, 0, 0, 0, 0, false], // reset
            ].forEach((args) => {
                action.apply(null, args)
            })
    }

    function init() {
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = sceneCameraZ;
        scene = new THREE.Scene();
        sceneText = new THREE.Scene();

        //  table
        var imgNum = 75;
        var j = 1;
        var isGif = true;
        var gifCount = 0;
        var gifNum = 37;
        var gifIndexArr;
        console.log("卡片张数", table.length);

        for (let i = 0; i < 27; i += 1) {
            var element = document.createElement('div');
            element.innerHTML = /* html */ `
                <div class="wrap">
                    <p>我喜欢你</p>
                    <p style="width: 5px"></p>
                    <p style='width: 26px; height: 26px; background: url("./assets/text2.png") 100% 100%;background-size: 100% 100%;'></p>
                </div>
            `
            element.className = 'element-text';

            var object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            object.task = Promise.resolve()
            sceneText.add(object);
            objectsText.push(object);
            element.addEventListener("mouseover", () => {
                handleTextAction(i)
            })
        }

        // picture
        for (var i = 0; i < imgNum; i += 1) {
            const { filename } = table[i % table.length]
            var element = document.createElement('img');
            element.className = 'element';
            element.setAttribute('src', filename);
            element.addEventListener("click", btnClick);

            var object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            if (i > table.length) {
                objectsOther.push(object);
            } else {
                objectsXin.push(object)
                scene.add(object);
            }
            objects.push(object);
        }

        // ♥
        for (var i = 0; i < objects.length; i += 1) {
            const { x, y } = table[i % table.length]

            var object = new THREE.Object3D();
            object.position.x = (x * 120) - 500;
            object.position.y = - (y * 120) + 400;

            targets.table.push(object);
        }

        // text
        for (var i = 0; i < objects.length; i += 1) {
            const { x, y } = table[i % table.length]

            var object = new THREE.Object3D();
            object.position.x = (x * 190) - 700;
            object.position.y = - (y * 120) + 400;

            targets.text.push(object);
        }

        // ⚽
        var vector = new THREE.Vector3();
        for (var i = 0, l = objects.length; i < l; i++) {
            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;

            var object = new THREE.Object3D();

            object.position.x = 360 * Math.cos(theta) * Math.sin(phi);
            object.position.y = 360 * Math.sin(theta) * Math.sin(phi);
            object.position.z = 360 * Math.cos(phi);

            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            targets.sphere.push(object);
        }

        //  helix
        var vector = new THREE.Vector3();
        for (var i = 0, l = objects.length; i < l; i++) {
            var phi = i * 0.375 + Math.PI;
            var object = new THREE.Object3D();
            object.position.x = 450 * Math.sin(phi);
            object.position.y = - (i * 8) + 225;
            object.position.z = 450 * Math.cos(phi);
            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;
            object.lookAt(vector);

            targets.helix.push(object);
        }

        //  grid
        for (var i = 0; i < objects.length; i++) {
            var object = new THREE.Object3D();

            object.position.x = ((i % 5) * 400) - 800;
            object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
            object.position.z = (Math.floor(i / 25)) * 1000 - 2000;

            targets.grid.push(object);
        }

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        document.getElementById('container').appendChild(renderer.domElement);

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5; // 按住鼠标左键后拖动查看时的旋转速度  
        controls.minDistance = 500; // 设置滚轮能滚到的最近距离  
        controls.maxDistance = 6000; // 设置滚轮能滚到的最远距离  

        controls.noPan = true; // 如设置为true, 则禁用 按下鼠标右键平移的功能  
        controls.addEventListener('change', render);

        const buttons = {}

        function switchMod(mod) {
            const list = ['text']
            list.forEach(item => {
                buttons[item].classList.remove('active')
            })
            buttons[mod].classList.add("active")
            switchScene(mod)
        }

        // transform(objects, targets.table, 2000, "in");
        // clearTransform()
        // transform(objects, null, 0, 'out', () => {
        //     objects.forEach(obj => {
        //         scene.remove(obj)
        //     })
        //     objectsText.forEach(obj => {
        //         sceneText.add(obj)
        //     })
        //     // https://blog.csdn.net/ccchen706/article/details/85322928
        //     controls.reset()
        //     transform(objectsText, targets.text, 2000, "in");
        //     new TWEEN.Tween(camera.position)
        //         .to({ x: 0, y: 0, z: 1600 }, 1000)
        //         .easing(TWEEN.Easing.Linear.None)
        //         .start();
        //     CURRENT_SCENE = 3
        // })
        clearTransform()
        transform(objects, null, transformTime, 'out', () => {
            objects.forEach(obj => {
                scene.remove(obj)
            })
            objectsText.forEach(obj => {
                sceneText.add(obj)
            })
            // https://blog.csdn.net/ccchen706/article/details/85322928
            controls.reset()
            transform(objectsText, targets.text, transformTime, "in");
            new TWEEN.Tween(camera.position)
                .to({ x: 0, y: 0, z: 1600 }, actionTime)
                .easing(TWEEN.Easing.Linear.None)
                .start();
            CURRENT_SCENE = 3
        })
        doTime = transformTime + Math.max(transformTime * 2, actionTime)
        setTimeout(() => {
            objectsText.forEach((obj, idx) => {
                handleTextAction(idx, 0, 200)
                handleTextAction(idx, 0, 200)

                handleTextAction(idx, 1, 200)
                handleTextAction(idx, 1, 200)

                handleTextAction(idx, 2, 200)
                handleTextAction(idx, 2, 200)

                handleTextAction(idx, 3, 200)
                handleTextAction(idx, 3, 200)
            })
        }, doTime)
        window.addEventListener('resize', onWindowResize, false);
    }

    function clearTransform() {
        TWEEN.removeAll();
    }

    function transform(objects, targets, duration, mod, fn) {
        if (mod === 'in') {
            const len = Math.min(objects.length, targets.length)
            for (var i = 0; i < len; i++) {
                var object = objects[i];
                var target = targets[i];
                new TWEEN.Tween(object.position)
                    .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();

                new TWEEN.Tween(object.rotation)
                    .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
        } else if (mod === "out") {
            for (var i = 0; i < objects.length; i++) {
                var object = objects[i];
                var target = { x: Math.random() * 4000 - 2000, y: Math.random() * 4000 - 2000, z: Math.random() * 4000 - 15000 }
                new TWEEN.Tween(object.position)
                    .to(target, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
            setTimeout(() => {
                fn()
            }, duration)
        }
        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
    }
    function switchScene(mod) {
        console.log(mod, CURRENT_SCENE);
        switch (mod) {
            case 'table':
                if (CURRENT_SCENE === 1) {
                    // controls.reset()
                    // clearTransform()
                    // transform(objectsXin, targets[mod], transformTime, "in");
                    // new TWEEN.Tween(camera.position)
                    //         .to({ x: 0, y: 0, z: 1200 }, actionTime)
                    //         .easing(TWEEN.Easing.Linear.None)
                    //         .start();
                    break
                } else if (CURRENT_SCENE === 2) {
                    clearTransform()
                    transform(objectsOther, null, transformTime, 'out', () => {
                        objectsOther.forEach(obj => {
                            scene.remove(obj)
                        })
                        CURRENT_SCENE = 1
                    })
                    transform(objectsXin, targets[mod], transformTime, "in");
                } else if (CURRENT_SCENE === 3) {
                    clearTransform()
                    new TWEEN.Tween(camera.position)
                        .to({ z: sceneCameraZ * 1.2 }, actionTime / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();
                    transform(objectsText, null, transformTime, 'out', () => {
                        objectsText.forEach(obj => {
                            sceneText.remove(obj)
                        })
                        CURRENT_SCENE = 1
                        objectsXin.forEach(obj => {
                            scene.add(obj)
                        })
                        transform(objects, targets[mod], transformTime, "in");
                    })
                }
                break
            case 'sphere':
            case 'helix':
            case 'grid':
                if (CURRENT_SCENE === 2 && lastmod === mod) {
                    // console.log("rest other");
                    // clearTransform()
                    // transform(objects, targets[mod], transformTime, "in");
                    // controls.reset()
                    // new TWEEN.Tween(camera.position)
                    //         .to({ x: 0, y: 0, z: 1200 }, actionTime)
                    //         .easing(TWEEN.Easing.Linear.None)
                    //         .start();
                    break
                } else {
                    clearTransform()
                    transform(objects, targets[mod], transformTime, "in");
                }
                if (CURRENT_SCENE === 1) {
                    objectsOther.forEach(obj => {
                        scene.add(obj)
                    })
                    CURRENT_SCENE = 2
                    clearTransform()
                    transform(objects, targets[mod], transformTime, "in");
                } else if (CURRENT_SCENE === 3) {
                    clearTransform()
                    new TWEEN.Tween(camera.position)
                        .to({ z: sceneCameraZ * 1.2 }, actionTime / 2)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();
                    transform(objectsText, null, transformTime, 'out', () => {
                        objectsText.forEach(obj => {
                            sceneText.remove(obj)
                        })
                        CURRENT_SCENE = 2
                        objects.forEach(obj => {
                            scene.add(obj)
                        })
                        transform(objects, targets[mod], transformTime, "in");
                    })
                }
                break
            case 'text':
                let doTime = transformTime
                if (CURRENT_SCENE === 1 || CURRENT_SCENE === 2) {
                    clearTransform()
                    transform(objects, null, transformTime, 'out', () => {
                        objects.forEach(obj => {
                            scene.remove(obj)
                        })
                        objectsText.forEach(obj => {
                            sceneText.add(obj)
                        })
                        // https://blog.csdn.net/ccchen706/article/details/85322928
                        controls.reset()
                        transform(objectsText, targets[mod], transformTime, "in");
                        new TWEEN.Tween(camera.position)
                            .to({ x: 0, y: 0, z: 1600 }, actionTime)
                            .easing(TWEEN.Easing.Linear.None)
                            .start();
                        CURRENT_SCENE = 3
                    })
                    doTime = transformTime + Math.max(transformTime * 2, actionTime)
                    setTimeout(() => {
                        objectsText.forEach((obj, idx) => {
                            handleTextAction(idx, 0, 200)
                            handleTextAction(idx, 0, 200)

                            handleTextAction(idx, 1, 200)
                            handleTextAction(idx, 1, 200)

                            handleTextAction(idx, 2, 200)
                            handleTextAction(idx, 2, 200)

                            handleTextAction(idx, 3, 200)
                            handleTextAction(idx, 3, 200)
                        })
                    }, doTime)
                } else if (CURRENT_SCENE === 3) {
                    controls.reset()
                    transform(objectsText, targets[mod], transformTime, "in");
                    new TWEEN.Tween(camera.position)
                        .to({ x: 0, y: 0, z: 1600 }, actionTime)
                        .easing(TWEEN.Easing.Linear.None)
                        .start();
                    doTime = Math.max(transformTime * 2, actionTime)
                }
                break
        }
        lastmod = mod
    }

    function render() {
        if (CURRENT_SCENE === 1) {
            renderer.render(scene, camera);
        } else if (CURRENT_SCENE === 2) {
            renderer.render(scene, camera);
        } else if (CURRENT_SCENE === 3) {
            renderer.render(sceneText, camera);
        }
    }

    return {
        Init: Init
    }
};
