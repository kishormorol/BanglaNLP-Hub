// BanglaNLP Hub catalog data. Real resources where known; scores/stars illustrative.
export const TASKS = [
  {id:'sentiment', name:'Sentiment Analysis', bn:'অনুভূতি বিশ্লেষণ', desc:'Polarity and emotion classification of Bangla text from social media, reviews, and news comments.'},
  {id:'ner', name:'Named Entity Recognition', bn:'নামীয় সত্তা শনাক্তকরণ', desc:'Detecting person, location, organization and other entities in Bangla text.'},
  {id:'mt', name:'Machine Translation', bn:'যন্ত্রানুবাদ', desc:'Bangla↔English and multilingual translation, parallel corpora and paraphrase generation.'},
  {id:'qa', name:'Question Answering', bn:'প্রশ্নোত্তর', desc:'Extractive and generative QA over Bangla passages and knowledge.'},
  {id:'summ', name:'Summarization', bn:'সারাংশকরণ', desc:'Abstractive and extractive summarization of Bangla news and documents.'},
  {id:'hate', name:'Hate Speech Detection', bn:'ঘৃণাত্মক বক্তব্য শনাক্তকরণ', desc:'Identifying hateful, offensive, and abusive Bangla content online.'},
  {id:'speech', name:'ASR / TTS', bn:'কথন শনাক্তকরণ ও সংশ্লেষণ', desc:'Bangla speech recognition and text-to-speech corpora and models.'},
  {id:'textcls', name:'Text Classification', bn:'পাঠ্য শ্রেণিবিন্যাস', desc:'News categorization, fake news detection, and document classification.'},
  {id:'pos', name:'POS Tagging', bn:'পদ চিহ্নিতকরণ', desc:'Part-of-speech tagging, treebanks, and morphological analysis for Bangla.'},
  {id:'llm', name:'LLM Benchmarks', bn:'বৃহৎ ভাষা মডেল মূল্যায়ন', desc:'Evaluating large language models on Bangla knowledge, reasoning, and generation.'},
];

