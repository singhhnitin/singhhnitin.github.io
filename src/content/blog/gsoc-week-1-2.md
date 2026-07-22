---
title: "GSoC Week 1-2: Quantifying Where the Existing Pipeline Breaks"
description: "Establishing reproducible Phase 1 baselines on Hindi-BenchIE, and a previously undocumented failure mode hiding inside IndIE's rule engine."
pubDate: 2026-06-09T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "benchmarks"]
---

This is the first post for my GSoC project with the DBpedia Hindi Chapter. The project is about pulling structured triples (subject, predicate, object) out of Hindi text, accurately enough that they can go into the Hindi DBpedia Knowledge Graph. Over the summer that means fine-tuning small language models for the extraction part, and later building a human-in-the-loop interface so reviewer corrections turn into training data. That part comes later. Weeks 1 and 2 were spent on baselines.

## Setting the baseline

I ran the existing systems — IndIE, and last year's GSoC pipeline (GSoC25_H, which combines IndIE with Gemma-3-12B and ReAct) — against the full Hindi-BenchIE dataset, 112 hand-annotated sentences. I reused `BenchIEDetailedComparator` from GSoC25_H for evaluation instead of writing a new one, so the numbers stay comparable across years.

| System | Precision | Recall | F1 |
|---|---|---|---|
| IndIE | 0.44 | 0.49 | 0.46 |
| GSoC25_H (IndIE + Gemma-3-12B + ReAct) | 0.21 | 0.58 | 0.31 |
| Gemma-3-1B zero-shot | 0.00 | 0.00 | 0.00 |

I broke the errors down by component — subject, predicate, object. Argument span extraction (subjects and objects) was at 0% error across all three systems. Every failure was in the predicate. So predicate generation is where the rest of this project needs to focus.

## A failure mode not in the original taxonomy

I went through IndIE's failures by hand and found something the existing error categories didn't cover: when IndIE's rule engine can't determine a relation, it outputs the literal string `"property"` as the predicate instead of failing or returning nothing. I'm calling this PREDICATE_PLACEHOLDER.

It doesn't show up as an obviously broken output — there's still a subject, a relation slot, and an object, it's just that the relation is a placeholder rather than a real prediction. I quantified it: PREDICATE_PLACEHOLDER accounts for 28.9% of IndIE's failures. Running the same check on GSoC25_H's output, it's 8.2%. I'll keep tracking that 8.2% going forward, since it's not something an F1 score alone would surface.

## Sizing the fine-tuning data requirement

I also wanted to work out how much training data is actually needed before starting on fine-tuning. Full fine-tuning needs millions of examples, which isn't realistic here, so this is LoRA — only small adapter matrices get updated, the base model stays frozen, and the data requirement is much smaller as a result.

For a narrow extraction task with a consistent JSON output format like this one, published numbers on LoRA data requirements land in a fairly consistent range. The other thing worth noting: a smaller set of manually verified examples, checked against Hindi-BenchIE's gold annotations, should outperform a larger but noisier synthetic set. That's the basis for what Week 3 covers.

## Resources

- [Phase 1 ablation table (markdown)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.md)
- [Phase 1 ablation table (CSV)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.csv)
- [Week 1 baselines notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/01_week1_baselines.ipynb)
- [Week 2 error analysis notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/02_week2_error_analysis.ipynb)

## What's next

Next step was going through the 20K-example dataset I have on hand to check how much of it is actually usable. That's Week 3.
