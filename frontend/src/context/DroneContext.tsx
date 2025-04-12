import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TelemetryData } from '../types/telemetry';
import { SystemStatus } from '../types/system';
import { CameraStatus, CameraFeed } from '../types/camera';
import { ControlStatus } from '../types/controls';
import { telemetryService, systemService, cameraService, controlService } from '../services/api';

interface DroneState {
  telemetry: TelemetryData | null;
  systemStatus: SystemStatus | null;
  cameraStatus: CameraStatus | null;
  cameraFeed: CameraFeed | null;
  controlStatus: ControlStatus | null;
  error: string | null;
}

type DroneAction =
  | { type: 'SET_TELEMETRY'; payload: TelemetryData }
  | { type: 'SET_SYSTEM_STATUS'; payload: SystemStatus }
  | { type: 'SET_CAMERA_STATUS'; payload: CameraStatus }
  | { type: 'SET_CAMERA_FEED'; payload: CameraFeed }
  | { type: 'SET_CONTROL_STATUS'; payload: ControlStatus }
  | { type: 'SET_ERROR'; payload: string };

const initialState: DroneState = {
  telemetry: null,
  systemStatus: null,
  cameraStatus: null,
  cameraFeed: null,
  controlStatus: null,
  error: null,
};

const droneReducer = (state: DroneState, action: DroneAction): DroneState => {
  switch (action.type) {
    case 'SET_TELEMETRY':
      return { ...state, telemetry: action.payload };
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload };
    case 'SET_CAMERA_STATUS':
      return { ...state, cameraStatus: action.payload };
    case 'SET_CAMERA_FEED':
      return { ...state, cameraFeed: action.payload };
    case 'SET_CONTROL_STATUS':
      return { ...state, controlStatus: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const DroneContext = createContext<{
  state: DroneState;
  dispatch: React.Dispatch<DroneAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const DroneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(droneReducer, initialState);

  useEffect(() => {
    // Subscribe to telemetry updates
    telemetryService.subscribeToTelemetry((data) => {
      dispatch({ type: 'SET_TELEMETRY', payload: data });
    });

    // Fetch initial system status
    systemService.getSystemStatus()
      .then((response) => {
        dispatch({ type: 'SET_SYSTEM_STATUS', payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });

    // Fetch initial camera status
    cameraService.getCameraStatus()
      .then((response) => {
        dispatch({ type: 'SET_CAMERA_STATUS', payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });

    // Fetch initial control status
    controlService.getControlStatus()
      .then((response) => {
        dispatch({ type: 'SET_CONTROL_STATUS', payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });
  }, []);

  return (
    <DroneContext.Provider value={{ state, dispatch }}>
      {children}
    </DroneContext.Provider>
  );
};

export const useDrone = () => useContext(DroneContext); 