# Presentation OS

Working prototype for a corporate presentation automation platform.

## Goal
Turn source material into a structured storyline, map each slide to an approved presentation-design archetype, and prepare deterministic rendering to editable PowerPoint.

## Current milestone — v0.1
- Corporate web workspace
- New-presentation intake
- Source text ingestion
- Storyline generation (local deterministic fallback)
- Slide-intent classification
- Design-system layout mapping
- Editable outline/cards
- Project JSON export
- Architecture prepared for AI and PPTX renderer integrations

## Run locally
```bash
npm start
```
Open http://localhost:4173

## Next integrations
1. OpenAI Responses API for structured storyline generation
2. PPTX renderer (PptxGenJS or deterministic OOXML renderer)
3. Visual QA loop
4. Cloudflare deployment/storage
5. Authentication and multi-tenant brand libraries
