# Font sources

The site serves font subsets from `src/assets/fonts/` and makes no runtime
requests to a font provider. Each family is licensed under the SIL Open Font
License 1.1; full license texts are kept beside this file.

| Family | Files | Weights | Source |
| --- | --- | --- | --- |
| Geist Mono | `geist-mono-latin.woff2` | 400–600 variable | [Google Fonts CSS, v6](https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400..600&display=optional); [Geist owner source](https://github.com/vercel/geist-font) |
| Source Sans 3 | `sourcesans3-latin*.woff2` | 400–700 variable | [Google Fonts CSS, v20](https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400..700&display=optional); [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/sourcesans3) |
| Newsreader | `newsreader-latin*.woff2` | 400–600 variable, optical size 60 | [Google Fonts CSS](https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@60,400..600&display=optional); [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/newsreader) |
| Noto Serif Bengali | `noto-serif-bengali-*.woff2` | 400–700 variable | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/notoserifbengali) |

The Google Fonts CSS records the corresponding `fonts.gstatic.com` WOFF2 URLs
and Unicode ranges. Source Sans 3 and Newsreader use Latin and Latin-ext
subsets. Noto Serif Bengali's Bengali, Latin, and Latin-ext subsets are
preserved. `src/styles/fonts.css` declares all faces with
`font-display: optional`.

License texts and authoritative source files:

- [Geist Mono OFL](https://github.com/google/fonts/blob/main/ofl/geistmono/OFL.txt)
- [Source Sans 3 OFL](https://github.com/google/fonts/blob/main/ofl/sourcesans3/OFL.txt)
- [Newsreader OFL](https://github.com/google/fonts/blob/main/ofl/newsreader/OFL.txt)
- [Noto Serif Bengali OFL](https://github.com/google/fonts/blob/main/ofl/notoserifbengali/OFL.txt)
