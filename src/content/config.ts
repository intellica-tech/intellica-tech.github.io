// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const useCaseCardSchema = z.object({
  title: z.string(),
  badges: z.array(z.string()).default([]),
  scenario: z.string().optional(),
  interventionLabel: z.string(),
  interventionItems: z.array(z.string()),
  impactLabel: z.string().default('BUSINESS IMPACT'),
  impactItems: z.array(z.string()),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/products' }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'tr']),
    name: z.string(),
    pageTitle: z.string(),
    pageDescription: z.string(),

    hero: z.object({
      category: z.string(),
      titlePrefix: z.string(),
      titleHighlight: z.string(),
      description: z.string(),
    }),

    overview: z.object({
      problem: z.string(),
      approach: z.string(),
      businessValue: z.string(),
      whenPreferred: z.array(z.string()),
      preferredNote: z.string(),
    }),

    capabilities: z.object({
      label: z.string().default('Capabilities'),
      heading: z.string().default('Core'),
      headingHighlight: z.string().default('Capabilities'),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),

    featureSection: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string(),
      calloutTitle: z.string(),
      calloutDescription: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      imageCaption: z.string(),
    }).optional(),

    useCases: z.object({
      label: z.string().default('Solutions'),
      heading: z.string().default('Strategic'),
      headingHighlight: z.string().default('Use Cases'),
      subtitle: z.string().optional(),
      tabs: z.array(z.object({
        id: z.string(),
        label: z.string().nullable(),
        cards: z.array(useCaseCardSchema),
      })),
    }).optional(),

    journey: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string().optional(),
      steps: z.array(z.object({
        number: z.string(),
        title: z.string(),
        description: z.string(),
      })),
    }).optional(),

    integration: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string(),
      items: z.array(z.string()),
    }).optional(),

    jsonLd: z.object({
      type: z.string().default('SoftwareApplication'),
      category: z.string(),
    }),

    customComponents: z.array(z.string()).default([]),
  }),
});

export const collections = { products };
