import React, { createContext, useReducer, useCallback } from 'react';

export const SimulationContext = createContext();

const initialState = {
  currentSimulation: null,
  simulations: [],
  lastSimulationId: null
};

const simulationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SIMULATION':
      return {
        ...state,
        currentSimulation: action.payload,
        lastSimulationId: action.payload?.id
      };
    case 'CLEAR_CURRENT_SIMULATION':
      return {
        ...state,
        currentSimulation: null
      };
    case 'ADD_SIMULATION':
      return {
        ...state,
        simulations: [...state.simulations, action.payload]
      };
    case 'CLEAR_SIMULATIONS':
      return {
        ...state,
        simulations: []
      };
    default:
      return state;
  }
};

export const SimulationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  const setCurrentSimulation = useCallback((simulation) => {
    dispatch({ type: 'SET_CURRENT_SIMULATION', payload: simulation });
  }, []);

  const clearCurrentSimulation = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_SIMULATION' });
  }, []);

  const addSimulation = useCallback((simulation) => {
    dispatch({ type: 'ADD_SIMULATION', payload: simulation });
  }, []);

  const clearSimulations = useCallback(() => {
    dispatch({ type: 'CLEAR_SIMULATIONS' });
  }, []);

  const value = {
    ...state,
    setCurrentSimulation,
    clearCurrentSimulation,
    addSimulation,
    clearSimulations
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};