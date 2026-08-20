---
title: "GSoC Week 5: Choosing an Embedding Model and Building BenchIE Ground Truth"
description: "Testing embedding models at full ontology scale and building real DBpedia ground truth for BenchIE."
pubDate: 2026-06-30
tags: []
---

This is the fifth week of the coding period of GSoC where the main aim was to test embedding models against the full DBpedia ontology, build a DBpedia property mapping for the BenchIE benchmark, and start scraping real Hindi Wikipedia sentences.

## Testing at Real Scale

Earlier testing showed MiniLM performing well against a curated set of 73 properties with rich bilingual descriptions. Real DBpedia property labels are far sparser, often just a single English word with no Hindi anchor. This week I tested against the real ontology of 2,710 properties directly, rather than assuming the earlier result would carry over.

Using Recall@15 as the metric, three models were compared on 7 predicates with independently verified correct answers, against the full 2,710-property ontology:

| Model | Recall@15 | Avg. rank of correct answer | Speed |
|---|---|---|---|
| MiniLM (baseline) | 71.4% | 9.0 | ~1 second |
| F2LLM-1.7B | 100% | 3.7 | ~2–3 seconds |
| F2LLM-8B | 100% | 3.6 | ~51 seconds |

F2LLM-1.7B and F2LLM-8B both reached perfect recall, with F2LLM-8B only marginally improving the average rank while taking roughly 20 times longer and needing double the storage. F2LLM-1.7B became the model used for the rest of the project's ontology alignment work — F2LLM-8B was later reused specifically for the one-time gold-set retrieval step in Week 8, where its slower speed mattered less.

## Building DBpedia Ground Truth for BenchIE

BenchIE is an existing, independently human-annotated benchmark of 112 Hindi sentences with gold subject-relation-object spans, but it had never been connected to DBpedia's ontology. I built that connection this week — for each gold triple, the relation was encoded and compared against all 2,710 DBpedia properties, the top 10 candidates retrieved, and an LLM made the final call using full sentence context, or returned NONE when no property fit.

| Result | Count | Share |
|---|---|---|
| Labeled with a real DBpedia property | 73 | 52.5% |
| Correctly returned NONE | 66 | 47.5% |

*(Note: these two counts add to 139, not the 112 )*

## Scraping Real Hindi Wikipedia Sentences

To reduce reliance on purely synthetic sentences, I built a scraper pulling real article text from Hindi Wikipedia's public API, filtering to sentences in the same 10–23 word range BenchIE itself uses.

| Metric | Value |
|---|---|
| Sentences scraped | 16,040 |
| Articles covered | 2,040 |
| Usable sentences after cleaning | 14,370 |

Annotation of these sentences began this week and was well underway by week's end.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