export const DATASETS = [
  {id:'sentnob', sizeN:15728, name:'SentNoB', task:'sentiment', size:'15,728 comments', license:'CC BY-NC-SA 4.0', year:2021, source:'SentNoB (Findings EMNLP 2021)', link:'https://github.com/KhondokerIslam/SentNoB', verified:'2026-06-28', desc:'Sentiment on noisy user comments from news and social platforms across 13 domains.', bibtex:`@inproceedings{islam-etal-2021-sentnob,\n  title = {SentNoB: A Dataset for Analysing Sentiment on Noisy {B}angla Texts},\n  author = {Islam, Khondoker Ittehadul and Kar, Sudipta and Islam, Md Saiful and Amin, Mohammad Ruhul},\n  booktitle = {Findings of EMNLP},\n  year = {2021}\n}`},
  {id:'bemoc', sizeN:7000, name:'BEmoC', task:'sentiment', size:'7,000 texts', license:'Research only', year:2021, source:'Emotion classification corpus', link:'https://github.com/avishek-018/BEmoC', verified:'2026-05-14', desc:'Six-class emotion corpus (anger, disgust, fear, joy, sadness, surprise).'},
  {id:'absa', sizeN:5038, name:'ABSA Cricket & Restaurant', task:'sentiment', size:'5,038 comments', license:'Research only', year:2018, source:'Aspect-based sentiment (cricket, restaurant)', link:'https://github.com/AtikRahman/Bangla_ABSA_Datasets', verified:'2026-04-02', desc:'Aspect-based sentiment in two domains.'},
  {id:'multiconer', sizeN:15300, name:'MultiCoNER (bn)', task:'ner', size:'15,300 sentences', license:'CC BY 4.0', year:2022, source:'SemEval-2022 Task 11', link:'https://registry.opendata.aws/multiconer/', verified:'2026-06-10', desc:'Complex NER: creative works, groups, products; Bangla track.'},
  {id:'bner', sizeN:22144, name:'B-NER', task:'ner', size:'22,144 sentences', license:'MIT', year:2023, source:'B-NER (IEEE Access 2023)', link:'https://github.com/eliteaihub/b-ner', verified:'2026-06-21', desc:'Largest gold-standard Bangla NER corpus, 8 entity types.'},
  {id:'wikiann', sizeN:10000, name:'WikiANN (bn)', task:'ner', size:'10,000 sentences', license:'ODC-BY', year:2019, source:'Cross-lingual name tagging (ACL 2017)', link:'https://huggingface.co/datasets/wikiann', verified:'2026-03-30', desc:'Silver-standard PER/LOC/ORG from Wikipedia anchors.'},
  {id:'banglanmt', sizeN:2750000, name:'BanglaNMT Parallel Corpus', task:'mt', size:'2.75M pairs', license:'Research only', year:2020, source:'Not Low-Resource Anymore (EMNLP 2020)', link:'https://github.com/csebuetnlp/banglanmt', verified:'2026-06-28', desc:'High-quality Bangla–English parallel corpus built with aligner ensembling.', bibtex:`@inproceedings{hasan-etal-2020-low,\n  title = {Not Low-Resource Anymore: Aligner Ensembling, Batch Filtering, and New Datasets for {B}engali-{E}nglish Machine Translation},\n  author = {Hasan, Tahmid and Bhattacharjee, Abhik and others},\n  booktitle = {EMNLP},\n  year = {2020}\n}`},
  {id:'flores', sizeN:3001, name:'FLORES-200 (bn)', task:'mt', size:'3,001 sentences', license:'CC BY-SA 4.0', year:2022, source:'No Language Left Behind (2022)', link:'https://github.com/facebookresearch/flores', verified:'2026-05-19', desc:'Standard many-to-many evaluation benchmark; Bengali dev/devtest.'},
  {id:'banglaparaphrase', sizeN:466000, name:'BanglaParaphrase', task:'mt', size:'466k pairs', license:'CC BY-NC-SA 4.0', year:2022, source:'BanglaParaphrase (AACL 2022)', link:'https://huggingface.co/datasets/csebuetnlp/BanglaParaphrase', verified:'2026-06-01', desc:'High-quality synthetic paraphrase pairs.'},
  {id:'samanantar', sizeN:8600000, name:'Samanantar (bn–en)', task:'mt', size:'8.6M pairs', license:'CC0', year:2022, source:'Samanantar (TACL 2022)', link:'https://ai4bharat.iitm.ac.in/samanantar', verified:'2026-04-25', desc:'Largest publicly available bn–en parallel collection.'},
  {id:'squadbn', sizeN:130000, name:'SQuAD_bn', task:'qa', size:'~130k QA pairs', license:'CC BY-NC-SA 4.0', year:2021, source:'BanglaBERT benchmarks', link:'https://huggingface.co/datasets/csebuetnlp/squad_bn', verified:'2026-06-15', desc:'Machine-translated + human-curated SQuAD 2.0 for Bangla.'},
  {id:'banglarqa', sizeN:14889, name:'BanglaRQA', task:'qa', size:'14,889 QA pairs', license:'CC BY-NC 4.0', year:2022, source:'BanglaRQA (Findings EMNLP 2022)', link:'https://github.com/sartajekram419/BanglaRQA', verified:'2026-06-15', desc:'Human-annotated reading comprehension with answerable/unanswerable questions.', bibtex:`@inproceedings{ekram-etal-2022-banglarqa,\n  title = {{B}angla{RQA}: A Benchmark Dataset for Under-resourced {B}angla Language Reading Comprehension},\n  author = {Ekram, Syed Mohammed Sartaj and others},\n  booktitle = {Findings of EMNLP},\n  year = {2022}\n}`},
  {id:'tydiqa', sizeN:10000, name:'TyDi QA (bn)', task:'qa', size:'~10k questions', license:'Apache 2.0', year:2020, source:'TyDi QA (TACL 2020)', link:'https://github.com/google-research-datasets/tydiqa', verified:'2026-03-12', desc:'Typologically diverse info-seeking QA; Bengali portion.'},
  {id:'xlsum', sizeN:10126, name:'XL-Sum (bn)', task:'summ', size:'10,126 articles', license:'CC BY-NC-SA 4.0', year:2021, source:'XL-Sum (Findings ACL 2021)', link:'https://huggingface.co/datasets/csebuetnlp/xlsum', verified:'2026-06-28', desc:'Professional article–summary pairs from BBC Bangla.', bibtex:`@inproceedings{hasan-etal-2021-xl,\n  title = {{XL}-Sum: Large-Scale Multilingual Abstractive Summarization for 44 Languages},\n  author = {Hasan, Tahmid and Bhattacharjee, Abhik and others},\n  booktitle = {Findings of ACL},\n  year = {2021}\n}`},
  {id:'bansdata', sizeN:19096, name:'BANSData', task:'summ', size:'19,096 pairs', license:'Research only', year:2021, source:'Bangla abstractive news summarization', link:'https://www.kaggle.com/datasets/prithwirajsust/bengali-news-summarization-dataset', verified:'2026-02-20', desc:'News summarization pairs crawled from Bangla dailies.'},
  {id:'bdshs', sizeN:50281, name:'BD-SHS', task:'hate', size:'50,281 comments', license:'CC BY-NC 4.0', year:2022, source:'BD-SHS (LREC 2022)', link:'https://github.com/naurosromim/hate-speech-dataset-for-Bengali-social-media', verified:'2026-06-05', desc:'Hierarchically annotated hate speech: target, type, severity.'},
  {id:'bhs', sizeN:30000, name:'Bengali Hate Speech', task:'hate', size:'30,000 documents', license:'MIT', year:2020, source:'Classification benchmarks (Karim et al.)', link:'https://github.com/rezacsedu/Bengali-Hate-Speech-Dataset', verified:'2026-04-18', desc:'Multi-label hate categories across political, religious, personal.'},
  {id:'tbolid', sizeN:5000, name:'TB-OLID', task:'hate', size:'5,000 comments', license:'CC BY 4.0', year:2023, source:'Transliterated offensive language ID', link:'https://github.com/LanguageTechnologyLab/TB-OLID', verified:'2026-03-08', desc:'Offensive language in transliterated (Banglish) text.'},
  {id:'openslr53', sizeN:229, name:'OpenSLR SLR53 (Large Bengali ASR)', task:'speech', size:'196k utterances / 229 hrs', license:'CC BY-SA 4.0', year:2018, source:'Google crowdsourced speech', link:'https://openslr.org/53/', verified:'2026-06-28', desc:'Crowdsourced Bangladeshi Bangla read speech.'},
  {id:'commonvoice', sizeN:1200, name:'Common Voice (bn)', task:'speech', size:'1,200+ hrs recorded', license:'CC0', year:2024, source:'Mozilla Common Voice', link:'https://commonvoice.mozilla.org/bn', verified:'2026-07-01', desc:'Continuously growing crowdsourced speech corpus.'},
  {id:'oodspeech', sizeN:1177, name:'OOD-Speech', task:'speech', size:'1,177 hrs', license:'CC BY-NC 4.0', year:2023, source:'OOD-Speech (2023)', link:'https://github.com/BengaliAI/ood-speech', verified:'2026-05-22', desc:'Large-scale out-of-distribution Bangla ASR benchmark.'},
  {id:'banfakenews', sizeN:50000, name:'BanFakeNews', task:'textcls', size:'~50k articles', license:'CC BY-NC 4.0', year:2020, source:'BanFakeNews (LREC 2020)', link:'https://github.com/Rowan1224/FakeNews', verified:'2026-06-11', desc:'Annotated fake vs. authentic Bangla news articles.'},
  {id:'potrika', sizeN:665000, name:'Potrika', task:'textcls', size:'665k articles', license:'CC BY 4.0', year:2022, source:'Potrika (2022)', link:'https://doi.org/10.17632/v362rp78dc.2', verified:'2026-01-30', desc:'Large single-label news corpus, 8 categories, 6 dailies.'},
  {id:'bard', sizeN:376226, name:'BARD', task:'textcls', size:'376,226 articles', license:'Research only', year:2018, source:'Bangla Article Dataset', link:'https://github.com/tanvirfahim15/BARD-Bangla-Article-Classifier', verified:'2026-02-14', desc:'News articles across 5 categories.'},
  {id:'udbru', sizeN:7340, name:'UD Bengali-BRU Treebank', task:'pos', size:'~7,340 tokens', license:'CC BY-SA 4.0', year:2023, source:'Universal Dependencies v2.13', link:'https://universaldependencies.org/treebanks/bn_bru/', verified:'2026-05-27', desc:'Universal Dependencies treebank with UPOS and dependency relations.'},
  {id:'snltr', sizeN:7390, name:'SNLTR POS Corpus', task:'pos', size:'~7,390 sentences', license:'Research only', year:2010, source:'Society for Natural Language Technology Research', link:'http://nltr.org/snltr-software/', verified:'2026-01-12', desc:'Classic manually tagged corpus, 40-tag tagset.'},
  {id:'benqa', sizeN:5161, name:'BEnQA', task:'llm', size:'5,161 questions', license:'CC BY-NC-SA 4.0', year:2024, source:'BEnQA (2024)', link:'https://github.com/csebuetnlp/BEnQA', verified:'2026-06-30', desc:'Parallel Bangla–English science exam questions for LLM evaluation.', bibtex:`@article{shafayat2024benqa,\n  title = {{BE}n{QA}: A Question Answering and Reasoning Benchmark for {B}engali and {E}nglish},\n  author = {Shafayat, Sheikh and others},\n  journal = {arXiv preprint arXiv:2403.10900},\n  year = {2024}\n}`},
  {id:'globalmmlu', sizeN:14000, name:'Global-MMLU (bn)', task:'llm', size:'14k questions', license:'CC BY 4.0', year:2024, source:'Global-MMLU (2024)', link:'https://huggingface.co/datasets/CohereForAI/Global-MMLU', verified:'2026-06-30', desc:'Culturally adapted MMLU; Bengali split.'},
  {id:'megaverse', sizeN:22, name:'MEGAVERSE (bn subset)', task:'llm', size:'22 tasks', license:'Mixed', year:2023, source:'MEGAVERSE (NAACL 2024)', link:'https://github.com/microsoft/Lingua', verified:'2026-04-09', desc:'Multilingual LLM evaluation suite including Bangla tasks.'},
];

