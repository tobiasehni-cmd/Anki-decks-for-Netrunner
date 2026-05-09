# Anki Decks for Netrunner

Create Anki flashcard decks from [NetrunnerDB](https://netrunnerdb.com/) cards.

## Overview

This tool fetches card data from the NetrunnerDB API and transforms it into Anki-compatible flashcard decks (`.apkg` files). Learn Netrunner card mechanics, abilities, and strategies through spaced repetition.

## Features

- ✅ **Automatic Card Fetching** - Pulls all ~4000 Netrunner cards from the NetrunnerDB V3 API
- ✅ **Smart Flashcard Generation** - Creates effective front/back flashcards with card abilities and stats
- ✅ **Flexible Filtering** - Filter cards by faction, type, set, or search terms
- ✅ **API Caching** - Caches API responses to avoid redundant network calls
- ✅ **Rich Metadata** - Extracts factions, card types, sets for organization
- 🔄 **Anki Deck Package** - Generates `.apkg` files ready to import into Anki (coming in Phase 2)

## Quick Start

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/tobiasehni-cmd/Anki-decks-for-Netrunner.git
cd Anki-decks-for-Netrunner

# Install dependencies
npm install
```

### Usage

**Fetch all cards:**
```bash
npm run fetch
```

**Fetch specific faction:**
```bash
npm run fetch -- --faction "Jinteki"
npm run fetch -- --faction "Weyland Consortium"
```

**Fetch specific card type:**
```bash
npm run fetch -- --type "Ice"
npm run fetch -- --type "Program"
```

**Fetch from specific set:**
```bash
npm run fetch -- --set "core"
```

**Search for cards:**
```bash
npm run fetch -- --search "sure gamble"
```

**Combine filters:**
```bash
npm run fetch -- --faction "Jinteki" --type "Ice"
```

**View help:**
```bash
npm run fetch -- --help
```

## Output

After running `npm run fetch`, files are saved to `deck_data/`:

### cards.json
Array of processed flashcards with the following structure:
```json
{
  "cardCode": "sure_gamble",
  "title": "Sure Gamble",
  "front": "<b>Sure Gamble</b><br><i>Event</i><br><small></small><br><b>Cost: 4</b>",
  "back": "<div>Gain 4[credit]. (Usable only if you made a successful run this turn.)</div><div><small><b>Faction:</b> Adam</small></div><div><small><b>Type:</b> Event</small></div>",
  "metadata": {
    "faction": "Adam",
    "cardType": "Event",
    "subtitle": "",
    "cost": 4,
    "setCode": "core",
    "imageUrl": "https://..."
  }
}
```

### metadata.json
Contains lists of all available factions, card types, and sets:
```json
{
  "factions": ["Adam", "Jinteki", "Weyland Consortium", ...],
  "types": ["Agenda", "Asset", "Event", "Hardware", ...],
  "sets": ["core", "twinfalls", "secondsight", ...],
  "totalCards": 4234
}
```

### stats.json
Detailed statistics about the fetched cards:
```json
{
  "totalCards": 4234,
  "byFaction": { "Jinteki": 523, "Weyland": 456, ... },
  "byType": { "Ice": 678, "Program": 523, ... },
  "timestamp": "2026-05-09T13:47:38Z",
  "filters": "none"
}
```

## Project Structure

```
.
├── src/
│   ├── api/
│   │   └── netrunnerdbClient.js    # NetrunnerDB API wrapper
│   ├── services/
│   │   └── cardProcessor.js        # Card transformation logic
│   ├── utils/
│   │   └── fileUtils.js            # File I/O utilities
│   └── index.js                    # CLI entry point
├── deck_data/                       # Output directory (auto-created)
│   ├── cards.json                  # Processed flashcards
│   ├── metadata.json               # Available categories
│   └── stats.json                  # Statistics
├── package.json
├── README.md
└── .gitignore
```

## Technical Details

### API Integration
- Uses NetrunnerDB V3 API: `https://api-preview.netrunnerdb.com/api/v3/public`
- Follows JSON:API conventions
- Built-in caching to minimize API calls

### Card Processing
- Transforms card data into effective flashcard format
- Front side: Card name, type, cost
- Back side: Card text, abilities, statistics
- HTML formatting for better Anki rendering

### File Management
- Creates `deck_data/` directory automatically
- Saves processed cards as JSON
- Stores metadata and statistics for analysis

## Roadmap

### Phase 1: ✅ Card Fetching (Complete)
- Fetch cards from NetrunnerDB API
- Transform to flashcard format
- Save as JSON files

### Phase 2: 🔄 Anki Deck Generation (In Progress)
- Create `.apkg` file format
- Generate SQLite database
- Include card images
- Create deck hierarchy

### Phase 3: Enhancement
- Web UI for easier filtering
- Incremental deck updates
- Multiple deck templates
- Image optimization

## Troubleshooting

**Q: "Module not found" error**
```bash
# Make sure to install dependencies
npm install
```

**Q: API connection fails**
- Check your internet connection
- NetrunnerDB API might be temporarily unavailable
- Try clearing the cache: `npm run fetch -- clear-cache`

**Q: Output files are empty**
- Check that `npm run fetch` completed without errors
- Try re-running the fetch command

## Contributing

Contributions are welcome! Some areas for improvement:
- Better error handling and retry logic
- Support for offline card data
- Performance optimizations
- Unit tests
- Web UI

## License

MIT

## Resources

- [NetrunnerDB](https://netrunnerdb.com/) - Card database
- [NetrunnerDB API Docs](https://api-preview.netrunnerdb.com/api/docs/)
- [Anki](https://apps.ankiweb.net/) - Spaced repetition flashcard app
- [Netrunner](https://en.wikipedia.org/wiki/Android:_Netrunner) - Card game

## Contact

For issues or questions, please open an issue on GitHub.
