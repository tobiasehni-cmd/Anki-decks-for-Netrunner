/**
 * NetrunnerDB API Client
 * Handles all API calls to the NetrunnerDB V3 API
 * https://api-preview.netrunnerdb.com/api/docs/
 */

const BASE_URL = 'https://api-preview.netrunnerdb.com/api/v3/public';

// Simple in-memory cache
const cache = new Map();

class NetrunnerDBClient {
  /**
   * Fetch all cards from the API
   * @returns {Promise<Array>} Array of card objects
   */
  static async fetchAllCards() {
    const cacheKey = 'all_cards';
    if (cache.has(cacheKey)) {
      console.log('📦 Using cached card data...');
      return cache.get(cacheKey);
    }

    console.log('🔄 Fetching all cards from NetrunnerDB...');
    try {
      const response = await fetch(`${BASE_URL}/cards`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract cards from JSON:API format
      const cards = data.data || [];
      console.log(`✅ Retrieved ${cards.length} cards`);
      
      cache.set(cacheKey, cards);
      return cards;
    } catch (error) {
      console.error('❌ Error fetching cards:', error.message);
      throw error;
    }
  }

  /**
   * Fetch a single card by code
   * @param {string} cardCode - Card code (e.g., 'sure_gamble')
   * @returns {Promise<Object>} Card object
   */
  static async fetchCard(cardCode) {
    console.log(`🔍 Fetching card: ${cardCode}`);
    try {
      const response = await fetch(`${BASE_URL}/cards/${cardCode}`);
      if (!response.ok) {
        throw new Error(`Card not found: ${cardCode}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`❌ Error fetching card ${cardCode}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch all card sets
   * @returns {Promise<Array>} Array of card set objects
   */
  static async fetchCardSets() {
    const cacheKey = 'card_sets';
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    console.log('🔄 Fetching card sets...');
    try {
      const response = await fetch(`${BASE_URL}/card_sets`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const sets = data.data || [];
      console.log(`✅ Retrieved ${sets.length} card sets`);
      
      cache.set(cacheKey, sets);
      return sets;
    } catch (error) {
      console.error('❌ Error fetching card sets:', error.message);
      throw error;
    }
  }

  /**
   * Fetch all card cycles
   * @returns {Promise<Array>} Array of card cycle objects
   */
  static async fetchCardCycles() {
    const cacheKey = 'card_cycles';
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    console.log('🔄 Fetching card cycles...');
    try {
      const response = await fetch(`${BASE_URL}/card_cycles`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const cycles = data.data || [];
      console.log(`✅ Retrieved ${cycles.length} card cycles`);
      
      cache.set(cacheKey, cycles);
      return cycles;
    } catch (error) {
      console.error('❌ Error fetching card cycles:', error.message);
      throw error;
    }
  }

  /**
   * Fetch all factions
   * @returns {Promise<Array>} Array of faction objects
   */
  static async fetchFactions() {
    const cacheKey = 'factions';
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    console.log('🔄 Fetching factions...');
    try {
      const response = await fetch(`${BASE_URL}/factions`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const factions = data.data || [];
      console.log(`✅ Retrieved ${factions.length} factions`);
      
      cache.set(cacheKey, factions);
      return factions;
    } catch (error) {
      console.error('❌ Error fetching factions:', error.message);
      throw error;
    }
  }

  /**
   * Clear the cache
   */
  static clearCache() {
    cache.clear();
    console.log('🧹 Cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  }
}

export default NetrunnerDBClient;