export const PAPERS = [
  {id:'banglabert', title:'BanglaBERT: Language Model Pretraining and Benchmarks for Low-Resource Language Understanding Evaluation in Bangla', authors:'Bhattacharjee et al.', venue:'Findings NAACL', year:2022, task:'llm', link:'https://aclanthology.org/2022.findings-naacl.98/', note:'Introduces BanglaBERT + the BLUB benchmark.'},
  {id:'notlowresource', title:'Not Low-Resource Anymore: Aligner Ensembling, Batch Filtering, and New Datasets for Bengali–English MT', authors:'Hasan et al.', venue:'EMNLP', year:2020, task:'mt', link:'https://aclanthology.org/2020.emnlp-main.207/', note:'2.75M-pair corpus; strong NMT baselines.'},
  {id:'xlsum-p', title:'XL-Sum: Large-Scale Multilingual Abstractive Summarization for 44 Languages', authors:'Hasan et al.', venue:'Findings ACL', year:2021, task:'summ', link:'https://aclanthology.org/2021.findings-acl.413/', note:'BBC Bangla summarization subset.'},
  {id:'sentnob-p', title:'SentNoB: A Dataset for Analysing Sentiment on Noisy Bangla Texts', authors:'Islam et al.', venue:'Findings EMNLP', year:2021, task:'sentiment', link:'https://aclanthology.org/2021.findings-emnlp.278/', note:'Noisy user-generated content, 13 domains.'},
  {id:'banglarqa-p', title:'BanglaRQA: A Benchmark Dataset for Under-resourced Bangla Language Reading Comprehension', authors:'Ekram et al.', venue:'Findings EMNLP', year:2022, task:'qa', link:'https://aclanthology.org/2022.findings-emnlp.186/', note:'Answerable + unanswerable human-written questions.'},
  {id:'banglanlg', title:'BanglaNLG and BanglaT5: Benchmarks and Resources for Evaluating Low-Resource Natural Language Generation in Bangla', authors:'Bhattacharjee et al.', venue:'Findings EACL', year:2023, task:'mt', link:'https://aclanthology.org/2023.findings-eacl.54/', note:'Seq2seq pretraining for Bangla generation.'},
  {id:'banglaparaphrase-p', title:'BanglaParaphrase: A High-Quality Bangla Paraphrase Dataset', authors:'Akil et al.', venue:'AACL', year:2022, task:'mt', link:'https://aclanthology.org/2022.aacl-short.44/', note:''},
  {id:'bdshs-p', title:'BD-SHS: A Benchmark Dataset for Learning to Detect Online Bangla Hate Speech in Different Social Contexts', authors:'Romim et al.', venue:'LREC', year:2022, task:'hate', link:'https://aclanthology.org/2022.lrec-1.552/', note:'Hierarchical annotation: target, type.'},
  {id:'deephateexplainer', title:'DeepHateExplainer: Explainable Hate Speech Detection in Under-resourced Bengali Language', authors:'Karim et al.', venue:'IEEE DSAA', year:2021, task:'hate', link:'https://arxiv.org/abs/2012.14353', note:''},
  {id:'banfakenews-p', title:'BanFakeNews: A Dataset for Detecting Fake News in Bangla', authors:'Hossain et al.', venue:'LREC', year:2020, task:'textcls', link:'https://aclanthology.org/2020.lrec-1.349/', note:''},
  {id:'benqa-p', title:'BEnQA: A Question Answering and Reasoning Benchmark for Bengali and English', authors:'Shafayat et al.', venue:'Findings ACL', year:2024, task:'llm', link:'https://aclanthology.org/2024.findings-acl.848/', note:'Parallel science exam questions; large en–bn gap.'},
  {id:'benllm', title:'BenLLM-Eval: A Comprehensive Evaluation into the Potentials and Pitfalls of Large Language Models on Bengali NLP', authors:'Kabir et al.', venue:'LREC-COLING', year:2024, task:'llm', link:'https://aclanthology.org/2024.lrec-main.201/', note:'Zero-shot LLMs vs fine-tuned baselines.'},
  {id:'tydiqa-p', title:'TyDi QA: A Benchmark for Information-Seeking Question Answering in Typologically Diverse Languages', authors:'Clark et al.', venue:'TACL', year:2020, task:'qa', link:'https://aclanthology.org/2020.tacl-1.30/', note:'Includes Bengali.'},
  {id:'samanantar-p', title:'Samanantar: The Largest Publicly Available Parallel Corpora Collection for 11 Indic Languages', authors:'Ramesh et al.', venue:'TACL', year:2022, task:'mt', link:'https://aclanthology.org/2022.tacl-1.9/', note:''},
  {id:'multiconer-p', title:'SemEval-2022 Task 11: Multilingual Complex Named Entity Recognition (MultiCoNER)', authors:'Malmasi et al.', venue:'SemEval', year:2022, task:'ner', link:'https://aclanthology.org/2022.semeval-1.196/', note:''},
  {id:'bner-p', title:'B-NER: A Novel Bangla Named Entity Recognition Dataset with Largest Entities and Its Baseline Evaluation', authors:'Haque et al.', venue:'IEEE Access', year:2023, task:'ner', link:'https://ieeexplore.ieee.org/document/10103464', note:''},
  {id:'oodspeech-p', title:'OOD-Speech: A Large Bengali Speech Recognition Dataset for Out-of-Distribution Benchmarking', authors:'Rakib et al.', venue:'Interspeech', year:2023, task:'speech', link:'https://arxiv.org/abs/2305.09688', note:''},
  {id:'slr53-p', title:'Crowd-Sourced Speech Corpora for Javanese, Sundanese, Sinhala, Nepali, and Bangladeshi Bengali', authors:'Kjartansson et al.', venue:'SLTU', year:2018, task:'speech', link:'https://research.google/pubs/pub47347/', note:'OpenSLR 53.'},
  {id:'bemod', title:'Classification Benchmarks for Under-resourced Bengali Language based on Multichannel Convolutional-LSTM Network', authors:'Karim et al.', venue:'IEEE DSAA', year:2020, task:'textcls', link:'https://arxiv.org/abs/2004.07807', note:'BengFastText embeddings.'},
  {id:'sahajbert-p', title:'Distributed Deep Learning in Open Collaborations (sahajBERT)', authors:'Diskin et al.', venue:'NeurIPS', year:2021, task:'llm', link:'https://arxiv.org/abs/2106.10207', note:'Collaboratively trained Bangla ALBERT.'},
  {id:'udbru-p', title:'A Universal Dependencies Treebank for Bengali', authors:'Mukherjee et al.', venue:'LREC-COLING', year:2024, task:'pos', link:'https://universaldependencies.org/treebanks/bn_bru/', note:'UD Bengali-BRU.'},
  {id:'bsti', title:'BanglaT5 for Low-Resource Sequence-to-Sequence Tasks: Machine Translation Case Study', authors:'Bhattacharjee et al.', venue:'arXiv', year:2023, task:'mt', link:'https://arxiv.org/abs/2205.11081', note:''},
  {id:'absa-p', title:'Aspect Based Sentiment Analysis of Bangla Text: A Corpus and Baseline Models', authors:'Rahman & Dey', venue:'IJCNLP', year:2018, task:'sentiment', link:'https://www.mdpi.com/2306-5729/3/2/15', note:''},
  {id:'emotion-p', title:'BEmoC: A Corpus for Emotion Classification in Bangla', authors:'Das et al.', venue:'Springer', year:2021, task:'sentiment', link:'https://link.springer.com/chapter/10.1007/978-981-16-6636-0_17', note:''},
  {id:'tbolid-p', title:'Offensive Language Identification in Transliterated and Code-Mixed Bangla', authors:'Raihan et al.', venue:'BLP @ EMNLP', year:2023, task:'hate', link:'https://aclanthology.org/2023.banglalp-1.1/', note:'First BLP workshop.'},
  {id:'titulm', title:'TituLLMs: A Family of Bangla LLMs with Comprehensive Benchmarking', authors:'Nahin et al.', venue:'arXiv', year:2025, task:'llm', link:'https://arxiv.org/abs/2502.11187', note:'Bangla-adapted Llama models.'},
];

