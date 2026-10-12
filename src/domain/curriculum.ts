/**
 * NovaMath Lab — Curriculum Map & Metadata
 * Aligned with Section 5 of PROJECT_PLAN.md (6th Grade Foundations + 7th Grade Bridge).
 */

export interface SkillDefinition {
  id: string;
  strandId: string;
  name: string;
  description: string;
  gradeLevel: 6 | 7;
  prerequisites: string[];
}

export interface CurriculumStrand {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  skills: SkillDefinition[];
}

export const CURRICULUM_STRANDS: CurriculumStrand[] = [
  {
    id: 'number_sense',
    name: 'Number Sense',
    icon: '🔢',
    color: 'var(--color-navy-700)',
    description: 'Factors, multiples, primes, GCF, LCM, and order of operations.',
    skills: [
      {
        id: 'factors_multiples',
        strandId: 'number_sense',
        name: 'Factors & Multiples',
        description: 'Prime factorization, greatest common factor, and least common multiple.',
        gradeLevel: 6,
        prerequisites: [],
      },
      {
        id: 'order_of_operations',
        strandId: 'number_sense',
        name: 'Order of Operations',
        description: 'Evaluating expressions with parentheses, exponents, and arithmetic.',
        gradeLevel: 6,
        prerequisites: ['factors_multiples'],
      },
    ],
  },
  {
    id: 'fractions_decimals',
    name: 'Fractions & Decimals',
    icon: '🥧',
    color: 'var(--color-teal-700)',
    description: 'Operations, conversions, estimation, and multi-step applications.',
    skills: [
      {
        id: 'fraction_operations',
        strandId: 'fractions_decimals',
        name: 'Fraction Operations',
        description: 'Add, subtract, multiply, and divide fractions and mixed numbers.',
        gradeLevel: 6,
        prerequisites: ['factors_multiples'],
      },
      {
        id: 'decimal_operations',
        strandId: 'fractions_decimals',
        name: 'Decimal Operations',
        description: 'Fluency in decimal arithmetic, place value, and conversions.',
        gradeLevel: 6,
        prerequisites: ['fraction_operations'],
      },
    ],
  },
  {
    id: 'ratios_rates',
    name: 'Ratios & Percent',
    icon: '⚖️',
    color: 'var(--color-coral-700)',
    description: 'Equivalent ratios, unit rates, percentages, and proportional tables.',
    skills: [
      {
        id: 'ratio_reasoning',
        strandId: 'ratios_rates',
        name: 'Ratio Reasoning',
        description: 'Representing and comparing equivalent ratios and tape diagrams.',
        gradeLevel: 6,
        prerequisites: ['fraction_operations'],
      },
      {
        id: 'unit_rates',
        strandId: 'ratios_rates',
        name: 'Unit Rates & Proportions',
        description: 'Solving rate problems, unit pricing, and speed comparisons.',
        gradeLevel: 6,
        prerequisites: ['ratio_reasoning'],
      },
      {
        id: 'percent_applications',
        strandId: 'ratios_rates',
        name: 'Percent Calculations',
        description: 'Finding parts, wholes, and percentages in practical contexts.',
        gradeLevel: 6,
        prerequisites: ['ratio_reasoning', 'decimal_operations'],
      },
    ],
  },
  {
    id: 'integers',
    name: 'Integers',
    icon: '🌡️',
    color: 'var(--color-gold-700)',
    description: 'Number-line reasoning and operations with positive and negative numbers.',
    skills: [
      {
        id: 'integer_concepts',
        strandId: 'integers',
        name: 'Signed Numbers & Absolute Value',
        description: 'Interpreting negative numbers, elevation, temperature, and distance from zero.',
        gradeLevel: 6,
        prerequisites: [],
      },
      {
        id: 'integer_operations',
        strandId: 'integers',
        name: 'Integer Operations',
        description: 'Adding and subtracting integers on number lines and in contextual models.',
        gradeLevel: 6,
        prerequisites: ['integer_concepts'],
      },
    ],
  },
  {
    id: 'expressions_equations',
    name: 'Expressions & Equations',
    icon: '🧩',
    color: 'var(--color-purple-700)',
    description: 'Substitution, distributive property, equivalent expressions, and equations.',
    skills: [
      {
        id: 'algebraic_expressions',
        strandId: 'expressions_equations',
        name: 'Algebraic Expressions',
        description: 'Writing, evaluating, and applying the distributive property.',
        gradeLevel: 6,
        prerequisites: ['order_of_operations'],
      },
      {
        id: 'one_step_equations',
        strandId: 'expressions_equations',
        name: 'One-Step Equations',
        description: 'Solving equations of the form x + p = q and px = q using balance reasoning.',
        gradeLevel: 6,
        prerequisites: ['algebraic_expressions'],
      },
    ],
  },
  {
    id: 'geometry',
    name: 'Geometry',
    icon: '📐',
    color: 'var(--color-teal-600)',
    description: 'Area, surface area, volume, coordinate geometry, and composite shapes.',
    skills: [
      {
        id: 'area_composite_shapes',
        strandId: 'geometry',
        name: 'Area & Composite Shapes',
        description: 'Calculating areas of triangles, parallelograms, and decomposed polygons.',
        gradeLevel: 6,
        prerequisites: ['decimal_operations'],
      },
      {
        id: 'volume_surface_area',
        strandId: 'geometry',
        name: 'Volume & Surface Area',
        description: 'Prisms, net diagrams, and packing with fractional edge units.',
        gradeLevel: 6,
        prerequisites: ['area_composite_shapes'],
      },
      {
        id: 'coordinate_plane',
        strandId: 'geometry',
        name: 'Coordinate Plane',
        description: 'Plotting points, finding distances, and drawing polygons in four quadrants.',
        gradeLevel: 6,
        prerequisites: ['integer_concepts'],
      },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    icon: '📊',
    color: 'var(--color-coral-600)',
    description: 'Mean, median, range, distributions, box plots, and chance investigations.',
    skills: [
      {
        id: 'measures_of_center',
        strandId: 'statistics',
        name: 'Measures of Center & Spread',
        description: 'Calculating and interpreting mean, median, mode, range, and MAD.',
        gradeLevel: 6,
        prerequisites: ['decimal_operations'],
      },
      {
        id: 'data_displays',
        strandId: 'statistics',
        name: 'Data Displays & Distributions',
        description: 'Interpreting dot plots, histograms, and box plots.',
        gradeLevel: 6,
        prerequisites: ['measures_of_center'],
      },
      {
        id: 'probability_models',
        strandId: 'statistics',
        name: 'Probability Models',
        description: 'Representing simple chance events as fractions and comparing likelihoods.',
        gradeLevel: 6,
        prerequisites: ['ratio_reasoning'],
      },
    ],
  },
  {
    id: 'seventh_bridge',
    name: '7th-Grade Bridge',
    icon: '🌉',
    color: 'var(--color-gold-600)',
    description: 'Preview of advanced topics: rational numbers, two-step equations, and scale factor.',
    skills: [
      {
        id: 'rational_operations',
        strandId: 'seventh_bridge',
        name: 'Rational Number Operations',
        description: 'Multiplying and dividing signed fractions and decimals.',
        gradeLevel: 7,
        prerequisites: ['integer_operations', 'fraction_operations'],
      },
      {
        id: 'two_step_equations',
        strandId: 'seventh_bridge',
        name: 'Two-Step Equations',
        description: 'Solving and modeling equations in the form ax + b = c.',
        gradeLevel: 7,
        prerequisites: ['one_step_equations'],
      },
      {
        id: 'scale_drawings',
        strandId: 'seventh_bridge',
        name: 'Scale Drawings & Similarity',
        description: 'Computing actual lengths from scale drawings and scale factors.',
        gradeLevel: 7,
        prerequisites: ['unit_rates', 'area_composite_shapes'],
      },
    ],
  },
];

export const ALL_SKILLS: SkillDefinition[] = CURRICULUM_STRANDS.flatMap((s) => s.skills);
