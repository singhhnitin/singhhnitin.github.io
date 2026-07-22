---
title: "GSoC Week 1-2: Quantifying Where the Existing Pipeline Breaks"
description: "Establishing reproducible Phase 1 baselines on Hindi-BenchIE, and a previously undocumented failure mode hiding inside IndIE's rule engine."
pubDate: 2026-06-09T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "benchmarks"]
---

First post, so a quick recap of what I'm actually doing this summer: I'm working with the DBpedia Hindi Chapter on pulling structured triples (subject, predicate, object) out of Hindi text, accurately enough that they can actually go into the Hindi DBpedia Knowledge Graph. That means fine-tuning small language models for the extraction part, and later building a human-in-the-loop interface so that when a reviewer corrects something, that correction becomes training data instead of just a one-off fix. The interface is a later-summer problem though. Weeks 1 and 2 were about something much less exciting: figuring out where the systems that already exist actually break.

I could've skipped this and just started fine-tuning something. There's an existing rule-based system (IndIE), and there's a hybrid pipeline from last year's GSoC (I'll call it GSoC25_H) that adds an LLM on top of it. It would've been easy to just pick one and start improving it. But every call I make for the rest of the summer — what to fine-tune, what data matters, what "better" even means here — depends on knowing exactly where these systems stand right now. If I get that wrong, everything after it is guesswork. So the first two weeks were just baselines, nothing else.

## Setting the baseline

I ran the existing systems against the full Hindi-BenchIE dataset — 112 hand-annotated sentences, basically the gold standard for this task. Instead of writing my own evaluation script, I reused `BenchIEDetailedComparator` from GSoC25_H. Partly laziness, mostly on purpose: a new evaluator might fit my needs slightly better, but then I can't compare my numbers to last year's cleanly, and I'd be trusting a script I hadn't stress-tested. Not worth it for a marginal gain.

| System | Precision | Recall | F1 |
|---|---|---|---|
| IndIE | 0.44 | 0.49 | 0.46 |
| GSoC25_H (IndIE + Gemma-3-12B + ReAct) | 0.21 | 0.58 | 0.31 |
| Gemma-3-1B zero-shot | 0.00 | 0.00 | 0.00 |

The F1 column isn't actually the useful part here. When I broke errors down by component — subject, predicate, object — argument span extraction was at 0% error across all three systems. Every subject, every object, identified correctly, every time, regardless of which system produced it. Every single failure was in the predicate. That's actually a good result to get this early, because it means I don't need to worry about entity recognition at all. Whatever I build next just needs to be aimed at predicate generation.

## A failure mode nobody had a name for

The aggregate numbers only tell you so much, so I went through IndIE's failures by hand instead of just trusting the scores. Found something the original error categories didn't account for: when IndIE's rule engine can't figure out a relation, it doesn't fail loudly or return nothing — it just silently outputs the literal string `"property"` as the predicate and moves on like nothing happened. I'm calling this PREDICATE_PLACEHOLDER. Once I knew to look for it, it showed up a lot more than I expected.

It's sneaky because the output still looks like a real triple. Subject, something in the relation slot, object — nothing about the shape tells you it's broken, you have to actually read it. Across IndIE's failures, this accounts for 28.9% of them. Ran the same check on GSoC25_H's pipeline and it drops to 8.2%, which tells me the LLM step is fixing most of these on its own, just not all of them. That leftover 8.2% is worth keeping an eye on, mainly because it's the kind of error an F1 score alone would never catch.

## How much data does fine-tuning actually need

Before picking a training approach I wanted an actual answer to this instead of guessing. Full fine-tuning is out — needs millions of examples, not realistic here. LoRA changes that a lot: you're only updating small adapter matrices, the base model stays frozen, and the data requirement drops by a lot.

For a narrow, well-defined extraction task with a consistent JSON output like this one, the published numbers on LoRA data requirements land in a fairly consistent range. The part that actually matters for me though is that quality wins over quantity well before you hit that range — a smaller set of manually checked examples, verified against Hindi-BenchIE's gold annotations, should beat a bigger but noisier synthetic set. That's basically the whole premise Week 3 ended up being built around.

## Resources

- [Phase 1 ablation table (markdown)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.md)
- [Phase 1 ablation table (CSV)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.csv)
- [Week 1 baselines notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/01_week1_baselines.ipynb)
- [Week 2 error analysis notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/02_week2_error_analysis.ipynb)

## What's next

With the data-sizing question answered in principle, next step was to stop reasoning about the training data in the abstract and actually go look at what's inside the 20K-example dataset I already have — not just how big it is, but how much of it is actually usable. That's Week 3.
