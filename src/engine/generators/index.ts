import type { QuestionGenerator } from '../types';
import { fractionOperationsGenerator } from './fractionOperations';
import { integerTemperatureGenerator } from './integerTemperature';
import { unitRatesGenerator } from './unitRates';
import { proportionsGenerator } from './proportions';
import { percentDiscountsGenerator } from './percentDiscounts';
import { expressionEvaluationGenerator } from './expressionEvaluation';
import { equationsGenerator } from './equations';
import { geometryAreaVolumeGenerator } from './geometryAreaVolume';
import { statisticsMeanGenerator } from './statisticsMean';
import { probabilitySimpleGenerator } from './probabilitySimple';

export {
  fractionOperationsGenerator,
  integerTemperatureGenerator,
  unitRatesGenerator,
  proportionsGenerator,
  percentDiscountsGenerator,
  expressionEvaluationGenerator,
  equationsGenerator,
  geometryAreaVolumeGenerator,
  statisticsMeanGenerator,
  probabilitySimpleGenerator,
};

export const ALL_GENERATORS: QuestionGenerator[] = [
  fractionOperationsGenerator,
  integerTemperatureGenerator,
  unitRatesGenerator,
  proportionsGenerator,
  percentDiscountsGenerator,
  expressionEvaluationGenerator,
  equationsGenerator,
  geometryAreaVolumeGenerator,
  statisticsMeanGenerator,
  probabilitySimpleGenerator,
];

export const GENERATOR_BY_SKILL: Record<string, QuestionGenerator> = {
  fraction_operations: fractionOperationsGenerator,
  decimal_operations: unitRatesGenerator, // shares unit rate decimals
  integer_concepts: integerTemperatureGenerator,
  integer_operations: integerTemperatureGenerator,
  unit_rates: unitRatesGenerator,
  ratio_reasoning: proportionsGenerator,
  percent_applications: percentDiscountsGenerator,
  algebraic_expressions: expressionEvaluationGenerator,
  one_step_equations: equationsGenerator,
  two_step_equations: equationsGenerator,
  area_composite_shapes: geometryAreaVolumeGenerator,
  volume_surface_area: geometryAreaVolumeGenerator,
  measures_of_center: statisticsMeanGenerator,
  probability_models: probabilitySimpleGenerator,
};
