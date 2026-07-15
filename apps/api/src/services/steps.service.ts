/**
 * Steps business logic. Reads through the repository (never the filesystem
 * directly), applies ordering, and raises domain errors for the controller
 * layer to surface via the central error handler.
 */
import type { Step } from '@security-system-builder/shared';
import { stepsRepository } from '../repositories/steps.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const stepsService = {
  /** Returns all steps sorted ascending by their `order`. */
  async getAllSteps(): Promise<Step[]> {
    const steps = await stepsRepository.find();
    return steps.sort((a, b) => a.order - b.order);
  },

  /** Returns a single step by id, or throws a 404 `ApiError` when absent. */
  async getStepById(id: string): Promise<Step> {
    const step = await stepsRepository.findById(id);
    if (!step) {
      throw ApiError.notFound('Step not found');
    }
    return step;
  },
};
