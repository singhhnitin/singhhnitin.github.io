---
title: "GSoC Week 4: Recalibrating the Scoring Judge and Resolving Pronoun Ambiguity"
description: "Recalibrating a biased scoring judge, resolving pronoun ambiguity in extracted data, and building a clean dataset for fine-tuning."
pubDate: 2026-06-23T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "dataset"]
---

The task this week was to take real Hindi sentences from Wikipedia and prepare them for training a model to extract the core facts inside them — who did what, to whom, and how.

## The scoring judge had a bias

While reviewing scoring results, I noticed something inconsistent: sentences taken directly from Wikipedia were consistently scoring worse than artificially generated ones, even in cases where the Wikipedia sentences were equally or more accurate.

The cause turned out to be the judge model used to grade quality. Wikipedia sentences tend to include descriptive detail — phrases like "the ancient temple" or "the newly built stadium" — and the scoring judge was treating that descriptive richness as a flaw rather than normal writing. After recalibrating the judge with a small set of carefully chosen reference examples, the pass rate for genuinely good sentences went from under 10% to nearly 70%.

## Resolving pronoun ambiguity

The next issue was pronouns. A sentence like "He went to the market" is only useful if it's clear who "he" refers to. I categorized pronoun cases into three types: pronouns that could be traced back to a specific name mentioned elsewhere in the text, pronouns that were self-contained and didn't need a name to make sense (such as "this city"), and pronouns with no way to determine what they referred to.

Sorting these into categories rather than discarding all pronoun-containing sentences by default recovered a meaningful amount of usable data.

## Where things stand

By the end of the week, the dataset was clean and organized, with the scoring judge recalibrated and the pronoun cases sorted. This dataset is what Week 3's audit numbers are based on.
