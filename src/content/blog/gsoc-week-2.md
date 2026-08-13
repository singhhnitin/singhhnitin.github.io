---
title: "GSoC Week 2: Researching How Much Data Fine-Tuning Actually Needs"
description: "GSoC 2026 progress update."
pubDate: 2026-06-09
---

GSoC Week 2: Researching How Much Data Fine-Tuning Actually Needs

With honest baseline numbers in hand from Week 1, this week was about planning the path forward — specifically, understanding how much training data a fine-tuning approach would realistically need, and beginning to look at tooling for the human review step planned later in the project.

Researching How Much Data Fine-Tuning Actually Needs

Before committing to a data generation plan, I looked into what the research literature says about data requirements for LoRA/QLoRA fine-tuning specifically — since full fine-tuning of a multi-billion-parameter model on this scale of data isn't feasible, and adapter-based fine-tuning has very different data needs.

For a narrow, well-defined structured extraction task like Hindi triple extraction with a consistent output format, the general pattern is:

Dataset size	What it achieves
100–500 examples	Model learns the output format; limited task knowledge
500–2,000 examples	Strong performance on narrow, consistent tasks
2,000–5,000 examples	Good generalization across diverse sentence constructions
5,000–20,000 examples	Diminishing returns for narrow tasks; quality matters more than quantity

This pointed toward a practical target in the 2,000–5,000 high-quality (sentence → triple) pair range as a reasonable starting point, with the understanding that a mixed dataset — filtered synthetic data plus genuine gold examples — would likely outperform either source alone.

Annotation Tooling

I also began researching annotation interfaces used by open-source organizations for exactly this kind of human-in-the-loop correction task, with Argilla — a platform purpose-built for collecting human feedback on model outputs — emerging as an early strong candidate for the review step planned later in the project.

Planning the Path Forward

With the data-scale research done, the plan going into the next phase was to decide how to handle the existing ~20K synthetic dataset: use it as-is, re-score it with a newer judge model before training, or augment it with genuine BenchIE gold examples. The direction settled on was a combination of re-scoring plus augmentation — validated and refined further in the weeks that followed.
