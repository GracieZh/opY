import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/island.glb";

export function IslandModel({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.002) {
        rotationSpeed.current = -0.002;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = islandRef.current.rotation.y;

      /**
       * Normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI].
       * The goal is to ensure that the rotation value remains within a specific range to
       * prevent potential issues with very large or negative rotation values.
       *  Here's a step-by-step explanation of what this code does:
       *  1. rotation % (2 * Math.PI) calculates the remainder of the rotation value when divided
       *     by 2 * Math.PI. This essentially wraps the rotation value around once it reaches a
       *     full circle (360 degrees) so that it stays within the range of 0 to 2 * Math.PI.
       *  2. (rotation % (2 * Math.PI)) + 2 * Math.PI adds 2 * Math.PI to the result from step 1.
       *     This is done to ensure that the value remains positive and within the range of
       *     0 to 2 * Math.PI even if it was negative after the modulo operation in step 1.
       *  3. Finally, ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) applies another
       *     modulo operation to the value obtained in step 2. This step guarantees that the value
       *     always stays within the range of 0 to 2 * Math.PI, which is equivalent to a full
       *     circle in radians.
       */
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.40 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.5 && normalizedRotation <= 1.2:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 1.4 && normalizedRotation <= 2.5:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.island.geometry}
        material={materials["Material.001"]}
        position={[-0.018, 0, -0.584]}
      />
      <mesh
        geometry={nodes["island-snow"].geometry}
        material={materials["Material.009"]}
        position={[-0.018, 0.057, -0.584]}
        scale={1.059}
      />
      <mesh
        geometry={nodes.hill.geometry}
        material={materials.Material}
        position={[1.709, 1.743, -1.709]}
        rotation={[-0.005, -0.09, -0.01]}
        scale={0.665}
      />
      <mesh
        geometry={nodes.Crystal.geometry}
        material={materials["Material.006"]}
        position={[-0.558, 1.152, 1.852]}
        rotation={[-0.036, 0.088, -1.541]}
        scale={[0.197, 0.497, 0.985]}
      />
      <mesh
        geometry={nodes.Crystal001.geometry}
        material={materials["Material.006"]}
        position={[-0.558, 1.152, 1.852]}
        rotation={[-0.036, 0.088, -1.541]}
        scale={[0.197, 0.497, 0.985]}
      />
      <mesh
        geometry={nodes.Cylinder024.geometry}
        material={materials["Material.025"]}
        position={[-0.357, 0.762, 0.159]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.018, 0.095, 0.018]}
      />
      <group
        position={[-1.833, 1.847, 1.539]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder027_1.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder027_2.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.625, 1.847, 1.541]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder028_1.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder028_2.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.72, 1.847, 1.333]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder029_1.geometry}
          material={materials["Material.017"]}
        />
        <mesh
          geometry={nodes.Cylinder029_2.geometry}
          material={materials["Material.016"]}
        />
      </group>
      <group
        position={[-1.82, 1.847, 1.34]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder030_1.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder030_2.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.839, 1.847, 1.438]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder031_1.geometry}
          material={materials["Material.015"]}
        />
        <mesh
          geometry={nodes.Cylinder031_2.geometry}
          material={materials["Material.012"]}
        />
      </group>
      <group
        position={[-1.73, 1.847, 1.553]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder035_1.geometry}
          material={materials["Material.017"]}
        />
        <mesh
          geometry={nodes.Cylinder035_2.geometry}
          material={materials["Material.016"]}
        />
      </group>
      <group
        position={[-1.626, 1.847, 1.453]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder038_1.geometry}
          material={materials["Material.015"]}
        />
        <mesh
          geometry={nodes.Cylinder038_2.geometry}
          material={materials["Material.012"]}
        />
      </group>
      <group
        position={[-1.624, 1.847, 1.345]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder039_1.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder039_2.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <mesh
        geometry={nodes.Cylinder034.geometry}
        material={materials["Material.024"]}
        position={[-1.728, 1.706, 1.439]}
        rotation={[0, -1.245, 0]}
        scale={[0.244, 0.079, 0.244]}
      />
      <mesh
        geometry={nodes.Cylinder035.geometry}
        material={materials["Material.003"]}
        position={[-1.728, 1.461, 1.439]}
        rotation={[0, 0.33, 0]}
        scale={[0.316, 0.102, 0.316]}
      />
      <mesh
        geometry={nodes.Cylinder036.geometry}
        material={materials["Material.002"]}
        position={[-1.728, 1.223, 1.439]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.37, 0.12, 0.37]}
      />
      <group
        position={[-1.728, 1.223, 1.439]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.359, 0.116, 0.359]}
      >
        <mesh
          geometry={nodes.Cylinder037_1.geometry}
          material={materials["Material.023"]}
        />
        <mesh
          geometry={nodes.Cylinder037_2.geometry}
          material={materials["Material.021"]}
        />
      </group>
      <group
        position={[-1.713, 1.629, 1.714]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder051_1.geometry}
          material={materials["Material.018"]}
        />
        <mesh
          geometry={nodes.Cylinder051_2.geometry}
          material={materials["Material.019"]}
        />
      </group>
      <group
        position={[-1.713, 1.629, 1.172]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder053_1.geometry}
          material={materials["Material.018"]}
        />
        <mesh
          geometry={nodes.Cylinder053_2.geometry}
          material={materials["Material.019"]}
        />
      </group>
      <group
        position={[-1.446, 1.629, 1.44]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder055.geometry}
          material={materials["Material.018"]}
        />
        <mesh
          geometry={nodes.Cylinder055_1.geometry}
          material={materials["Material.019"]}
        />
      </group>
      <group
        position={[-2.002, 1.629, 1.44]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder057.geometry}
          material={materials["Material.018"]}
        />
        <mesh
          geometry={nodes.Cylinder057_1.geometry}
          material={materials["Material.019"]}
        />
      </group>
      <group
        position={[-1.913, 1.629, 1.633]}
        rotation={[3.134, 0.067, 3.131]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder062.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder062_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.517, 1.63, 1.262]}
        rotation={[3.134, 0.067, 3.131]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder063.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder063_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.53, 1.633, 1.64]}
        rotation={[3.134, 0.067, 3.131]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder064.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder064_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.911, 1.626, 1.234]}
        rotation={[3.134, 0.067, 3.131]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder065.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder065_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.723, 1.419, 1.774]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder067.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder067_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.723, 1.411, 1.774]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder069.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder069_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.723, 1.411, 1.098]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder071.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder071_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-2.056, 1.411, 1.458]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder073.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder073_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.38, 1.411, 1.458]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder075.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          geometry={nodes.Cylinder075_1.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        position={[-1.948, 1.411, 1.681]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder080.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder080_1.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.48, 1.411, 1.195]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder081.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder081_1.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.969, 1.411, 1.223]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder082.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder082_1.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <group
        position={[-1.483, 1.411, 1.691]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={[0.007, 0.07, 0.007]}
      >
        <mesh
          geometry={nodes.Cylinder083.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          geometry={nodes.Cylinder083_1.geometry}
          material={materials["Material.018"]}
        />
      </group>
      <mesh
        geometry={nodes.flame001.geometry}
        material={materials.flame}
        position={[-1.833, 1.919, 1.54]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame002.geometry}
        material={materials.flame}
        position={[-1.84, 1.919, 1.437]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={2.682}
      />
      <mesh
        geometry={nodes.flame004.geometry}
        material={materials.flame}
        position={[-1.729, 1.919, 1.554]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.005}
      />
      <mesh
        geometry={nodes.flame005.geometry}
        material={materials.flame}
        position={[-1.625, 1.919, 1.544]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.045}
      />
      <mesh
        geometry={nodes.flame006.geometry}
        material={materials.flame}
        position={[-1.624, 1.919, 1.454]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={2.766}
      />
      <mesh
        geometry={nodes.flame007.geometry}
        material={materials.flame}
        position={[-1.622, 1.919, 1.345]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={2.592}
      />
      <mesh
        geometry={nodes.flame008.geometry}
        material={materials.flame}
        position={[-1.721, 1.919, 1.334]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={2.646}
      />
      <mesh
        geometry={nodes.flame009.geometry}
        material={materials.flame}
        position={[-1.82, 1.919, 1.34]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.317}
      />
      <mesh
        geometry={nodes.Fire.geometry}
        material={materials["Procedural Animated Candle Flame"]}
        position={[1.035, 0.239, 0.025]}
        scale={0.361}
      />
      <mesh
        geometry={nodes.flame010.geometry}
        material={materials.flame}
        position={[-1.713, 1.701, 1.716]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame011.geometry}
        material={materials.flame}
        position={[-1.713, 1.701, 1.173]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame012.geometry}
        material={materials.flame}
        position={[-1.447, 1.701, 1.442]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame013.geometry}
        material={materials.flame}
        position={[-2.003, 1.701, 1.442]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame014.geometry}
        material={materials.flame}
        position={[-1.915, 1.7, 1.633]}
        rotation={[3.134, 0.067, 3.131]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame015.geometry}
        material={materials.flame}
        position={[-1.519, 1.701, 1.262]}
        rotation={[3.134, 0.067, 3.131]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame016.geometry}
        material={materials.flame}
        position={[-1.532, 1.704, 1.64]}
        rotation={[3.134, 0.067, 3.131]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame017.geometry}
        material={materials.flame}
        position={[-1.913, 1.697, 1.234]}
        rotation={[3.134, 0.067, 3.131]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame018.geometry}
        material={materials.flame}
        position={[-1.723, 1.491, 1.775]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame019.geometry}
        material={materials.flame}
        position={[-1.723, 1.482, 1.775]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame020.geometry}
        material={materials.flame}
        position={[-1.723, 1.482, 1.1]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame021.geometry}
        material={materials.flame}
        position={[-2.056, 1.482, 1.459]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame022.geometry}
        material={materials.flame}
        position={[-1.381, 1.482, 1.459]}
        rotation={[Math.PI, -0.751, Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame023.geometry}
        material={materials.flame}
        position={[-1.95, 1.491, 1.682]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame024.geometry}
        material={materials.flame}
        position={[-1.481, 1.482, 1.195]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame025.geometry}
        material={materials.flame}
        position={[-1.971, 1.482, 1.223]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.flame026.geometry}
        material={materials.flame}
        position={[-1.484, 1.482, 1.692]}
        rotation={[-Math.PI, 0.016, -Math.PI]}
        scale={3.121}
      />
      <mesh
        geometry={nodes.Sphere011.geometry}
        material={materials.baloon}
        position={[1.378, 2.844, 1.311]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere001.geometry}
        material={materials.balloon2}
        position={[1.62, 3.143, 1.038]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere002.geometry}
        material={materials.balloon2}
        position={[1.896, 2.847, 1.135]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere003.geometry}
        material={materials.baloon}
        position={[1.722, 3.381, 1.102]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere004.geometry}
        material={materials.balloon2}
        position={[0.082, 2.705, -2.26]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere005.geometry}
        material={materials.baloon}
        position={[-0.162, 3.018, -2.064]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere006.geometry}
        material={materials.baloon}
        position={[-0.265, 2.592, -2.175]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere007.geometry}
        material={materials.baloon}
        position={[-0.919, 3.34, -1.781]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere008.geometry}
        material={materials.baloon}
        position={[-1.511, 2.413, -2.028]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere009.geometry}
        material={materials.balloon3}
        position={[-1.193, 2.171, -2.316]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere010.geometry}
        material={materials.balloon2}
        position={[-1.397, 2.6, -1.893]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere012.geometry}
        material={materials.balloon2}
        position={[-1.321, 3.18, -2.188]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere013.geometry}
        material={materials.balloon2}
        position={[-0.429, 2.035, -1.786]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere014.geometry}
        material={materials.balloon3}
        position={[0.463, 3.097, -2.458]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere015.geometry}
        material={materials.balloon3}
        position={[2.183, 3.313, 1.125]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere016.geometry}
        material={materials.baloon}
        position={[2.692, 3.411, 0.001]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere017.geometry}
        material={materials.baloon}
        position={[-2.482, 2.817, 1.641]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere018.geometry}
        material={materials.balloon2}
        position={[-2.381, 3.148, 1.945]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere019.geometry}
        material={materials.balloon3}
        position={[-2.088, 3.878, 1.737]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere020.geometry}
        material={materials.baloon}
        position={[-1.625, 5.081, 1.318]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere021.geometry}
        material={materials.baloon}
        position={[1.311, 4.694, 1.063]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere022.geometry}
        material={materials.balloon2}
        position={[1.633, 4.464, 1.091]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere023.geometry}
        material={materials.balloon2}
        position={[1.605, 5.002, 1.587]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <mesh
        geometry={nodes.Sphere024.geometry}
        material={materials.baloon}
        position={[3.196, 5.114, 1.416]}
        rotation={[-2.906, 1.094, 2.908]}
        scale={0.139}
      />
      <group
        position={[0.473, 2.287, -0.733]}
        rotation={[0.718, -0.72, -0.216]}
        scale={0.02}
      >
        <mesh
          geometry={nodes.Cube007_1.geometry}
          material={materials["Material.031"]}
        />
        <mesh
          geometry={nodes.Cube007_2.geometry}
          material={materials["Material.033"]}
        />
      </group>
      <group
        position={[0.532, 2.147, -0.763]}
        rotation={[0.718, -0.72, 0.657]}
        scale={0.177}
      >
        <mesh
          geometry={nodes.Cube005_1.geometry}
          material={materials["Material.029"]}
        />
        <mesh
          geometry={nodes.Cube005_2.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          geometry={nodes.Cube005_3.geometry}
          material={materials["Material.027"]}
        />
        <mesh
          geometry={nodes.Cube005_4.geometry}
          material={materials["Material.031"]}
        />
      </group>
      <group
        position={[0.666, 1.909, -0.829]}
        rotation={[0.742, -0.706, 0.672]}
        scale={0.177}
      >
        <mesh
          geometry={nodes.Cube006_1.geometry}
          material={materials["Material.033"]}
        />
        <mesh
          geometry={nodes.Cube006_2.geometry}
          material={materials["Material.032"]}
        />
        <mesh
          geometry={nodes.Cube006_3.geometry}
          material={materials["Material.030"]}
        />
      </group>
      <group
        position={[0.68, 1.849, -0.788]}
        rotation={[0.568, -0.796, 0.553]}
        scale={0.065}
      >
        <primitive object={nodes.Bone006} />
        <skinnedMesh
          geometry={nodes.Cube008_1.geometry}
          material={materials["Material.033"]}
          skeleton={nodes.Cube008_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube008_2.geometry}
          material={materials["Material.031"]}
          skeleton={nodes.Cube008_2.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube008_3.geometry}
          material={materials["Material.026"]}
          skeleton={nodes.Cube008_3.skeleton}
        />
      </group>
      <group
        position={[0.68, 1.849, -0.788]}
        rotation={[0.568, -0.796, 0.553]}
        scale={0.065}
      >
        <primitive object={nodes.Bone009} />
        <skinnedMesh
          geometry={nodes.Cube009_1.geometry}
          material={materials["Material.033"]}
          skeleton={nodes.Cube009_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube009_2.geometry}
          material={materials["Material.031"]}
          skeleton={nodes.Cube009_2.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube009_3.geometry}
          material={materials["Material.026"]}
          skeleton={nodes.Cube009_3.skeleton}
        />
      </group>
      <group
        position={[0.699, 1.859, -0.804]}
        rotation={[0.568, -0.796, 0.553]}
        scale={0.065}
      >
        <primitive object={nodes.Bone003} />
        <skinnedMesh
          geometry={nodes.Cube011.geometry}
          material={materials["Material.033"]}
          skeleton={nodes.Cube011.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube011_1.geometry}
          material={materials["Material.031"]}
          skeleton={nodes.Cube011_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube011_2.geometry}
          material={materials["Material.026"]}
          skeleton={nodes.Cube011_2.skeleton}
        />
      </group>
      <group
        position={[0.699, 1.859, -0.804]}
        rotation={[0.568, -0.796, 0.553]}
        scale={0.065}
      >
        <primitive object={nodes.Bone} />
        <skinnedMesh
          geometry={nodes.Cube010_1.geometry}
          material={materials["Material.033"]}
          skeleton={nodes.Cube010_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube010_2.geometry}
          material={materials["Material.031"]}
          skeleton={nodes.Cube010_2.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Cube010_3.geometry}
          material={materials["Material.026"]}
          skeleton={nodes.Cube010_3.skeleton}
        />
      </group>
      <mesh
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        position={[-0.642, -0.759, -0.348]}
        rotation={[0.175, -0.057, 0.151]}
      />
      <mesh
        geometry={nodes.Cube002.geometry}
        material={materials["Objects.003"]}
        position={[0.267, 1.073, -1.959]}
        scale={0.19}
      />
      <mesh
        geometry={nodes.Cube003.geometry}
        material={materials["Objects.004"]}
        position={[2.217, 1.099, 1.369]}
        rotation={[-0.174, -0.75, -0.327]}
        scale={0.129}
      />
      <mesh
        geometry={nodes.Cube010.geometry}
        material={materials["Objects.003"]}
        position={[1.417, 1.119, 0.851]}
        rotation={[Math.PI, -0.878, Math.PI]}
        scale={0.19}
      />
      <group position={[-1.822, 1.068, -0.114]} scale={0.187}>
        <mesh
          geometry={nodes.Cube034.geometry}
          material={materials["Material.035"]}
          position={[0.001, 0.805, 0]}
          scale={[0.71, 1.319, 0.71]}
        />
        <mesh
          geometry={nodes.Cube035.geometry}
          material={materials["Material.034"]}
          position={[-0.132, 0.722, 0]}
          scale={[0.71, 1.319, 0.71]}
        />
        <mesh
          geometry={nodes.Cube036.geometry}
          material={materials["Material.034"]}
          position={[-0.247, 1.435, 0]}
          rotation={[0, -0.773, 0.194]}
          scale={[0.239, 0.185, 0.242]}
        />
      </group>
      <mesh
        geometry={nodes.Grass001.geometry}
        material={materials["Mat_tree.005"]}
        position={[2.099, 1.106, 0.006]}
        scale={0.44}
      />
      <mesh
        geometry={nodes.Grass002.geometry}
        material={materials["Mat_tree.005"]}
        position={[2.237, 1.105, -0.136]}
        scale={0.44}
      />
      <mesh
        geometry={nodes.Grass003.geometry}
        material={materials["Mat_tree.005"]}
        position={[2.237, 1.105, 1.652]}
        scale={0.44}
      />
      <mesh
        geometry={nodes.Grass004.geometry}
        material={materials["Mat_tree.009"]}
        position={[2.018, 2.171, -2.028]}
        scale={0.38}
      />
      <mesh
        geometry={nodes.Grass005.geometry}
        material={materials["Mat_tree.007"]}
        position={[2.155, 2.148, -1.533]}
        scale={0.399}
      />
      <mesh
        geometry={nodes.Grass006.geometry}
        material={materials["Mat_tree.010"]}
        position={[2.183, 2.171, -2.028]}
        scale={0.38}
      />
      <mesh
        geometry={nodes.Small_Crystal_1003.geometry}
        material={materials["Material.006"]}
        position={[-0.891, 0.992, -1.391]}
        rotation={[-3.034, -0.158, 2.76]}
        scale={[0.105, 0.15, 0.215]}
      />
      <mesh
        geometry={nodes.Small_Crystal_1004.geometry}
        material={materials["Material.006"]}
        position={[-1.187, 1.122, -1.16]}
        rotation={[1.984, -0.876, -2.757]}
        scale={[0.105, 0.15, 0.215]}
      />
      <mesh
        geometry={nodes.Small_Crystal_1005.geometry}
        material={materials["Material.006"]}
        position={[1.706, 1.43, -0.66]}
        rotation={[2.174, 0.146, -2.736]}
        scale={[0.105, 0.15, 0.215]}
      />
      <mesh
        geometry={nodes.Small_Crystal_1006.geometry}
        material={materials["Material.006"]}
        position={[2.173, 1.015, -0.57]}
        rotation={[2.541, 0.106, -3.044]}
        scale={[0.171, 0.244, 0.35]}
      />
      <mesh
        geometry={nodes.Tree001.geometry}
        material={materials["Mat_tree.003"]}
        position={[2.197, 1.93, -1.823]}
        scale={0.153}
      />
      <mesh
        geometry={nodes.Tree003.geometry}
        material={materials["Mat_tree.002"]}
        position={[1.822, 2.163, -2.052]}
        scale={0.181}
      />
      <mesh
        geometry={nodes.Tree006.geometry}
        material={materials.Mat_tree}
        position={[1.391, 1.169, 1.947]}
        scale={0.219}
      />
      <mesh
        geometry={nodes.Tree017.geometry}
        material={materials["Mat_tree.006"]}
        position={[0.771, 1.021, -2.441]}
        scale={0.228}
      />
      <mesh
        geometry={nodes.Tree018.geometry}
        material={materials["Mat_tree.001"]}
        position={[2.119, 1.136, 0.918]}
        scale={0.288}
      />
      <mesh
        geometry={nodes.Tree025.geometry}
        material={materials["Mat_tree.004"]}
        position={[1.764, 1.144, 1.539]}
        rotation={[0, -1.561, 0]}
        scale={0.158}
      />
      <mesh
        geometry={nodes.Small_Crystal_1007.geometry}
        material={materials["Material.006"]}
        position={[2.173, 1.015, -0.57]}
        rotation={[2.541, 0.106, -3.044]}
        scale={[0.171, 0.244, 0.35]}
      />
      <mesh
        geometry={nodes.Small_Crystal_1008.geometry}
        material={materials["Material.006"]}
        position={[1.706, 1.43, -0.66]}
        rotation={[2.174, 0.146, -2.736]}
        scale={[0.105, 0.15, 0.215]}
      />
    </a.group>
  );
}
