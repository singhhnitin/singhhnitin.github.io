---
title: "GSoC Week 5: Debugging the Fine-Tuning Pipeline and Launching the First Training Run"
description: "Smoke test failures, a crash inside the model's own generation code, and finally launching the real training run."
pubDate: 2026-06-30T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "fine-tuning"]
---

This week was spent getting the fine-tuning pipeline to actually run, before the real training could start.

## Smoke test failures

I ran a smoke test — a small practice run meant to confirm the setup works before committing to the full training run. It surfaced several problems in sequence: an outdated environment that couldn't load the model, a dataset where inconsistent formatting across different parts confused the loading step, and a bug in the model's own generation code that caused a crash whenever it tried to generate a full answer in one pass.

The generation crash took the most work to resolve. I wrote custom generation logic that produces the answer one token at a time instead of all at once, checking after each token rather than generating the full response in a single call. That avoided the crash, at the cost of being slower.

## Adjusting the training scope

Based on feedback from a mentor sync, the plan changed from training on the full dataset immediately to starting with a smaller, cleaner subset first, to establish a working baseline before scaling up. Filtering the dataset down to that clean subset also showed that every example in it was already short enough that no additional length filtering was needed, and reducing the model's context window to match sped up training as a side effect.

## Launching the training run

With the pipeline fixed and the training scope adjusted, the first full training run started by the end of the week and completed without the earlier crashes.
