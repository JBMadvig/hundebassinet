"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCurrencyService = initCurrencyService;
exports.destroyCurrencyService = destroyCurrencyService;
exports.convertFromDKK = convertFromDKK;
exports.convertToDKK = convertToDKK;
exports.getAvailableCurrencies = getAvailableCurrencies;
const BASE_CURRENCY = 'DKK';
const API_URL = `https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}`;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let cachedRates = {};
let refreshTimeout = null;
let refreshInterval = null;
function fetchRates() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(API_URL);
            if (!response.ok) {
                console.warn(`Currency API returned ${response.status}, keeping previous rates`);
                return;
            }
            const data = yield response.json();
            cachedRates = data.rates;
            console.log(`💱 Currency rates updated (${Object.keys(cachedRates).length} currencies, date: ${data.date})`);
        }
        catch (error) {
            console.warn('Failed to fetch currency rates, keeping previous rates:', error);
        }
    });
}
/**
 * Calculates milliseconds until the next 16:05 CET (Europe/Copenhagen).
 */
function msUntilNext1605CET() {
    var _a, _b, _c, _d;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Copenhagen',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const currentHourCET = Number((_b = (_a = parts.find(p => p.type === 'hour')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0);
    const currentMinuteCET = Number((_d = (_c = parts.find(p => p.type === 'minute')) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0);
    const currentMinutesOfDay = currentHourCET * 60 + currentMinuteCET;
    const targetMinutesOfDay = 16 * 60 + 5;
    let diffMinutes = targetMinutesOfDay - currentMinutesOfDay;
    if (diffMinutes <= 0) {
        diffMinutes += 24 * 60;
    }
    return diffMinutes * 60 * 1000;
}
function clearTimers() {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
    }
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}
function initCurrencyService() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear any existing timers (safety for re-init)
        clearTimers();
        // Fetch immediately on startup
        yield fetchRates();
        // Schedule next fetch at 16:05 CET, then every 24h
        const msUntilFirstRefresh = msUntilNext1605CET();
        const hoursUntil = (msUntilFirstRefresh / (1000 * 60 * 60)).toFixed(1);
        console.log(`💱 Next rate refresh in ${hoursUntil}h (16:05 CET daily)`);
        refreshTimeout = setTimeout(() => {
            refreshTimeout = null;
            void fetchRates();
            refreshInterval = setInterval(() => void fetchRates(), ONE_DAY_MS);
        }, msUntilFirstRefresh);
    });
}
function destroyCurrencyService() {
    clearTimers();
    cachedRates = {};
}
function convertFromDKK(amount, targetCurrency) {
    if (targetCurrency === BASE_CURRENCY) {
        return amount;
    }
    const rate = cachedRates[targetCurrency];
    if (!rate) {
        console.warn(`No exchange rate found for ${targetCurrency}, returning DKK value`);
        return amount;
    }
    return Math.round(amount * rate * 100) / 100;
}
function convertToDKK(amount, sourceCurrency) {
    if (sourceCurrency === BASE_CURRENCY) {
        return amount;
    }
    const rate = cachedRates[sourceCurrency];
    if (!rate) {
        console.warn(`No exchange rate found for ${sourceCurrency}, returning original value`);
        return amount;
    }
    return Math.round((amount / rate) * 100) / 100;
}
function getAvailableCurrencies() {
    return [BASE_CURRENCY, ...Object.keys(cachedRates).sort()];
}