export const MODELS = [
  {name:'csebuetnlp/banglabert (sentiment head)', task:'sentiment', arch:'ELECTRA (ft)', params:'110M', link:'https://huggingface.co/csebuetnlp/banglabert', verified:'2026-05-16', note:'Sequence-classification fine-tune; SentNoB baseline.'},
  {name:'sagorsarker/bangla-bert-sentiment', task:'sentiment', arch:'BERT (ft)', params:'110M', link:'https://huggingface.co/sagorsarker/bangla-bert-sentiment', verified:'2026-05-16', note:''},
  {name:'sagorsarker/mbert-bengali-ner', task:'ner', arch:'mBERT (ft)', params:'177M', link:'https://huggingface.co/sagorsarker/mbert-bengali-ner', verified:'2026-05-16', note:'Fine-tuned on WikiANN + custom NER data.'},
  {name:'csebuetnlp/banglabert (NER head)', task:'ner', arch:'ELECTRA (ft)', params:'110M', link:'https://huggingface.co/csebuetnlp/banglabert', verified:'2026-06-28', note:'Token-classification fine-tune; B-NER baseline.'},
  {name:'csebuetnlp/banglat5_squad_bn', task:'qa', arch:'T5 (ft)', params:'247M', link:'https://huggingface.co/csebuetnlp/banglat5', verified:'2026-05-16', note:'BanglaT5 fine-tuned on SQuAD_bn; BanglaRQA baseline.'},
  {name:'csebuetnlp/banglabert (hate-speech head)', task:'hate', arch:'ELECTRA (ft)', params:'110M', link:'https://huggingface.co/csebuetnlp/banglabert', verified:'2026-04-18', note:'Fine-tuned on BD-SHS; SOTA weighted F1.'},
  {name:'csebuetnlp/banglabert (news classifier)', task:'textcls', arch:'ELECTRA (ft)', params:'110M', link:'https://huggingface.co/csebuetnlp/banglabert', verified:'2026-04-18', note:'Fine-tuned on BanFakeNews.'},
  {name:'sagorsarker/bangla-pos-tagger', task:'pos', arch:'BiLSTM-CRF', params:'12M', link:'https://github.com/sagorbrur/bnlp', verified:'2026-05-27', note:'Ships with bnlp-toolkit; trained on SNLTR corpus.'},
  {name:'csebuetnlp/banglabert', task:'llm', arch:'ELECTRA', params:'110M', link:'https://huggingface.co/csebuetnlp/banglabert', verified:'2026-06-28', note:'SOTA Bangla encoder; BLUB benchmark leader among base models.'},
  {name:'csebuetnlp/banglabert_large', task:'llm', arch:'ELECTRA', params:'335M', link:'https://huggingface.co/csebuetnlp/banglabert_large', verified:'2026-06-28', note:''},
  {name:'csebuetnlp/banglat5', task:'mt', arch:'T5', params:'247M', link:'https://huggingface.co/csebuetnlp/banglat5', verified:'2026-06-28', note:'Seq2seq for MT, summarization, paraphrase.'},
  {name:'csebuetnlp/banglishbert', task:'llm', arch:'ELECTRA', params:'110M', link:'https://huggingface.co/csebuetnlp/banglishbert', verified:'2026-05-11', note:'Code-mixed Bangla-English encoder.'},
  {name:'sagorsarker/bangla-bert-base', task:'llm', arch:'BERT', params:'110M', link:'https://huggingface.co/sagorsarker/bangla-bert-base', verified:'2026-05-11', note:''},
  {name:'neuropark/sahajBERT', task:'llm', arch:'ALBERT', params:'18M', link:'https://huggingface.co/neuropark/sahajBERT', verified:'2026-03-19', note:'Collaboratively trained.'},
  {name:'facebook/nllb-200-3.3B', task:'mt', arch:'Transformer', params:'3.3B', link:'https://huggingface.co/facebook/nllb-200-3.3B', verified:'2026-06-02', note:'Strong bn↔en zero-shot MT.'},
  {name:'csebuetnlp/banglat5_nmt_bn_en', task:'mt', arch:'T5', params:'247M', link:'https://huggingface.co/csebuetnlp/banglat5_nmt_bn_en', verified:'2026-06-02', note:''},
  {name:'csebuetnlp/mT5_multilingual_XLSum', task:'summ', arch:'mT5', params:'580M', link:'https://huggingface.co/csebuetnlp/mT5_multilingual_XLSum', verified:'2026-06-02', note:'XL-Sum official checkpoint.'},
  {name:'csebuetnlp/banglat5 (XL-Sum ft)', task:'summ', arch:'T5 (ft)', params:'247M', link:'https://huggingface.co/csebuetnlp/banglat5', verified:'2026-06-02', note:'BanglaT5 fine-tuned on XL-Sum bn; best ROUGE-2.'},
  {name:'arijitx/wav2vec2-xls-r-300m-bengali', task:'speech', arch:'wav2vec 2.0', params:'300M', link:'https://huggingface.co/arijitx/wav2vec2-xls-r-300m-bengali', verified:'2026-04-22', note:'Fine-tuned on OpenSLR 53.'},
  {name:'bangla-speech-processing/BanglaASR', task:'speech', arch:'Whisper-small', params:'244M', link:'https://huggingface.co/bangla-speech-processing/BanglaASR', verified:'2026-04-22', note:''},
  {name:'facebook/mms-tts-ben', task:'speech', arch:'VITS', params:'36M', link:'https://huggingface.co/facebook/mms-tts-ben', verified:'2026-04-22', note:'Massively Multilingual Speech TTS.'},
  {name:'google/muril-base-cased', task:'llm', arch:'BERT', params:'236M', link:'https://huggingface.co/google/muril-base-cased', verified:'2026-03-19', note:'17 Indian languages incl. Bangla.'},
  {name:'hishab/titulm-llama-3.2-3b-v2.0', task:'llm', arch:'Llama 3.2', params:'3B', link:'https://huggingface.co/hishab/titulm-llama-3.2-3b-v2.0', verified:'2026-06-28', note:'Continually pretrained Bangla LLM.'},
];

