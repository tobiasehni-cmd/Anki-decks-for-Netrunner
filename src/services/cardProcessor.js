/**
 * Card Processor Service
 * Transforms raw NetrunnerDB API data into Anki flashcard format
 */

class CardProcessor {
  /**
   * Process raw cards from API into flashcard format
   * @param {Array} rawCards - Raw card objects from API
   * @returns {Array} Processed flashcards
   */
  static processCards(rawCards) {
    return rawCards
      .filter(card => card && card.attributes)
      .map(card => this.transformCard(card));
  }

  /**
   * Transform a single card to flashcard format
   * @param {Object} card - Raw card from API
   * @returns {Object} Processed flashcard
   */
  static transformCard(card) {
    const { id, attributes } = card;
    const attrs = attributes || {};

    // Extract basic info
    const title = attrs.title || '';
    const cardType = attrs.card_type?.name || '';
    const faction = attrs.faction?.name || 'Neutral';
    const subtitle = attrs.subtype_template || '';
    const cardText = attrs.text || '';
    const flavorText = attrs.flavor_text || '';
    const imageUrl = attrs.image_url || '';

    // Extract stats based on card type
    const stats = this.extractStats(attrs);

    // Create front side (question)
    const front = this.generateFront(title, cardType, subtitle, stats);

    // Create back side (answer)
    const back = this.generateBack(cardText, flavorText, stats, faction, cardType);

    return {
      cardCode: id,
      title,
      front,
      back,
      metadata: {
        faction,
        cardType,
        subtitle,
        stats,
        setCode: attrs.card_set?.code || '',
        imageUrl
      }
    };
  }

  /**
   * Extract relevant statistics from card attributes
   * @param {Object} attrs - Card attributes
   * @returns {Object} Extracted stats
   */
  static extractStats(attrs) {
    const stats = {};

    if (attrs.cost !== null && attrs.cost !== undefined) stats.cost = attrs.cost;
    if (attrs.strength !== null && attrs.strength !== undefined) stats.strength = attrs.strength;
    if (attrs.memory_cost !== null && attrs.memory_cost !== undefined) stats.memory = attrs.memory_cost;
    if (attrs.agenda_points !== null && attrs.agenda_points !== undefined) stats.agendaPoints = attrs.agenda_points;
    if (attrs.trash_cost !== null && attrs.trash_cost !== undefined) stats.trashCost = attrs.trash_cost;
    if (attrs.influence_cost !== null && attrs.influence_cost !== undefined) stats.influence = attrs.influence_cost;

    return stats;
  }

  /**
   * Generate front side of flashcard (question)
   * @param {string} title - Card title
   * @param {string} type - Card type
   * @param {string} subtitle - Card subtype
   * @param {Object} stats - Card statistics
   * @returns {string} HTML front side
   */
  static generateFront(title, type, subtitle, stats) {
    let html = `<b>${this.escapeHtml(title)}</b>`;
    
    if (type) {
      html += `<br><i>${this.escapeHtml(type)}</i>`;
    }
    
    if (subtitle) {
      html += `<br><small>${this.escapeHtml(subtitle)}</small>`;
    }

    // Add key stats to front
    const statsList = [];
    if (stats.cost !== undefined) statsList.push(`<b>Cost: ${stats.cost}</b>`);
    if (stats.strength !== undefined) statsList.push(`<b>Strength: ${stats.strength}</b>`);
    if (stats.agendaPoints !== undefined) statsList.push(`<b>Agenda Points: ${stats.agendaPoints}</b>`);
    if (stats.memory !== undefined) statsList.push(`<b>Memory: ${stats.memory}</b>`);

    if (statsList.length > 0) {
      html += `<br>${statsList.join(' ')}`;
    }

    return html;
  }

