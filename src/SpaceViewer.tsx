import * as React from "react";
import { FC, useCallback, useEffect, useState } from "react";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { Space } from "@smplrspace/smplr-loader/dist/generated/smplr";
import { evolve, map } from "ramda";

import { stalls, sensors, beacons, Stall, Sensor, Beacon } from "./data";
import ThermostatServices from "./ThermostatServices";

const INITIAL_MODE = "3d";

export const SpaceViewer: FC = () => {
  const spaceRef = React.useRef<Space>();

  const [viewerReady, setViewerReady] = useState(false);

  // handle weather
  const [weather, setWeather] = useState(0);

  // handle 2d/3d modes
  const [mode, setMode] = useState<"2d" | "3d">(INITIAL_MODE);
  const onModeChange = useCallback(setMode, [setMode]);
  const autoElevation = map(
    evolve({
      position: { elevation: (value: number) => (mode === "3d" ? value : 0) },
    })
  );

  const fetchCurrentWeather = () => {
    ThermostatServices.getCurrent().then((response: any) => {
      console.log(response);
      setWeather(response.data.main.temp);
    });
  };

  useEffect(() => {
    // we recommend using the default value 'esm' in your code but stackblitz required 'umd'
    loadSmplrJs("umd")
      .then((smplr) => {
        spaceRef.current = new smplr.Space({
          spaceId: "9ac87423-101f-41ef-9c3a-bccd79a7dad7",
          clientToken: "pub_eb760fee77634cdab2fe31146fc371c2",
          containerId: "test",
        });
        spaceRef.current.startViewer({
          preview: true,
          onReady: () => setViewerReady(true),
          onError: (error) => console.error("Could not start viewer", error),
          renderOptions: {
            walls: {
              alpha: 0.18,
              // maxHeightCm: 120,
            },
          },
        });
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  // show data when viewer ready
  useEffect(() => {
    if (!viewerReady) {
      return;
    }

    spaceRef.current?.addDataLayer<Stall>({
      id: "stalls",
      type: "polygon",
      data: stalls,
      tooltip: (d) => `${d.name} - ${d.hits} hits`,
      color: (d) =>
        d.hits < 8 ? "#3aa655" : d.hits < 16 ? "#c08727" : "#ff3f34",
      alpha: 0.7,
      height: mode === "3d" ? 1.9 : 0.0045,
    });

    spaceRef.current?.addDataLayer<Sensor>({
      id: "sensors",
      type: "point",
      data: autoElevation(sensors),
      tooltip: (d) => `Sensor ${d.id}`,
      color: "#357afc",
      diameter: 0.4,
    });

    const weatherSensors = [
      {
        id: "IW27",
        position: {
          levelIndex: 0,
          x: 17.441829681396484,
          z: -15.135374069213867,
          elevation: 2,
        },
      },
    ];

    spaceRef.current?.addDataLayer<Sensor>({
      id: "weatherSensors",
      type: "point",
      data: autoElevation(weatherSensors),
      tooltip: (d) => `Temperature ${weather}`,
      color: "#357afc",
      diameter: 0.4,
    });

    return () => {
      spaceRef.current?.removeDataLayer("stalls");
      spaceRef.current?.removeDataLayer("sensors");
      spaceRef.current?.removeDataLayer("beacons");
      spaceRef.current?.removeDataLayer("beacons-range");
    };
  }, [viewerReady, mode]);

  return (
    <div className="smplr-wrapper">
      <div id="test" className="smplr-embed"></div>
    </div>
  );
};
