import { config } from '../config.ts';
import { AppointmentService } from '../services/appointmentService.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { buildAppointmentGraph } from './graph.ts';

export function buildGraph() {
  const llmclient = new OpenRouterService(config);
  const apointmentService = new AppointmentService();
  return buildAppointmentGraph(
    llmclient,
    apointmentService
  );
}

export const graph = async () => {
  return buildGraph();
};

export default graph;
