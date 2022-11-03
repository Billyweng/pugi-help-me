import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls, PrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls'
import { Loader } from 'three'



	


var container;

            var camera, scene, renderer;

            var cube, plane,gltfmodel;

            var targetRotationX = 0.5;
            var targetRotationOnMouseDownX = 0;

            var targetRotationY = 0.2;
            var targetRotationOnMouseDownY = 0;

            var mouseX = 0;
            var mouseXOnMouseDown = 0;

            var mouseY = 0;
            var mouseYOnMouseDown = 0;

            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;

            var slowingFactor = 0.25;
            
            init();
            animate();

            function init() {
              
                container = document.createElement( 'div' );
                document.body.appendChild( container );

                scene = new THREE.Scene();

                camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
                camera.position.y = 0;
                camera.position.z = 20;
                scene.add( camera );

                const light = new THREE.AmbientLight("rgb(255, 255, 255)", 0.4); // soft white light
                scene.add( light );
      
                var directionaLight =new THREE.DirectionalLight (0xffffff,0.8);
                directionaLight.position.set(0,1,0);
                scene.add(directionaLight);

                var directionaLight2 =new THREE.DirectionalLight (0xffffff,0.9);
                directionaLight2.position.set(0.6,0,0.8);
                scene.add(directionaLight2);
    
                var directionaLight3 =new THREE.DirectionalLight (0xffffff,0.9);
                directionaLight3.position.set(-0.6,0,-0.8);
                scene.add(directionaLight3);






                var materials = [];

                for ( var i = 0; i < 6; i ++ ) {

                    materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );

                }


                const Loader =new GLTFLoader;
                Loader.load('../static/model/fire.gltf',function(gltf){
                  let gltfmodel = gltf.scene;
                  gltfmodel.position.y= 8;
                  scene.add(gltfmodel);
                },undefined, function ( error ) {
                  console.error( error );
                });

                cube = new THREE.Mesh(  new THREE.CylinderGeometry() , new THREE.MeshFaceMaterial(materials) );
                cube.position.y = 0;
                cube.overdraw = true;
                scene.add( cube );              
                            
							
							
							

                plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
                plane.rotation.x = - 90 * ( Math.PI / 180 );
                plane.overdraw = true;

                renderer = new THREE.WebGLRenderer({
                  alpha:true
                });
                renderer.setSize( window.innerWidth, window.innerHeight );

                container.appendChild( renderer.domElement );

                

                document.addEventListener( 'mousedown', onDocumentMouseDown, false );
            }

            function onDocumentMouseDown( event ) {

                event.preventDefault();

                document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                document.addEventListener( 'mouseout', onDocumentMouseOut, false );

                mouseXOnMouseDown = event.clientX - windowHalfX;
                targetRotationOnMouseDownX = targetRotationX;

                mouseYOnMouseDown = event.clientY - windowHalfY;
                targetRotationOnMouseDownY = targetRotationY;
            }

            function onDocumentMouseMove( event ) {

                mouseX = event.clientX - windowHalfX;

                targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025;

                mouseY = event.clientY - windowHalfY;

                targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;
            }

            function onDocumentMouseUp( event ) {

                document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
            }

            function onDocumentMouseOut( event ) {

                document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
            }


            function animate() {

                requestAnimationFrame( animate );

                render();
             

            }

            function render() {

                rotateAroundWorldAxis(cube, new THREE.Vector3(0, 1, 0), targetRotationX);
                rotateAroundWorldAxis(cube, new THREE.Vector3(1, 0, 0), targetRotationY);
              
                targetRotationY = targetRotationY * (1 - slowingFactor);
                targetRotationX = targetRotationX * (1 - slowingFactor);
                renderer.render( scene, camera );

            }

            function rotateAroundObjectAxis(object, axis, radians) {
                var rotationMatrix = new THREE.Matrix4();

                rotationMatrix.makeRotationAxis(axis.normalize(), radians);
                object.matrix.multiply(rotationMatrix);
                object.rotation.setFromRotationMatrix( object.matrix );

            }

          function rotateAroundWorldAxis( object, axis, radians ) {

              var rotationMatrix = new THREE.Matrix4();

              rotationMatrix.makeRotationAxis( axis.normalize(), radians );
              rotationMatrix.multiply( object.matrix );                       // pre-multiply
              object.matrix = rotationMatrix;
              object.rotation.setFromRotationMatrix( object.matrix );
          }