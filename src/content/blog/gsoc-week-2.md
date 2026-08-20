---
title: "Week-2 Researching How Much Data Fine-Tuning Actually Needs"
description: "Second week of the coding period, researching data requirements for fine-tuning and looking into annotation tooling."
pubDate: 2026-06-09
tags: []
---

# Week-2 Researching How Much Data Fine-Tuning Actually Needs

This is the second week of the coding period of GSoC where the main aim was to figure out how much training data a fine-tuning approach would actually need, and start looking at tooling for the human review step planned later in the project.

## Data Requirements for Fine-Tuning

Before committing to a data generation plan, I looked into what the research literature says about data requirements for LoRA/QLoRA fine-tuning specifically, since full fine-tuning of a multi-billion-parameter model on this scale of data isn't feasible, and adapter-based fine-tuning has very different data needs.

For a narrow, well-defined structured extraction task like Hindi triple extraction with a consistent output format, the general pattern is:

| Dataset size | What it achieves |
|---|---|
| 100–500 examples | Model learns the output format; limited task knowledge |
| 500–2,000 examples | Strong performance on narrow, consistent tasks |
| 2,000–5,000 examples | Good generalization across diverse sentence constructions |
| 5,000–20,000 examples | Diminishing returns for narrow tasks; quality matters more than quantity |

This pointed toward a practical target in the 2,000–5,000 high-quality (sentence → triple) pair range as a reasonable starting point, with a mixed dataset of filtered synthetic data plus genuine gold examples likely outperforming either source alone.

## Annotation Tooling

I also began researching annotation interfaces used by open-source organizations for this kind of human-in-the-loop correction task, with Argilla — a platform built for collecting human feedback on model outputs — coming up as an early strong candidate for the review step planned later in the project.

## Planning the Path Forward

With the data-scale research done, the plan going into the next phase was to decide how to handle the existing ~20K synthetic dataset: use it as-is, re-score it with a newer judge model before training, or augment it with genuine BenchIE gold examples. The direction settled on was a combination of re-scoring plus augmentation, validated and refined further in the weeks that followed.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
