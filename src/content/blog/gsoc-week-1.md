---
title: "Week 1 — Setting Up, Shipping Nothing, Learning Everything"
description: "First week as a GSoC 2026 contributor at DBpedia Hindi Chapter."
pubDate: "May 24 2026"
tags: ["gsoc", "dbpedia", "hindi-nlp", "open-source"]
layout: ../../layouts/post.astro
---

I got selected for GSoC 2026 with DBpedia Hindi Chapter. I've known about GSoC since 2020 — I was in 10th grade, had no idea how to code properly, and stumbled across it while looking up how people contributed to open source. It went into a mental folder labelled *someday*. This week, someday showed up.

## What I'm working on

The project is about extracting structured knowledge from Hindi Wikipedia — specifically relational triples in the format (Subject, Predicate, Object) — and linking them to the DBpedia ontology. The short version of why this matters: there is a massive amount of relational knowledge sitting inside Hindi Wikipedia articles that is completely unstructured. Nobody has mapped it. And most people working in NLP in India end up working on English or other foreign language benchmarks because that's where the data and tooling exists. Hindi, despite being spoken by over 600 million people, gets left behind. That gap is real and it's what this project is trying to close.

## What actually happened this week

Honestly, week 1 was less about writing code and more about understanding what already exists. The GSoC 2024 and 2025 contributors before me built a hybrid pipeline — rule-based extraction with IndIE combined with a small language model — and left behind a codebase, a paper, and a set of open problems. My job is to continue from there.

I set up this blog. I started going through the existing pipeline code. I ran into more errors than I expected just getting the environment working. And I read through the position paper my mentor shared, which gave me a much clearer picture of what was accomplished and what wasn't.

The thing that surprised me most about Hindi NLP is how vast and how underexplored it is at the same time. The linguistic challenges are genuinely hard — free word order, postpositions, pro-drop behaviour, verb-final syntax — and the tooling that exists for English just doesn't transfer cleanly. But very few people from our own country are working on it seriously. That's strange and also kind of motivating.

## What's next

Week 2 is about running the existing pipeline on the full Hindi BenchIE sample, reproducing the baselines from the paper, and setting up the evaluation scripts. The goal is to have a clean ablation table by end of week — IndIE alone vs zero-shot model vs the hybrid — so I know exactly what I'm improving on.

More next week.
