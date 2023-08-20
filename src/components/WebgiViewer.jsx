import React, {
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);


import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,
    mobileAndTabletCheck
    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";



const WebgiViewer = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [viewerRef, setViewerRef] = useState(null);
    const [targetRef, setTargetRef] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [positionRef, setPositionRef] = useState(null);
    const canvasConatinerRef = useRef(null);
    const [previewMode, setPreviewMode] = useState(null);


    useImperativeHandle(ref, () => ({
        triggerPreview() {
            setPreviewMode(true);

            canvasConatinerRef.current.style.pointerEvents = "all";
            props.contentRef.current.style.opacity = "0";
            gsap.to(positionRef, {
                x: 13.04,
                y: -2.01,
                z: 2.29,
                duration: 2,
                onUpdate: () => {
                    viewerRef.setDirty();
                    cameraRef.positionTargetUpdated(true);
                }
            });

            gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 })
            viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
        }
    }))

    const memoizedScrollAnimation = useCallback(
        (position, target, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, onUpdate);
            }
        }, []
    )


    const setupViewer = useCallback(async () => {


        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });
        setViewerRef(viewer);


        const manager = await viewer.addPlugin(AssetManagerPlugin)

        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;
        setCameraRef(camera);
        setPositionRef(position);
        setTargetRef(target);







        // Add plugins individually.
        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)







        viewer.renderer.refreshPipeline()

        // Import and add a GLB file.
        await manager.addFromPath("scene-black.glb")
        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        window.scrollTo(0, 0);
        let needsUpdate = true;
        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        }

        viewer.addEventListener("preFrame", () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true);
                needsUpdate = false;
            }


        })
        memoizedScrollAnimation(position, target, onUpdate);

    }, []);

    useEffect(() => {
        setupViewer();


    }, [])

    const handleExit = useCallback(() => {
        canvasConatinerRef.current.style.pointerEvents = "none";
        props.contentRef.current.style.opacity = "1";
        viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
        setPreviewMode(false);

        gsap.to(positionRef, {
            x: 1.56,
            y: 5.0,
            z: 0.011,
            scrollTrigger: {
                trigger: '.display-section',
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false
            },
            onUpdate: () => {
                viewerRef.setDirty();
                cameraRef.positionTargetUpdated(true);
            }
        });
        gsap.to(targetRef, {
            x: -0.55,
            y: 0.32,
            z: 0.0,
            scrollTrigger: {
                trigger: '.display-section',
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false
            },

        })

    }, [cameraRef, positionRef, viewerRef, targetRef, canvasConatinerRef])



    return (<div ref={canvasConatinerRef} id="webgi-canvas-container">
        <canvas id="webgi-canvas" ref={canvasRef} />
        {
            previewMode &&
            (
                <button className="button" onClick={handleExit}>Exit</button>
            )
        }
    </div>
    );


})




export default WebgiViewer;
