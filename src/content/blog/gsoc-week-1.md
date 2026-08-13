---
title: "GSoC Week 1: Establishing Baselines for Hindi Triple Extraction"
description: "GSoC 2026 progress update."
pubDate: 2026-06-02
tags: []
---

GSoC Week 1: Establishing Baselines for Hindi Triple Extraction
Where This Picks Up

The project builds on a strong foundation from previous years of work on the DBpedia Hindi Chapter. My first task was to establish honest, reproducible baseline numbers before writing any new model code — so that everything built afterward has something real to be measured against.

Baseline Evaluation on Hindi-BenchIE

The base cases were established through a full evaluation on the Hindi-BenchIE dataset (112 sentences), reusing the existing comparison tooling from prior work so the numbers stay directly comparable across years.

Key finding: argument span errors came out to 0% across every system tested — subjects and objects are being extracted correctly everywhere. The predicate is the sole failure mode in every case. This is a useful, clarifying result: it means the real challenge is relation identification, not entity boundary detection.

A new error type not covered in the original proposal was also identified during this pass: cases where a rule-based system's logic cannot determine a relation and outputs the literal placeholder string "property" instead. This accounted for a meaningful share of failures in the older rule-based system, and a much smaller share once an LLM completion step was added on top — a useful early signal that LLM-based completion genuinely helps close this gap, and a thread worth investigating further as the project continues.