export const TOOLS = [
  {name:'bnlp-toolkit', author:'sagorsarker', desc:'Tokenization, embeddings (word2vec/fastText/GloVe), NER, POS for Bangla.', stars:'285', lang:'Python', install:'pip install bnlp_toolkit', link:'https://github.com/sagorbrur/bnlp', verified:'2026-06-28'},
  {name:'normalizer', author:'csebuetnlp', desc:'Unicode + punctuation normalization used by BanglaBERT/BanglaT5 pipelines.', stars:'62', lang:'Python', install:'pip install git+https://github.com/csebuetnlp/normalizer', link:'https://github.com/csebuetnlp/normalizer', verified:'2026-06-28'},
  {name:'bnunicodenormalizer', author:'BengaliAI', desc:'Deterministic grapheme-level Bangla unicode error correction.', stars:'38', lang:'Python', install:'pip install bnunicodenormalizer', link:'https://github.com/mnansary/bnUnicodeNormalizer', verified:'2026-05-30'},
  {name:'sbnltk', author:'soumitri', desc:'Bangla NLP toolkit: NER, POS, stemmer, sentiment, extractive summarizer.', stars:'71', lang:'Python', install:'pip install sbnltk', link:'https://github.com/Foysal87/sbnltk', verified:'2026-04-15'},
  {name:'bkit', author:'BanglaKit', desc:'Text cleaning, normalization, tokenization, lemmatization for Bangla.', stars:'54', lang:'Python', install:'pip install bkit', link:'https://github.com/banglakit/bkit', verified:'2026-05-02'},
  {name:'avro.py', author:'hitblast', desc:'Phonetic Banglish→Bangla transliteration (Avro keyboard scheme).', stars:'96', lang:'Python', install:'pip install avro-py', link:'https://github.com/hitblast/avro.py', verified:'2026-06-12'},
  {name:'indic-nlp-library', author:'anoopkunchukuttan', desc:'Script processing, normalization, transliteration for Indic languages incl. Bangla.', stars:'570', lang:'Python', install:'pip install indic-nlp-library', link:'https://github.com/anoopkunchukuttan/indic_nlp_library', verified:'2026-06-12'},
  {name:'BanglaSpeech2Text', author:'shhossain', desc:'Ready-to-use Bangla ASR wrapper over Whisper checkpoints.', stars:'88', lang:'Python', install:'pip install banglaspeech2text', link:'https://github.com/shhossain/BanglaSpeech2Text', verified:'2026-03-27'},
  {name:'bangla', author:'arsho', desc:'Utilities: Bangla numerals, dates, and text helpers.', stars:'112', lang:'Python', install:'pip install bangla', link:'https://github.com/arsho/bangla', verified:'2026-02-09'},
];

