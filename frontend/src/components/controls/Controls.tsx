import React, { useState } from 'react';
import './Controls.css';
import { useDrone } from '../../context/DroneContext';
import { ControlCommand, ControlParams } from '../../types/controls';
import { controlService } from '../../services/api';

const Controls: React.FC = () => {
  const { state, dispatch } = useDrone();
  const { controlStatus } = state;
  
  const [movementParams, setMovementParams] = useState<ControlParams>({
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    speed: 0.5
  });

  const sendCommand = async (command: ControlCommand, params?: ControlParams) => {
    try {
      await controlService.sendCommand(command, params);
      
      // Fetch updated control status after sending command
      const response = await controlService.getControlStatus();
      dispatch({ type: 'SET_CONTROL_STATUS', payload: response.data });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to send command' });
      }
    }
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovementParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const renderCommandButtons = () => (
    <div className="command-buttons">
      <button 
        className="command-btn takeoff-btn"
        onClick={() => sendCommand('takeoff')}
        disabled={!controlStatus?.isConnected || controlStatus?.status !== 'ready'}
      >
        Takeoff
      </button>
      <button 
        className="command-btn land-btn"
        onClick={() => sendCommand('land')}
        disabled={!controlStatus?.isConnected}
      >
        Land
      </button>
      <button 
        className="command-btn hover-btn"
        onClick={() => sendCommand('hover')}
        disabled={!controlStatus?.isConnected}
      >
        Hover
      </button>
      <button 
        className="command-btn emergency-btn"
        onClick={() => sendCommand('emergency_stop')}
        disabled={!controlStatus?.isConnected}
      >
        Emergency Stop
      </button>
    </div>
  );

  const renderMovementControls = () => (
    <div className="movement-controls">
      <h3>Movement Controls</h3>
      
      <div className="control-sliders">
        <div className="slider-group">
          <label>Forward/Backward (Y)</label>
          <input 
            type="range" 
            name="y" 
            min="-1" 
            max="1" 
            step="0.1" 
            value={movementParams.y}
            onChange={handleParamChange}
            disabled={!controlStatus?.isConnected}
          />
          <span className="slider-value">{movementParams.y}</span>
        </div>
        
        <div className="slider-group">
          <label>Left/Right (X)</label>
          <input 
            type="range" 
            name="x" 
            min="-1" 
            max="1" 
            step="0.1" 
            value={movementParams.x}
            onChange={handleParamChange}
            disabled={!controlStatus?.isConnected}
          />
          <span className="slider-value">{movementParams.x}</span>
        </div>
        
        <div className="slider-group">
          <label>Up/Down (Z)</label>
          <input 
            type="range" 
            name="z" 
            min="-1" 
            max="1" 
            step="0.1" 
            value={movementParams.z}
            onChange={handleParamChange}
            disabled={!controlStatus?.isConnected}
          />
          <span className="slider-value">{movementParams.z}</span>
        </div>
        
        <div className="slider-group">
          <label>Rotation (Yaw)</label>
          <input 
            type="range" 
            name="yaw" 
            min="-180" 
            max="180" 
            step="5" 
            value={movementParams.yaw}
            onChange={handleParamChange}
            disabled={!controlStatus?.isConnected}
          />
          <span className="slider-value">{movementParams.yaw}°</span>
        </div>
        
        <div className="slider-group">
          <label>Speed</label>
          <input 
            type="range" 
            name="speed" 
            min="0.1" 
            max="1" 
            step="0.1" 
            value={movementParams.speed}
            onChange={handleParamChange}
            disabled={!controlStatus?.isConnected}
          />
          <span className="slider-value">{movementParams.speed}</span>
        </div>
      </div>
      
      <button 
        className="command-btn move-btn"
        onClick={() => sendCommand('move', movementParams)}
        disabled={!controlStatus?.isConnected || controlStatus?.status !== 'ready'}
      >
        Move
      </button>
    </div>
  );

  const renderConnectionStatus = () => (
    <div className={`connection-status ${controlStatus?.isConnected ? 'connected' : 'disconnected'}`}>
      {controlStatus?.isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );

  return (
    <div className="controls-container">
      <div className="controls-header">
        <h2>Drone Controls</h2>
        {controlStatus && renderConnectionStatus()}
      </div>
      
      {controlStatus ? (
        <>
          {renderCommandButtons()}
          {renderMovementControls()}
          
          {controlStatus.error && (
            <div className="control-error">
              Error: {controlStatus.error}
            </div>
          )}
        </>
      ) : (
        <div className="controls-loading">Loading control interface...</div>
      )}
    </div>
  );
};

export default Controls; 