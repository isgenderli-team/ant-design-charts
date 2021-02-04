import React, { useRef, useEffect, useState } from 'react';
import { IMapConfig, ISceneConfig, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

interface IMapSceneConig {
  style?: React.CSSProperties;
  className?: string;
  map: Partial<IMapConfig>;
  option?: Partial<ISceneConfig>;
  children?: React.ReactNode;
  parentBox?: HTMLElement;
  onSceneLoaded?: (scene: Scene, container?: HTMLElement | null) => void;
  [key: string]: any;
}

const MapScene = React.memo((props: IMapSceneConig) => {
  const { style, className, map, option, onSceneLoaded, parentBox, children } = props;
  const container = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene>();

  // 地图初始
  useEffect(() => {
    console.log(props);

    if (parentBox) {
      parentBox.appendChild(container.current as HTMLElement);
    }
    const sceneInstance = new Scene({
      id: container.current!,
      ...option,
      map: new Map(map),
    });
    sceneInstance.on('loaded', () => {
      setScene(sceneInstance);
      if (onSceneLoaded) {
        onSceneLoaded(sceneInstance, container.current);
      }
    });
    return () => {
      sceneInstance.destroy();
    };
  }, []);

  // 更新地图样式
  useEffect(() => {
    if (scene && map.style) {
      scene.setMapStyle(map.style);
    }
  }, [JSON.stringify(map.style)]);

  useEffect(() => {
    if (scene && map.zoom) {
      scene.setZoom(map.zoom);
    }
  }, [map.zoom]);

  useEffect(() => {
    if (scene && map.center) {
      scene.setCenter(map.center);
    }
  }, [JSON.stringify(map.center)]);

  useEffect(() => {
    if (scene && map.pitch) {
      scene.setPitch(map.pitch);
    }
  }, [map.pitch]);

  useEffect(() => {
    if (scene && map.rotation) {
      scene.setRotation(map.rotation);
    }
  }, [map.rotation]);

  return (
    <div ref={container} className={className} style={style}>
      {scene && children}
    </div>
  );
});

export default MapScene;