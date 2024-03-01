import { a } from "@react-spring/three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import sharkScene from "../assets/3d/shark.glb";

export function Shark(props) {
  const ref = useRef();

  const { nodes, materials } = useGLTF(sharkScene);
  
  return (
    <a.group {...props} ref={ref}>
      <mesh
        geometry={nodes.Object_2.geometry}
        material={materials["Material.001"]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </a.group>
  );
}