  /**
   * Generate back side of flashcard (answer)
   * @param {string} text - Card ability text
   * @param {string} flavor - Flavor text
   * @param {Object} stats - Card statistics
   * @param {string} faction - Card faction
   * @param {string} type - Card type
   * @returns {string} HTML back side
   */
  static generateBack(text, flavor, stats, faction, type) {
    let html = '';

    // Card text (abilities)
    if (text) {
      html += `<div>${this.escapeHtml(text)}</div>`;
    }

    // Stats section
    const statsHtml = this.generateStatsSection(stats);
    if (statsHtml) {
      html += `<div>${statsHtml}</div>`;
    }

    // Metadata section
    const metadataHtml = this.generateMetadataSection(faction, type);
    if (metadataHtml) {
      html += `<div>${metadataHtml}</div>`;
    }

    // Flavor text (optional, at bottom)
    if (flavor) {
      html += `<div><i><small>${this.escapeHtml(flavor)}</small></i></div>`;
    }

    return html || '<div>No ability text</div>';
  }

  /**
   * Generate stats section HTML
   * @param {Object} stats - Statistics
   * @returns {string} HTML stats section
   */
  static generateStatsSection(stats) {
    if (Object.keys(stats).length === 0) return '';

    const parts = [];
    if (stats.cost !== undefined) parts.push(`<b>Cost:</b> ${stats.cost}`);
    if (stats.strength !== undefined) parts.push(`<b>Strength:</b> ${stats.strength}`);
    if (stats.memory !== undefined) parts.push(`<b>Memory:</b> ${stats.memory}`);
    if (stats.agendaPoints !== undefined) parts.push(`<b>Points:</b> ${stats.agendaPoints}`);
    if (stats.trashCost !== undefined) parts.push(`<b>Trash:</b> ${stats.trashCost}`);
    if (stats.influence !== undefined) parts.push(`<b>Influence:</b> ${stats.influence}`);

    return `<small>${parts.join(' | ')}</small>`;
  }

  /**
   * Generate metadata section HTML
   * @param {string} faction - Faction name
   * @param {string} type - Card type
   * @returns {string} HTML metadata section
   */
  static generateMetadataSection(faction, type) {
    const parts = [];
    if (faction) parts.push(`<b>Faction:</b> ${this.escapeHtml(faction)}`);
    if (type) parts.push(`<b>Type:</b> ${this.escapeHtml(type)}`);

    return parts.length > 0 ? `<small>${parts.join(' | ')}</small>` : '';
  }

  /**
   * Filter cards based on criteria
   * @param {Array} cards - Cards to filter
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered cards
   */
  static filterCards(cards, filters = {}) {
    return cards.filter(card => {
      const meta = card.metadata || {};

      if (filters.faction && meta.faction !== filters.faction) return false;
      if (filters.type && meta.cardType !== filters.type) return false;
      if (filters.setCode && meta.setCode !== filters.setCode) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const searchableText = `${card.title} ${card.front} ${card.back}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }

      return true;
    });
  }

  /**
   * Extract unique metadata from cards
   * @param {Array} cards - Processed flashcards
   * @returns {Object} Unique metadata
   */
  static extractMetadata(cards) {
    const factions = new Set();
    const cardTypes = new Set();
    const sets = new Set();

    cards.forEach(card => {
      const meta = card.metadata || {};
      if (meta.faction) factions.add(meta.faction);
      if (meta.cardType) cardTypes.add(meta.cardType);
      if (meta.setCode) sets.add(meta.setCode);
    });

    return {
      factions: Array.from(factions).sort(),
      types: Array.from(cardTypes).sort(),
      sets: Array.from(sets).sort(),
      totalCards: cards.length
    };
  }

  /**
   * Generate statistics about cards
   * @param {Array} cards - Processed flashcards
   * @param {Object} filters - Applied filters
   * @returns {Object} Statistics
   */
  static generateStats(cards, filters = {}) {
    const stats = {
      totalCards: cards.length,
      byFaction: {},
      byType: {},
      bySet: {},
      timestamp: new Date().toISOString(),
      filters: Object.keys(filters).length > 0 ? filters : 'none'
    };

    cards.forEach(card => {
      const meta = card.metadata || {};
      
      // Count by faction
      if (meta.faction) {
        stats.byFaction[meta.faction] = (stats.byFaction[meta.faction] || 0) + 1;
      }

      // Count by type
      if (meta.cardType) {
        stats.byType[meta.cardType] = (stats.byType[meta.cardType] || 0) + 1;
      }

      // Count by set
      if (meta.setCode) {
        stats.bySet[meta.setCode] = (stats.bySet[meta.setCode] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  static escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

export default CardProcessor;
