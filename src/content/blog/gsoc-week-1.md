---
title: "GSoC Week 1: Understanding the Project and the Existing Hindi Extraction Systems"
description: "What the DBpedia Hindi extraction gap actually is, and getting familiar with the systems already in place before building anything new."
pubDate: 2026-06-02T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp"]
---

This is the first post for my GSoC 2026 project with the DBpedia Hindi Chapter. Before getting into the work itself, a bit of background on what this project is and why it exists, since most of that context isn't obvious unless you've worked with DBpedia before.

## What DBpedia is doing here

DBpedia takes Wikipedia and turns it into structured data: instead of a page of prose about a city or a person, you get a set of facts a machine can query directly — population, founding date, related entities, and so on. Most of that structured extraction for English Wikipedia is mature at this point. Hindi Wikipedia is a different story. Hindi is spoken by hundreds of millions of people, but the Hindi DBpedia Knowledge Graph is still thin compared to what's actually written on Hindi Wikipedia, mainly because most extraction techniques were built around infoboxes and structured markup, and a lot of the useful information in Hindi articles is just written as plain sentences, not neatly boxed up.

That's the gap this project is trying to close: pulling structured triples — subject, predicate, object, like (Delhi, capitalOf, India) — out of raw Hindi sentences, well enough that they're accurate enough to go straight into the knowledge graph. Over the summer that means fine-tuning small language models specifically for this extraction task, and later building a human-in-the-loop review interface, so that when someone corrects a wrong extraction, that correction becomes training data for the next round instead of a one-off fix. The interface is a later-summer problem.

## Getting familiar with the existing systems

Before building anything, the first task was understanding what already exists for this problem, since two systems were already in place.

**IndIE** is a rule-based Hindi information extraction system — it applies a fixed set of linguistic rules to a Hindi sentence and outputs subject-predicate-object triples based on pattern matching, with no learned model involved.

**GSoC25_H** is a hybrid pipeline built during last year's GSoC project. It runs IndIE first, then adds a second step where an LLM (Gemma-3-12B, using ReAct-style prompting) reviews and refines IndIE's output.

**Hindi-BenchIE** is the benchmark used to evaluate both: 112 hand-annotated Hindi sentences, each with gold-standard triples attached, which is the closest thing this task has to a standard evaluation set.

Understanding how these three pieces fit together — what IndIE does on its own, what the LLM step adds on top, and what Hindi-BenchIE actually measures — was necessary before deciding anything about what to build next. The plan for the following week was to actually run these systems against the benchmark and get real numbers rather than working from assumptions about where they stand.

## What's next

Week 2 covers running IndIE and GSoC25_H against the full Hindi-BenchIE benchmark, breaking down exactly where their errors come from, and a data-sizing exercise for the fine-tuning work ahead.
