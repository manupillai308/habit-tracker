import { useContext } from 'react';
import PlannerContext from '../context/planner';

function useDBContext() {
  return useContext(PlannerContext);
}

export default useDBContext;
