    // once everything is loaded, we run our Three.js stuff.
    $(function () {
        var stats = initStats();

        // 创建一个场景，它将包含我们所有的元素，比如对象、相机和灯光。.
        var scene = new THREE.Scene();

        // c相机，它定义了我们要看的地方。.
        var camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / document.body.scrollHeight, 0.1, 1000);

        // 创建一个呈现并设置大小。
        // var webGLRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        // // webGLRenderer.setClearColor(new THREE.Color(0x000000, .1));
        // webGLRenderer.setSize(window.screen.width, window.screen.height);
        // webGLRenderer.shadowMapEnabled = true;


        // // 把摄像机定位到场景的中心。
        // camera.position.x = -30;
        // camera.position.y = 40;
        // camera.position.z = 50;
        // camera.lookAt(new THREE.Vector3(10, 0, 0));

        // // 将渲染器的输出添加到html元素。
        // $("#WebGL-output").append(webGLRenderer.domElement);

        // 调用渲染函数
        var stepy = 0;
        var stepx = 0;


        var knot;

        // 设置控制gui
        var controls = new function () {
            // 我们需要第一个child，因为这是一种复合材料。
            this.radius = 40;
            this.tube = 40;
            this.radialSegments = 200;
            this.tubularSegments = 20;
            this.p = 10;
            this.q = 15;
            this.heightScale = 2;
            this.asParticles = true;
            this.rotate = true;

            this.redraw = function () {
                // 删除旧的平面
                if (knot) scene.remove(knot);
                // 创建一个新的
                var geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q), controls.heightScale);

                if (controls.asParticles) {
                    knot = createParticleSystem(geom);
                } else {
                    knot = createMesh(geom);
                }

                // 把它添加到场景中。
                scene.add(knot);
            };

        }

        controls.redraw();

        render();

        // from THREE.js examples
        function generateSprite() {
            var canvas = document.createElement('canvas');
            $("canvas").css({
                position: "absolute",
                // height:740,
                left: 0,
                top: 0,
                "z-index": -1,
            })
            canvas.width = 16;
            canvas.height = 16;

            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.4, 'rgba(0,255,255,1)');
            gradient.addColorStop(0.6, 'rgba(0,0,64,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,.0)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        function createParticleSystem(geom) {
            var material = new THREE.ParticleBasicMaterial({
                color: 0xffffff,
                size: 0.4,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: generateSprite()
            });

            var system = new THREE.ParticleSystem(geom, material);
            system.sortParticles = true;
            return system;
        }

        function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial({});
            meshMaterial.side = THREE.DoubleSide;

            // create a multimaterial
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

            return mesh;
        }

        var rotateType = 1;
        setInterval(function () {
            rotateType = Math.floor(Math.random() * 2) //0 ~ 7
        }, 10000)

        function render() {
            stats.update();

            if (controls.rotate) {
                switch (rotateType) {
                    case 0:
                        knot.rotation.y = stepy += 0.001;
                        break;
                    // case 1:
                    //     knot.rotation.y = stepy -= 0.001;
                    //     break;
                    case 1:
                        knot.rotation.x = stepx += 0.001;
                        knot.rotation.y = stepy += 0.001;
                        break;
                    // case 3:
                    //     knot.rotation.x = stepx -= 0.001;
                    //     knot.rotation.y = stepy += 0.001;
                    //     break;
                    // case 4:
                    //     knot.rotation.x = stepx += 0.001;
                    //     knot.rotation.y = stepy -= 0.001;
                    //     break;
                    // case 5:
                    //     knot.rotation.x = stepx -= 0.001;
                    //     knot.rotation.y = stepy -= 0.001;
                    //     break;
                    default:
                        break;
                }
            }

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            // webGLRenderer.render(scene, camera);
        }

        function initStats() {

            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            // $("#Stats-output").append(stats.domElement);

            return stats;
        }
    });