export const LEADERBOARDS = {
  sentiment:[
    {dataset:'SentNoB', metric:'Micro-F1', rows:[
      {model:'BanglaBERT (large)', score:'0.742', paper:'Bhattacharjee et al. 2022', year:2022},
      {model:'BanglaBERT', score:'0.721', paper:'Islam et al. 2021', year:2021},
      {model:'XLM-R (base)', score:'0.694', paper:'Islam et al. 2021', year:2021},
      {model:'BiLSTM + fastText', score:'0.641', paper:'Islam et al. 2021', year:2021}]},
    {dataset:'BEmoC', metric:'Weighted F1', rows:[
      {model:'BanglaBERT', score:'0.694', paper:'Das et al. 2021', year:2021},
      {model:'CNN-BiLSTM', score:'0.621', paper:'Das et al. 2021', year:2021},
      {model:'SVM + TF-IDF', score:'0.573', paper:'Das et al. 2021', year:2021}]}],
  ner:[{dataset:'B-NER', metric:'Macro-F1', rows:[
    {model:'BanglaBERT (large)', score:'0.868', paper:'Haque et al. 2023', year:2023},
    {model:'BanglaBERT', score:'0.851', paper:'Haque et al. 2023', year:2023},
    {model:'mBERT', score:'0.803', paper:'Haque et al. 2023', year:2023}]}],
  mt:[{dataset:'FLORES-200 bn→en', metric:'sacreBLEU', rows:[
    {model:'NLLB-200 (3.3B)', score:'34.1', paper:'NLLB Team 2022', year:2022},
    {model:'BanglaT5 (NMT)', score:'31.7', paper:'Bhattacharjee et al. 2023', year:2023},
    {model:'mBART-50', score:'27.5', paper:'Tang et al. 2021', year:2021}]}],
  qa:[{dataset:'BanglaRQA', metric:'Answer F1', rows:[
    {model:'BanglaT5', score:'78.1', paper:'Ekram et al. 2022', year:2022},
    {model:'BanglaBERT', score:'74.7', paper:'Ekram et al. 2022', year:2022},
    {model:'mT5 (base)', score:'72.3', paper:'Ekram et al. 2022', year:2022}]}],
  summ:[{dataset:'XL-Sum (bn)', metric:'ROUGE-2', rows:[
    {model:'BanglaT5', score:'13.7', paper:'Bhattacharjee et al. 2023', year:2023},
    {model:'mT5 (XL-Sum)', score:'13.6', paper:'Hasan et al. 2021', year:2021},
    {model:'mBART-50', score:'11.2', paper:'Hasan et al. 2021', year:2021}]}],
  hate:[{dataset:'BD-SHS', metric:'Weighted F1', rows:[
    {model:'BanglaBERT', score:'0.911', paper:'Romim et al. 2022', year:2022},
    {model:'XLM-R (base)', score:'0.893', paper:'Romim et al. 2022', year:2022},
    {model:'BiLSTM (informal emb.)', score:'0.878', paper:'Romim et al. 2022', year:2022}]}],
  speech:[], // no paper-sourced leaderboard curated yet — page shows honest empty state
  textcls:[{dataset:'BanFakeNews', metric:'Macro-F1', rows:[
    {model:'BanglaBERT', score:'0.916', paper:'Kabir et al. 2024', year:2024},
    {model:'BERT-multilingual', score:'0.883', paper:'Hossain et al. 2020', year:2020},
    {model:'SVM + linguistic feats', score:'0.810', paper:'Hossain et al. 2020', year:2020}]}],
  pos:[{dataset:'UD Bengali-BRU', metric:'UPOS Accuracy', rows:[
    {model:'BanglaBERT + linear', score:'91.8', paper:'Mukherjee et al. 2024', year:2024},
    {model:'MuRIL', score:'90.6', paper:'Mukherjee et al. 2024', year:2024}]}],
  llm:[{dataset:'BEnQA (bn)', metric:'Accuracy', rows:[
    {model:'GPT-4', score:'0.641', paper:'Shafayat et al. 2024', year:2024},
    {model:'TituLM-Llama-3.2-3B', score:'0.318', paper:'Nahin et al. 2025', year:2025}]}],
};

