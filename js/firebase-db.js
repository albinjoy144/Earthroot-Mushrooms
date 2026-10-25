/**
 * Earthroot Farm - Firebase Firestore Real-Time Database Client
 * 
 * Provides automated cloud synchronization, real-time multi-device sync,
 * and offline fallback for:
 * 1. Customer Buyers & Orders Ledger
 * 2. Farm Expenses Ledger
 * 3. Mushroom Harvest Inventory & Stock
 * 4. Poultry Inventory & Live Stock
 */

(function () {
  'use strict';

  const DB_COLLECTION = 'farm_data';
  const DOCS = {
    BUYERS: 'buyers_ledger',
    EXPENSES: 'expenses_ledger',
    STOCK: 'mushroom_stock',
    POULTRY: 'poultry_inventory'
  };

  const EarthrootCloudDB = {
    app: null,
    db: null,
    status: 'disconnected', // 'disconnected' | 'connecting' | 'connected' | 'error'
    statusMessage: 'Cloud database not configured',
    lastSyncTime: null,
    listeners: {
      buyers: [],
      expenses: [],
      stock: [],
      poultry: [],
      status: []
    },
    unsubscribers: [],

    /**
     * Check if Firestore is actively initialized and online
     */
    isConnected: function () {
      return this.status === 'connected' && Boolean(this.db);
    },

    /**
     * Broadcast status change to registered UI listeners
     */
    _notifyStatus: function (status, message) {
      this.status = status;
      this.statusMessage = message || '';
      this.listeners.status.forEach(cb => {
        try { cb(status, message); } catch (e) { console.error('Status listener error:', e); }
      });
    },

    /**
     * Register a status change callback
     */
    onStatusChange: function (callback) {
      if (typeof callback === 'function') {
        this.listeners.status.push(callback);
        // Fire immediately with current state
        callback(this.status, this.statusMessage);
      }
    },

    /**
     * Initialize Firebase with provided or stored config
     */
    init: async function (customConfig) {
      const config = customConfig || (typeof window.getEarthrootFirebaseConfig === 'function' ? window.getEarthrootFirebaseConfig() : null);

      if (!config || !config.apiKey || !config.projectId) {
        this._notifyStatus('disconnected', 'Firebase credentials missing. LocalStorage active.');
        return false;
      }

      // Check if Firebase Compat SDK is present
      if (typeof firebase === 'undefined' || !firebase.initializeApp) {
        this._notifyStatus('error', 'Firebase SDK library not loaded.');
        console.warn('Firebase SDK script not found on page.');
        return false;
      }

      try {
        this._notifyStatus('connecting', 'Connecting to Google Firebase Firestore...');

        // Avoid re-initializing existing app
        if (firebase.apps && firebase.apps.length > 0) {
          this.app = firebase.apps[0];
        } else {
          this.app = firebase.initializeApp(config);
        }

        this.db = firebase.firestore();

        // Enable offline persistence if supported in current browser
        try {
          await this.db.enablePersistence({ synchronizeTabs: true });
        } catch (err) {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
          } else if (err.code === 'unimplemented') {
            // Browser doesn't support persistence
          }
        }

        // Test connection with a lightweight ping
        await this.db.collection(DB_COLLECTION).doc('_ping').set({
          lastPing: firebase.firestore.FieldValue.serverTimestamp(),
          client: 'Earthroot Farm Admin'
        }, { merge: true });

        this.lastSyncTime = new Date();
        this._notifyStatus('connected', 'Connected to Cloud Firestore (Real-Time Active)');
        console.log('✅ Earthroot Cloud Database (Firestore) initialized successfully.');

        // Start active real-time listeners
        this._attachRealtimeListeners();

        return true;
      } catch (err) {
        console.error('Firebase connection error:', err);
        this._notifyStatus('error', 'Connection failed: ' + (err.message || 'Check API keys / Security Rules'));
        return false;
      }
    },

    /**
     * Tear down all active Firestore real-time listeners
     */
    disconnect: function () {
      this.unsubscribers.forEach(unsub => {
        try { unsub(); } catch (e) {}
      });
      this.unsubscribers = [];
      this.db = null;
      this.app = null;
      this._notifyStatus('disconnected', 'Cloud database disconnected.');
    },

    /**
     * Attach snapshot listeners for real-time multi-device sync
     */
    _attachRealtimeListeners: function () {
      if (!this.db) return;

      // Clean up previous listeners
      this.unsubscribers.forEach(unsub => {
        try { unsub(); } catch (e) {}
      });
      this.unsubscribers = [];

      // 1. Buyers Ledger Listener
      try {
        const unsubBuyers = this.db.collection(DB_COLLECTION).doc(DOCS.BUYERS).onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items)) {
              this.lastSyncTime = new Date();
              this.listeners.buyers.forEach(cb => {
                try { cb(data.items, doc.metadata.hasPendingWrites); } catch (e) { console.error(e); }
              });
            }
          }
        }, err => {
          console.warn('Buyers cloud sync listener error:', err.message);
        });
        this.unsubscribers.push(unsubBuyers);
      } catch (e) { console.error(e); }

      // 2. Expenses Ledger Listener
      try {
        const unsubExpenses = this.db.collection(DB_COLLECTION).doc(DOCS.EXPENSES).onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items)) {
              this.lastSyncTime = new Date();
              this.listeners.expenses.forEach(cb => {
                try { cb(data.items, doc.metadata.hasPendingWrites); } catch (e) { console.error(e); }
              });
            }
          }
        }, err => {
          console.warn('Expenses cloud sync listener error:', err.message);
        });
        this.unsubscribers.push(unsubExpenses);
      } catch (e) { console.error(e); }

      // 3. Mushroom Stock Listener
      try {
        const unsubStock = this.db.collection(DB_COLLECTION).doc(DOCS.STOCK).onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data && data.stockMap) {
              this.lastSyncTime = new Date();
              this.listeners.stock.forEach(cb => {
                try { cb(data.stockMap, doc.metadata.hasPendingWrites); } catch (e) { console.error(e); }
              });
            }
          }
        }, err => {
          console.warn('Stock cloud sync listener error:', err.message);
        });
        this.unsubscribers.push(unsubStock);
      } catch (e) { console.error(e); }

      // 4. Poultry Inventory Listener
      try {
        const unsubPoultry = this.db.collection(DB_COLLECTION).doc(DOCS.POULTRY).onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data && data.stockMap) {
              this.lastSyncTime = new Date();
              this.listeners.poultry.forEach(cb => {
                try { cb(data.stockMap, doc.metadata.hasPendingWrites); } catch (e) { console.error(e); }
              });
            }
          }
        }, err => {
          console.warn('Poultry cloud sync listener error:', err.message);
        });
        this.unsubscribers.push(unsubPoultry);
      } catch (e) { console.error(e); }
    },

    // ----------------------------------------------------
    // Buyers / Orders Ledger Methods
    // ----------------------------------------------------
    onBuyersChange: function (callback) {
      if (typeof callback === 'function') this.listeners.buyers.push(callback);
    },

    saveBuyers: async function (buyersArray) {
      if (!this.isConnected()) return false;
      try {
        await this.db.collection(DB_COLLECTION).doc(DOCS.BUYERS).set({
          items: buyersArray || [],
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          count: Array.isArray(buyersArray) ? buyersArray.length : 0
        });
        this.lastSyncTime = new Date();
        return true;
      } catch (err) {
        console.error('Failed to save buyers to Firestore:', err);
        return false;
      }
    },

    loadBuyers: async function () {
      if (!this.isConnected()) return null;
      try {
        const doc = await this.db.collection(DB_COLLECTION).doc(DOCS.BUYERS).get();
        if (doc.exists && doc.data() && Array.isArray(doc.data().items)) {
          return doc.data().items;
        }
      } catch (err) {
        console.error('Failed to load buyers from Firestore:', err);
      }
      return null;
    },

    // ----------------------------------------------------
    // Expenses Ledger Methods
    // ----------------------------------------------------
    onExpensesChange: function (callback) {
      if (typeof callback === 'function') this.listeners.expenses.push(callback);
    },

    saveExpenses: async function (expensesArray) {
      if (!this.isConnected()) return false;
      try {
        await this.db.collection(DB_COLLECTION).doc(DOCS.EXPENSES).set({
          items: expensesArray || [],
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          count: Array.isArray(expensesArray) ? expensesArray.length : 0
        });
        this.lastSyncTime = new Date();
        return true;
      } catch (err) {
        console.error('Failed to save expenses to Firestore:', err);
        return false;
      }
    },

    loadExpenses: async function () {
      if (!this.isConnected()) return null;
      try {
        const doc = await this.db.collection(DB_COLLECTION).doc(DOCS.EXPENSES).get();
        if (doc.exists && doc.data() && Array.isArray(doc.data().items)) {
          return doc.data().items;
        }
      } catch (err) {
        console.error('Failed to load expenses from Firestore:', err);
      }
      return null;
    },

    // ----------------------------------------------------
    // Mushroom Stock Methods
    // ----------------------------------------------------
    onStockChange: function (callback) {
      if (typeof callback === 'function') this.listeners.stock.push(callback);
    },

    saveStock: async function (stockMap) {
      if (!this.isConnected()) return false;
      try {
        await this.db.collection(DB_COLLECTION).doc(DOCS.STOCK).set({
          stockMap: stockMap || {},
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        this.lastSyncTime = new Date();
        return true;
      } catch (err) {
        console.error('Failed to save mushroom stock to Firestore:', err);
        return false;
      }
    },

    loadStock: async function () {
      if (!this.isConnected()) return null;
      try {
        const doc = await this.db.collection(DB_COLLECTION).doc(DOCS.STOCK).get();
        if (doc.exists && doc.data() && doc.data().stockMap) {
          return doc.data().stockMap;
        }
      } catch (err) {
        console.error('Failed to load mushroom stock from Firestore:', err);
      }
      return null;
    },

    // ----------------------------------------------------
    // Poultry Stock Methods
    // ----------------------------------------------------
    onPoultryChange: function (callback) {
      if (typeof callback === 'function') this.listeners.poultry.push(callback);
    },

    savePoultry: async function (poultryStockMap) {
      if (!this.isConnected()) return false;
      try {
        await this.db.collection(DB_COLLECTION).doc(DOCS.POULTRY).set({
          stockMap: poultryStockMap || {},
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        this.lastSyncTime = new Date();
        return true;
      } catch (err) {
        console.error('Failed to save poultry stock to Firestore:', err);
        return false;
      }
    },

    loadPoultry: async function () {
      if (!this.isConnected()) return null;
      try {
        const doc = await this.db.collection(DB_COLLECTION).doc(DOCS.POULTRY).get();
        if (doc.exists && doc.data() && doc.data().stockMap) {
          return doc.data().stockMap;
        }
      } catch (err) {
        console.error('Failed to load poultry stock from Firestore:', err);
      }
      return null;
    },

    // ----------------------------------------------------
    // Bulk Cloud Sync (Upload & Download)
    // ----------------------------------------------------

    /**
     * Upload all data from browser localStorage to Firestore in 1 step
     */
    uploadAllLocalData: async function () {
      if (!this.isConnected()) {
        throw new Error('Cloud database is not connected.');
      }

      const results = { buyers: 0, expenses: 0, stock: false, poultry: false };

      // 1. Buyers
      try {
        const savedBuyers = localStorage.getItem('earthroot_buyer_customers');
        if (savedBuyers) {
          const parsed = JSON.parse(savedBuyers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.saveBuyers(parsed);
            results.buyers = parsed.length;
          }
        }
      } catch (e) { console.warn(e); }

      // 2. Expenses
      try {
        const savedExpenses = localStorage.getItem('earthroot_farm_expenses');
        if (savedExpenses) {
          const parsed = JSON.parse(savedExpenses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.saveExpenses(parsed);
            results.expenses = parsed.length;
          }
        }
      } catch (e) { console.warn(e); }

      // 3. Mushroom Stock
      try {
        const savedStock = localStorage.getItem('earthroot_inventory_stock');
        if (savedStock) {
          const parsed = JSON.parse(savedStock);
          await this.saveStock(parsed);
          results.stock = true;
        }
      } catch (e) { console.warn(e); }

      // 4. Poultry Stock
      try {
        const savedPoultry = localStorage.getItem('earthroot_poultry_inventory');
        if (savedPoultry) {
          const parsed = JSON.parse(savedPoultry);
          await this.savePoultry(parsed);
          results.poultry = true;
        }
      } catch (e) { console.warn(e); }

      return results;
    },

    /**
     * Download all data from Firestore into browser localStorage in 1 step
     */
    downloadAllCloudData: async function () {
      if (!this.isConnected()) {
        throw new Error('Cloud database is not connected.');
      }

      const results = { buyers: 0, expenses: 0, stock: false, poultry: false };

      // 1. Buyers
      const cloudBuyers = await this.loadBuyers();
      if (cloudBuyers && Array.isArray(cloudBuyers)) {
        localStorage.setItem('earthroot_buyer_customers', JSON.stringify(cloudBuyers));
        results.buyers = cloudBuyers.length;
      }

      // 2. Expenses
      const cloudExpenses = await this.loadExpenses();
      if (cloudExpenses && Array.isArray(cloudExpenses)) {
        localStorage.setItem('earthroot_farm_expenses', JSON.stringify(cloudExpenses));
        results.expenses = cloudExpenses.length;
      }

      // 3. Mushroom Stock
      const cloudStock = await this.loadStock();
      if (cloudStock && typeof cloudStock === 'object') {
        localStorage.setItem('earthroot_inventory_stock', JSON.stringify(cloudStock));
        results.stock = true;
      }

      // 4. Poultry Stock
      const cloudPoultry = await this.loadPoultry();
      if (cloudPoultry && typeof cloudPoultry === 'object') {
        localStorage.setItem('earthroot_poultry_inventory', JSON.stringify(cloudPoultry));
        results.poultry = true;
      }

      return results;
    }
  };

  window.EarthrootCloudDB = EarthrootCloudDB;
})();
