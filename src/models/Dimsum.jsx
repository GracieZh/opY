import { a } from "@react-spring/three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import dimsumScene from "../assets/3d/dimsum.glb";

export function Dimsum(props) {
  const ref = useRef();
  const { nodes, materials } = useGLTF(dimsumScene);

  return (
    <a.group {...props} ref={ref}>
      <mesh
        geometry={nodes.Dimsum_1.geometry}
        material={materials.Dimsum_Paper_mat}
      />
      <mesh
        geometry={nodes.Dimsum_2.geometry}
        material={materials.Dimsum_Bao_mat}
      />
      <mesh
        geometry={nodes.Dimsum_3.geometry}
        material={materials.Dimsum_Beanpaste_mat}
      />
      <mesh
        geometry={nodes.Dimsum_4.geometry}
        material={materials.Dimsum_Siumai_mat}
      />
      <mesh
        geometry={nodes.Dimsum_5.geometry}
        material={materials.Dimsum_Bamboo_mat}
      />
    </a.group>
  );
}
