---
title: "GSoC Week 5: Choosing an Embedding Model and Building BenchIE Ground Truth"
description: "GSoC 2026 progress update."
pubDate: 2026-06-30
---

GSoC Week 5: Choosing an Embedding Model at Real Scale, and Building BenchIE's DBpedia Ground Truth

This week moved from testing embedding models against a small curated property list to testing them against the real, full DBpedia ontology — and used that model to build something the project genuinely needed: a DBpedia property mapping for the BenchIE benchmark, which had none.

Why the Earlier Result Doesn't Fully Carry Over

Earlier testing showed the existing embedding model performing very well against a hand-curated set of 73 properties, each with rich, manually-written bilingual descriptions. Real DBpedia property labels are far sparser — often just a single English word, with no Hindi anchor at all. Testing against the real ontology of 2,710 properties, using their real, sparse labels, is a genuinely different and harder test. The honest conclusion: strong performance on a curated set doesn't automatically predict performance on the real thing, and it needed to be tested directly rather than assumed.

Three-Way Comparison at Real Scale

Using Recall@15 as the metric — does the correct property appear anywhere in the top 15 retrieved candidates, since a later disambiguation step only ever sees those 15 — three models were compared on 7 predicates with independently verified correct answers, against the full 2,710-property ontology:

Model	Recall@15	Avg. rank of correct answer	Speed
Existing model (baseline)	71.4%	9.0	~1 second
Candidate model A	100%	3.7	~2–3 seconds
Candidate model B	100%	3.6	~51 seconds

Two candidates reached perfect recall at this scale, with the larger of the two only marginally improving the average rank while taking roughly 20 times longer and needing double the storage. Given the pipeline needs to process well over ten thousand sentences, the faster of the two equally-accurate models was the clear practical choice, and became the model used for the rest of the project's ontology alignment work.

Understanding cosine similarity, in plain terms: every Hindi predicate and every DBpedia property gets converted into a long list of numbers (a vector) that captures its meaning. Two vectors pointing in a similar direction represent similar meanings; cosine similarity measures that angle. Normalizing every vector to the same length means the comparison is purely about meaning, not phrase length — a short property label competes fairly against a longer one. A small number of generic-sounding properties tended to score deceptively high against almost any query, simply because they sit near the "center" of the embedding space — which is exactly why the next stage, an LLM reading full sentence context, exists: to reject a generically-plausible-looking match when the actual sentence clearly isn't about that.

Building Real DBpedia Ground Truth for BenchIE

BenchIE is an existing, independently human-annotated benchmark of 112 Hindi sentences with gold subject-relation-object spans — but it had never been connected to DBpedia's ontology. I built that connection this week.

Process: for each of the 112 gold triples, the relation was encoded and compared against all 2,710 real DBpedia properties, the top 10 candidates were retrieved, and an LLM made the final call — selecting the correct property using full sentence context, or returning NONE when no real DBpedia property fits.

Real examples from this pass: a philosophical, abstract sentence about illusion and perception correctly returned NONE, since no DBpedia property captures that kind of metaphysical relationship. A sentence about someone receiving the Padma Bhushan award correctly resolved to the "award" property specifically, correctly distinguished from a more generic "winner" property. A sentence about someone's cause of death correctly resolved to "death cause" rather than "death place," based on the object clearly describing a cause rather than a location.

Final numbers: of 112 sentences, 73 (52.5%) were labeled with a real DBpedia property, and 66 (47.5%) correctly returned NONE. This NONE rate is a genuine, honest finding about the nature of the benchmark, not a shortcoming in the mapping work — BenchIE deliberately includes abstract descriptions, philosophical statements, and procedural instructions, and none of these naturally have a DBpedia property to map to.

Scraping Real Hindi Wikipedia Sentences

To reduce the project's reliance on purely synthetic sentences, I built a scraper pulling real article text from Hindi Wikipedia via its public API, filtering to sentences in the same 10–23 word range that BenchIE itself uses, to keep the training distribution realistic.

Result: 16,040 sentences scraped from 2,040 articles, cleaned down to 14,370 usable sentences after removing section headers, table markup, and non-Hindi fragments. Annotation of these sentences — extracting triples and a full reasoning trace for each, using the same process and format as the original dataset — began this week and was already a substantial way through the full set by week's end.
