import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const CancelRequiredFieldsSchema = z.object({
  professionalId: z.number({ required_error: 'Professional ID is required' }),
  datetime: z.string({ required_error: 'Appointment datetime is required' }),
  patientName: z.string({ required_error: 'Patient name is required' }),
});

export function createCancellerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<GraphState> => {

    try {

      const validation = CancelRequiredFieldsSchema.safeParse(state)

      if(validation.error){
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        return {
          ...state,
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      appointmentService.cancelAppointment(
        validation.data.professionalId,
        validation.data.patientName,
        new Date(validation.data.datetime)
      )

      return {
        ...state,
        actionSuccess: true,
      };

    } catch (error) {

      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  };
}
