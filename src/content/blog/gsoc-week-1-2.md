---
title: "GSoC Week 1-2: Quantifying Where the Existing Pipeline Breaks"
description: "Establishing reproducible Phase 1 baselines on Hindi-BenchIE, and a previously undocumented failure mode hiding inside IndIE's rule engine."
pubDate: 2026-06-09T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "benchmarks"]
---

The first two weeks were deliberately unglamorous: no fine-tuning, no new architecture, just establishing exactly where the existing systems succeed and where they fail. Everything downstream depends on having that picture right.

## Phase 1 baselines

I evaluated the existing systems against the full Hindi-BenchIE dataset (112 sentences), reusing the `BenchIEDetailedComparator` from GSoC25_H rather than writing a new evaluator, so the numbers stay directly comparable across years rather than introducing a new measurement that can't be cross-checked.

| System | Precision | Recall | F1 |
|---|---|---|---|
| IndIE | 0.44 | 0.49 | 0.46 |
| GSoC25_H (IndIE + Gemma-3-12B + ReAct) | 0.21 | 0.58 | 0.31 |
| Gemma-3-1B zero-shot | 0.00 | 0.00 | 0.00 |

The result that mattered most wasn't in the F1 column. Breaking the errors down by component, argument span extraction sits at 0% error across all three systems — subjects and objects are identified correctly every single time. The predicate is the sole point of failure, consistently, across every architecture tested. That's a clean, narrow target: whatever comes next in this project needs to be aimed entirely at predicate generation, not entity recognition.

## A failure mode that wasn't in the original taxonomy

Reading through IndIE's failures by hand surfaced something the original error categories didn't account for. When IndIE's rule engine can't determine a relation with confidence, it doesn't fail loudly — it silently emits the literal string `"property"` as the predicate and moves on. I'm calling this PREDICATE_PLACEHOLDER.

It's a quiet failure because the output still looks like a valid triple. There's a subject, a relation, an object — it just happens that the relation is meaningless. Quantifying it across IndIE's failures, this accounts for 28.9% of them. The same check against GSoC25_H's hybrid pipeline shows it dropping to 8.2%, which is a useful data point in itself: the LLM completion step in that pipeline is genuinely resolving most of these placeholder cases, just not all of them. The residual 8.2% is worth tracking closely, because it's the kind of error that's invisible unless you specifically look for it.

## Sizing the fine-tuning data requirement

Before deciding anything about training data, I wanted an evidence-based answer to how much is actually needed. Full fine-tuning is off the table here — it needs millions of examples, which isn't realistic for this task. LoRA-style fine-tuning changes the calculus substantially, since only small adapter matrices are updated and the base model's pretrained knowledge stays intact rather than being overwritten.

For a narrow, well-defined structured extraction task with a consistent JSON output format, the research on this is fairly consistent:


The more interesting implication is that quality beats quantity well before that ceiling: a smaller set of manually verified examples, anchored against Hindi-BenchIE's gold annotations, should outperform a much larger but noisier synthetic set. That single conclusion ends up shaping most of what Week 3 turned into.

## Resources

- [Phase 1 ablation table (markdown)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.md)
- [Phase 1 ablation table (CSV)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.csv)
- [Week 1 baselines notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/01_week1_baselines.ipynb)
- [Week 2 error analysis notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/02_week2_error_analysis.ipynb)

## What's next

With the data sizing question answered in principle, the obvious next step is to find out what's actually inside the 20K dataset I have on hand — not just how big it is, but what proportion of it is usable at all.