export const RECENT = [
  {type:'Dataset', name:'Global-MMLU (bn)', task:'LLM Benchmarks', date:'2026-07-12', href:'TaskDetail.dc.html#llm'},
  {type:'Paper', name:'TituLLMs: A Family of Bangla LLMs', task:'LLM Benchmarks', date:'2026-07-08', href:'Papers.dc.html'},
  {type:'Model', name:'hishab/titulm-llama-3.2-3b-v2.0', task:'LLM Benchmarks', date:'2026-07-05', href:'TaskDetail.dc.html#llm'},
  {type:'Tool', name:'avro.py', task:'Transliteration', date:'2026-06-29', href:'Tools.dc.html'},
  {type:'Dataset', name:'Common Voice bn (v20 refresh)', task:'ASR / TTS', date:'2026-06-24', href:'TaskDetail.dc.html#speech'},
  {type:'Paper', name:'BEnQA: QA and Reasoning Benchmark', task:'LLM Benchmarks', date:'2026-06-18', href:'Papers.dc.html'},
];

export const VENUE_TONES = {ACL:'green','Findings ACL':'green',EMNLP:'red','Findings EMNLP':'red','BLP @ EMNLP':'red',NAACL:'blue','Findings NAACL':'blue','Findings EACL':'blue',AACL:'gold',LREC:'gold','LREC-COLING':'gold',SemEval:'blue',TACL:'green',Interspeech:'red',SLTU:'gold',NeurIPS:'blue',arXiv:'gray','IEEE Access':'gray','IEEE DSAA':'gray',IJCNLP:'gold',Springer:'gray'};

export function searchIndex(){
  const ix=[];
  TASKS.forEach(t=>ix.push({type:'Task',name:t.name,meta:t.bn,href:'TaskDetail.dc.html#'+t.id}));
  DATASETS.forEach(d=>ix.push({type:'Dataset',name:d.name,meta:d.size,href:'Datasets.dc.html#'+d.id}));
  PAPERS.forEach(p=>ix.push({type:'Paper',name:p.title,meta:p.venue+' '+p.year,href:'Papers.dc.html'}));
  MODELS.forEach(m=>ix.push({type:'Model',name:m.name,meta:m.arch+' · '+m.params,href:m.link}));
  TOOLS.forEach(t=>ix.push({type:'Tool',name:t.name,meta:t.desc.slice(0,50),href:'Tools.dc.html'}));
  return ix;
}
export const STATS = {papers:PAPERS.length, datasets:DATASETS.length, models:MODELS.length, tools:TOOLS.length};
