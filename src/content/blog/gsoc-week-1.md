---
title: "Week-1 Understanding the Pipeline and Prior Work"
description: "First week of the coding period, understanding the existing DBpedia Hindi Chapter pipeline and prior GSoC work."
pubDate: 2026-06-02
tags: []
---

# Week-1 Understanding the Pipeline and Prior Work

This is the first week of the coding period of GSoC where the main aim was to understand the current DBpedia Hindi Chapter pipeline[^2] and the work done in the previous two GSoC editions.

## The DBpedia Hindi Chapter Project

The DBpedia Hindi Chapter project extracts structured facts from Hindi Wikipedia and builds them into a knowledge graph that others can query. The pipeline includes a rule-based extraction tool, IndIE, along with a set of DBpedia ontology mappings specific to Hindi.

This week, my primary focus was to go through the project's history from the previous two GSoC cycles, understand how the extraction pipeline works, and see where things currently stand. I went through both prior mentors' blogs from their own GSoC years — [Debarghya's 2024 blog](https://deba-iitbh.github.io/deba-gsoc24) and [Aditya's 2025 blog](https://advenk.github.io/av-blog) — to understand the project's progress week by week. My mentors provided guidance on where to start and what to focus on first.

## Hindi-BenchIE and IndIE

Hindi-BenchIE is the benchmark dataset used to evaluate Hindi information extraction systems, with 112 gold-annotated sentences. IndIE is the existing rule-based tool built for this task, using a chunking and dependency-tree based approach to extract triples.

I ran a full evaluation on Hindi-BenchIE using the existing comparison tooling from prior work, so the numbers stay comparable across years. Subject and object extraction came out fully correct across the board, with every failure coming specifically from the relation. I also noticed the tool sometimes outputs the placeholder word "property" when it cannot determine a relation, which I kept a note of for later weeks.

## Learnings from the Paper

To build a proper understanding, I read the paper describing the project's work across both prior GSoC editions[^1]. It gave a detailed account of how the pipeline evolved, from the initial extraction framework work in 2024 to the language-model based extraction and predicate-linking work in 2025.

In summary, the first week of my GSoC journey has been about understanding the existing pipeline and getting my own baseline numbers in place. With this foundation, I am ready to start on the specific tasks for the coming weeks.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
