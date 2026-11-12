# Research additions, November 4, 2026

This bounded catalog update checked recent Bangla NLP work against the existing
published papers and discovery inbox. Primary landing-page abstracts and
publisher BibTeX exports supplied the title, authors, year, and publication
identity. Task placement is editorial classification based on the abstract;
full papers and benchmark results were not audited. No scores were added.

| Primary record | Catalog task | Evidence for placement and publication identity |
| --- | --- | --- |
| [5-Dialects-BN](https://arxiv.org/abs/2609.09964), [BibTeX](https://arxiv.org/bibtex/2609.09964) | `mt` | Aligned regional dialect, Standard Bangla, English, and Romanized text supports translation and normalization. Stored as arXiv; the author's conference-acceptance comment does not establish a proceedings record. |
| [Lipi-Ghor](https://aclanthology.org/2026.salma-1.13/), [BibTeX](https://aclanthology.org/2026.salma-1.13.bib) | `speech` | Bengali speech corpus and ASR evaluation. The published SALMA record replaces the discovered arXiv candidate `2610.36184` as the canonical source. |
| [A Benchmark for Bangla Task-Oriented Dialogue Understanding](https://arxiv.org/abs/2610.18060), [BibTeX](https://arxiv.org/bibtex/2610.18060) | `dialogue` | Multi-turn task-oriented dialogues with intent, slot, and state annotations. Stored as arXiv, not as an accepted NAACL paper. |
| [Bangla Sentence Function Classification](https://arxiv.org/abs/2609.13869), [BibTeX](https://arxiv.org/bibtex/2609.13869) | `textcls` | Classification of declarative, interrogative, imperative, and exclamatory sentences. Stored as arXiv; no independently verified publisher record was found. |
| [BanglaRhet](https://arxiv.org/abs/2610.09464), [BibTeX](https://arxiv.org/bibtex/2610.09464) | `textcls` | Rhetorical and persuasion technique classification in political speech. Stored as arXiv; the conference label in the comment was not promoted to verified publication metadata. |
| [Polite on the Surface, Broken in Practice](https://aclanthology.org/2026.groundlm-1.56/), [BibTeX](https://aclanthology.org/2026.groundlm-1.56.bib) | `llm` | Instruction tuning and evaluation of Bangla generation and register alignment. GroundLM is the published source; the queued arXiv version `2605.22487` was removed. |
| [Khondo](https://arxiv.org/abs/2607.21780), [BibTeX](https://arxiv.org/bibtex/2607.21780) | `llm` | Multimodal language-model evaluation on document packet splitting and page ordering. Its queued arXiv record was removed after publication in the catalog. |

Checks covered canonical URLs, normalized titles, and named-system prefixes to
avoid duplicating existing papers. The inbox candidate `arxiv2605.22487`,
"Polite on the Surface, Broken in Practice: A Curated Dataset for Fixing Generation and Register Failures in Low-Resource Bangla Text Generation",
was removed after promotion to the canonical ACL record `2026.groundlm-1.56`.
The inbox candidate `arxiv2607.21780` was removed after promotion to the same
arXiv Khondo entry in the published catalog. All other queued candidates were
preserved byte for byte.
The paper catalog contains 821 entries after these additions.

Discovery used Bangla/Bengali title and abstract queries and exact-title searches
for publication identity, including `"Lipi-Ghor" site:aclanthology.org` and
`"5-Dialects-BN" site:aclanthology.org`. Firecrawl's web quota was exhausted;
paper-index discovery and direct arXiv/ACL records remained available. This is
not an exhaustive literature search or a claim that every missing paper is now
cataloged.
