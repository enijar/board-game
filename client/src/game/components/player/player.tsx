import React from "react";
import * as THREE from "three";
import { MeshBVH, acceleratedRaycast } from "three-mesh-bvh";
import { useFrame } from "@react-three/fiber";
import useKeys from "@/game/hooks/use-keys";
import { updateVelocity } from "@/game/utils";

THREE.Mesh.prototype.raycast = acceleratedRaycast;

let tempBox = new THREE.Box3();

const rayVector = new THREE.Vector3(0, -1, 0);

type Props = {
  speed?: number;
};

export default function Player({ speed = 0.05 }: Props) {
  const velocityRef = React.useRef(new THREE.Vector3());

  const keys = useKeys(["w", "s", "a", "d", " "]);

  const playerRef = React.useRef<THREE.Mesh>();
  const floorRef = React.useRef<THREE.Mesh>();

  React.useEffect(() => {
    const player = playerRef.current;
    const floor = floorRef.current;
    player.geometry.boundsTree = new MeshBVH(player.geometry);
    floor.geometry.boundsTree = new MeshBVH(floor.geometry);
  }, []);

  useFrame(({ raycaster }) => {
    raycaster.firstHitOnly = true;

    const player = playerRef.current;
    const floor = floorRef.current;
    const velocity = velocityRef.current;

    updateVelocity(keys, velocity);

    player.position.add(velocity.multiplyScalar(speed));

    floor.geometry.boundsTree.shapecast({
      intersectsBounds(box) {
        tempBox = tempBox.makeEmpty();
        return box.intersectsBox(tempBox);
      },
      intersectsTriangle() {
        //
      },
    });
  });

  return (
    <group>
      <mesh
        ref={playerRef}
        position={[0, 0.5, 0]}
        userData={{ name: "player" }}
      >
        <boxBufferGeometry />
        <meshBasicMaterial color="crimson" />
      </mesh>

      <mesh
        ref={floorRef}
        userData={{ name: "floor" }}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
      >
        <planeBufferGeometry args={[3, 3]} />
        <meshBasicMaterial color="grey" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
