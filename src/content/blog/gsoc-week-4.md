---
title: "Week-4 Embedding Model Evaluation and Building the Review Tool"
description: "Fourth week of the coding period, evaluating a newer embedding model, building the review interface, and generating a noisy training dataset."
pubDate: 2026-06-23
tags: []
---

# Week-4 Embedding Model Evaluation and Building the Review Tool

This is the fourth week (15-21st June) of the coding period of GSoC where the main aim was to evaluate a newer embedding model as a possible upgrade, build the first version of the human review tool, and generate a noisy training dataset for staged learning.

## Evaluating a Newer Embedding Model

The ontology alignment layer runs on a multilingual MiniLM model. A newer, larger model was evaluated this week as a possible replacement, to check whether the extra scale would improve the alignment rate.

| Model | Aligned (of 198 verified test triples) | Precision (manually checked) |
|---|---|---|
| Current model (baseline) | 35 (17.7%) | 100% |
| Newer model (candidate) | 32 (16.2%) | ~69% |

The candidate model matched fewer triples and got more of them wrong. Each of four different attempts to make it work ran into a specific issue — naive usage matched broadly but inaccurately, threshold tuning brought the count down without fixing accuracy, its recommended usage mode made results worse, and a technical feature it needed conflicted with the rest of the software stack. The existing model was kept.

## Building the First HITL Review Interface

I built the first working version of the human review tool as a Streamlit web app. For every extracted fact, a reviewer can Accept, Modify (select or enter the correct property), or Reject (with a required reason from a set of error categories).

Other things built into it this week: color-coded confidence badges using an already-validated threshold, automatic connection to real pipeline data with a fallback demo set, an "About this tool" explanation, and permanent public hosting via GitHub and Streamlit Community Cloud.

Status at the end of the week: built, tested with no errors, and deployed live in demo mode, ready to be connected to the full dataset.

## Generating a Noisy Training Dataset

Per the project's staged-training plan, a second, deliberately noisy dataset was needed — seeded from real flawed examples (score below 8) as few-shot demonstrations, using the same generation templates and format as the original dataset.

| Metric | Value |
|---|---|
| Examples generated so far | ~15,000–16,000 |
| Success rate per batch | 86% |
| Duplicate sentences | 0 |
| Empty-triplet examples | 0 |

## Estimating Compute Cost

To plan the fine-tuning runs, I worked out a GPU cost estimate: one clean training run's time, multiplied by 3 for multi-seed reproducibility, plus a buffer of 5 more run-equivalents for debugging — 8x the base run time in total.

| Item | Value |
|---|---|
| One clean QLoRA run (A100-class GPU) | ~5 hours |
| Total GPU-hours needed | 40 |

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
