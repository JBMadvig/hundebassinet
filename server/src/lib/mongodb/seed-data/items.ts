import { Item, PrimaryCategories } from '../models/item.model';

type SeedItem = Pick<Item,
    'name' |
    'primaryCategory' |
    'secondaryCategory' |
    'abv' |
    'volume' |
    'averagePrice' |
    'currentStock' |
    'createdAt' |
    'updatedAt'
>;

// Fixes applied vs. the client's original mock data (client/src/app/pages/pos/testdata.ts):
// - Carlsberg Pilsner: currentStock corrected from 10 to 120 (15 * 10 = 150, not the listed totalStockValue of 1800; 15 * 120 = 1800)
// - "Sommersby Pear" corrected to "Somersby Pear" to match the "Somersby Apple" entry
export const seedItems: SeedItem[] = [
    { name: 'Carlsberg Pilsner', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'pilsner', abv: 4.6, volume: 33, averagePrice: 15, currentStock: 120, createdAt: new Date('2025-06-01'), updatedAt: new Date('2025-12-20') },
    { name: 'Tuborg Classic', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'pilsner', abv: 4.6, volume: 33, averagePrice: 15, currentStock: 95, createdAt: new Date('2025-06-02'), updatedAt: new Date('2025-12-21') },
    { name: 'Mikkeller IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'ipa', abv: 6.3, volume: 33, averagePrice: 25, currentStock: 48, createdAt: new Date('2025-06-03'), updatedAt: new Date('2025-12-22') },
    { name: 'Brooklyn Lager', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'lager', abv: 5.2, volume: 33, averagePrice: 22, currentStock: 64, createdAt: new Date('2025-06-04'), updatedAt: new Date('2025-12-23') },
    { name: 'Royal Unibrew', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'pilsner', abv: 4.6, volume: 33, averagePrice: 18, currentStock: 88, createdAt: new Date('2025-06-05'), updatedAt: new Date('2025-12-24') },
    { name: 'Guinness Stout', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'stout', abv: 4.2, volume: 44, averagePrice: 28, currentStock: 72, createdAt: new Date('2025-06-06'), updatedAt: new Date('2025-12-25') },
    { name: 'Somersby Apple', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'apple cider', abv: 4.5, volume: 33, averagePrice: 20, currentStock: 110, createdAt: new Date('2025-06-07'), updatedAt: new Date('2025-12-20') },
    { name: 'Somersby Pear', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'perry', abv: 4.5, volume: 33, averagePrice: 20, currentStock: 85, createdAt: new Date('2025-06-08'), updatedAt: new Date('2025-12-21') },
    { name: 'Strongbow Original', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'dry cider', abv: 5.0, volume: 33, averagePrice: 22, currentStock: 92, createdAt: new Date('2025-06-09'), updatedAt: new Date('2025-12-22') },
    { name: 'Rekorderlig Strawberry', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'fruit cider', abv: 4.0, volume: 33, averagePrice: 25, currentStock: 67, createdAt: new Date('2025-06-10'), updatedAt: new Date('2025-12-23') },
    { name: 'Chianti Classico', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'red', abv: 13.0, volume: 75, averagePrice: 45, currentStock: 36, createdAt: new Date('2025-06-11'), updatedAt: new Date('2025-12-24') },
    { name: 'Pinot Grigio', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'white', abv: 12.5, volume: 75, averagePrice: 35, currentStock: 42, createdAt: new Date('2025-06-12'), updatedAt: new Date('2025-12-25') },
    { name: 'Sauvignon Blanc', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'white', abv: 12.0, volume: 75, averagePrice: 38, currentStock: 38, createdAt: new Date('2025-06-13'), updatedAt: new Date('2025-12-26') },
    { name: 'Merlot Reserve', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'red', abv: 14.0, volume: 75, averagePrice: 42, currentStock: 29, createdAt: new Date('2025-06-14'), updatedAt: new Date('2025-12-27') },
    { name: 'Prosecco', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'sparkling', abv: 11.0, volume: 75, averagePrice: 40, currentStock: 55, createdAt: new Date('2025-06-15'), updatedAt: new Date('2025-12-20') },
    { name: 'Rosé Provence', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'rosé', abv: 12.5, volume: 75, averagePrice: 48, currentStock: 31, createdAt: new Date('2025-06-16'), updatedAt: new Date('2025-12-21') },
    { name: 'Jameson Irish Whiskey', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'whiskey', abv: 40.0, volume: 70, averagePrice: 65, currentStock: 24, createdAt: new Date('2025-06-17'), updatedAt: new Date('2025-12-22') },
    { name: 'Tanqueray Gin', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'gin', abv: 43.1, volume: 70, averagePrice: 55, currentStock: 32, createdAt: new Date('2025-06-18'), updatedAt: new Date('2025-12-23') },
    { name: 'Absolut Vodka', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'vodka', abv: 40.0, volume: 70, averagePrice: 60, currentStock: 28, createdAt: new Date('2025-06-19'), updatedAt: new Date('2025-12-24') },
    { name: 'Bacardi White Rum', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'rum', abv: 37.5, volume: 70, averagePrice: 50, currentStock: 35, createdAt: new Date('2025-06-20'), updatedAt: new Date('2025-12-25') },
    { name: 'Coca-Cola', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'coca cola', abv: 0, volume: 33, averagePrice: 12, currentStock: 200, createdAt: new Date('2025-06-21'), updatedAt: new Date('2025-12-26') },
    { name: 'Fanta Orange', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'fanta orange', abv: 0, volume: 33, averagePrice: 12, currentStock: 180, createdAt: new Date('2025-06-22'), updatedAt: new Date('2025-12-27') },
    { name: 'Sprite', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'other', abv: 0, volume: 33, averagePrice: 12, currentStock: 165, createdAt: new Date('2025-06-23'), updatedAt: new Date('2025-12-20') },
    { name: 'Sparkling Water', primaryCategory: PrimaryCategories.OTHER, secondaryCategory: 'sparkling water', abv: 0, volume: 50, averagePrice: 10, currentStock: 150, createdAt: new Date('2025-06-24'), updatedAt: new Date('2025-12-21') },
    { name: 'Still Water', primaryCategory: PrimaryCategories.OTHER, secondaryCategory: 'still water', abv: 0, volume: 50, averagePrice: 8, currentStock: 175, createdAt: new Date('2025-06-25'), updatedAt: new Date('2025-12-22') },

    // Additional Beer Types
    { name: 'Amber Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'amber ale', abv: 5.4, volume: 33, averagePrice: 24, currentStock: 45, createdAt: new Date('2025-07-01'), updatedAt: new Date('2025-12-23') },
    { name: 'American IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'american ipa', abv: 6.5, volume: 33, averagePrice: 26, currentStock: 52, createdAt: new Date('2025-07-02'), updatedAt: new Date('2025-12-24') },
    { name: 'Barleywine', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'barleywine', abv: 10.5, volume: 33, averagePrice: 35, currentStock: 28, createdAt: new Date('2025-07-03'), updatedAt: new Date('2025-12-25') },
    { name: 'Belgian Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'belgian ale', abv: 7.0, volume: 33, averagePrice: 30, currentStock: 38, createdAt: new Date('2025-07-04'), updatedAt: new Date('2025-12-26') },
    { name: 'Belgian IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'belgian ipa', abv: 6.8, volume: 33, averagePrice: 28, currentStock: 41, createdAt: new Date('2025-07-05'), updatedAt: new Date('2025-12-27') },
    { name: 'Black IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'black ipa', abv: 6.5, volume: 33, averagePrice: 27, currentStock: 33, createdAt: new Date('2025-07-06'), updatedAt: new Date('2025-12-28') },
    { name: 'Bock Beer', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'bock', abv: 6.7, volume: 33, averagePrice: 23, currentStock: 47, createdAt: new Date('2025-07-07'), updatedAt: new Date('2025-12-29') },
    { name: 'Brown Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'brown ale', abv: 5.0, volume: 33, averagePrice: 22, currentStock: 55, createdAt: new Date('2025-07-08'), updatedAt: new Date('2025-12-30') },
    { name: 'Cream Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'cream ale', abv: 4.8, volume: 33, averagePrice: 20, currentStock: 60, createdAt: new Date('2025-07-09'), updatedAt: new Date('2025-12-31') },
    { name: 'Double IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'double ipa', abv: 8.5, volume: 44, averagePrice: 32, currentStock: 36, createdAt: new Date('2025-07-10'), updatedAt: new Date('2026-01-01') },
    { name: 'East Coast IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'east coast ipa', abv: 6.2, volume: 33, averagePrice: 27, currentStock: 44, createdAt: new Date('2025-07-11'), updatedAt: new Date('2026-01-02') },
    { name: 'English IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'english ipa', abv: 5.5, volume: 33, averagePrice: 26, currentStock: 39, createdAt: new Date('2025-07-12'), updatedAt: new Date('2025-12-23') },
    { name: 'Hazy IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'hazy ipa', abv: 6.5, volume: 44, averagePrice: 29, currentStock: 51, createdAt: new Date('2025-07-13'), updatedAt: new Date('2025-12-24') },
    { name: 'Hefeweizen', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'hefeweizen', abv: 5.4, volume: 50, averagePrice: 24, currentStock: 46, createdAt: new Date('2025-07-14'), updatedAt: new Date('2025-12-25') },
    { name: 'Imperial IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'imperial ipa', abv: 9.2, volume: 33, averagePrice: 34, currentStock: 29, createdAt: new Date('2025-07-15'), updatedAt: new Date('2025-12-26') },
    { name: 'Kölsch', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'kolsch', abv: 4.8, volume: 33, averagePrice: 21, currentStock: 58, createdAt: new Date('2025-07-16'), updatedAt: new Date('2025-12-27') },
    { name: 'Milkshake IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'milkshake ipa', abv: 6.0, volume: 44, averagePrice: 30, currentStock: 35, createdAt: new Date('2025-07-17'), updatedAt: new Date('2025-12-28') },
    { name: 'New England IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'new england ipa', abv: 6.8, volume: 44, averagePrice: 31, currentStock: 42, createdAt: new Date('2025-07-18'), updatedAt: new Date('2025-12-29') },
    { name: 'Pale Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'pale ale', abv: 5.2, volume: 33, averagePrice: 23, currentStock: 63, createdAt: new Date('2025-07-19'), updatedAt: new Date('2025-12-30') },
    { name: 'Porter', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'porter', abv: 5.5, volume: 33, averagePrice: 25, currentStock: 49, createdAt: new Date('2025-07-20'), updatedAt: new Date('2025-12-31') },
    { name: 'Red Ale', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'red ale', abv: 5.0, volume: 33, averagePrice: 24, currentStock: 54, createdAt: new Date('2025-07-21'), updatedAt: new Date('2026-01-01') },
    { name: 'Saison', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'saison', abv: 6.5, volume: 33, averagePrice: 27, currentStock: 37, createdAt: new Date('2025-07-22'), updatedAt: new Date('2026-01-02') },
    { name: 'Session IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'session ipa', abv: 4.2, volume: 33, averagePrice: 22, currentStock: 68, createdAt: new Date('2025-07-23'), updatedAt: new Date('2025-12-23') },
    { name: 'Sour Beer', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'sour', abv: 5.0, volume: 33, averagePrice: 28, currentStock: 31, createdAt: new Date('2025-07-24'), updatedAt: new Date('2025-12-24') },
    { name: 'Triple IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'triple ipa', abv: 10.0, volume: 44, averagePrice: 36, currentStock: 24, createdAt: new Date('2025-07-25'), updatedAt: new Date('2025-12-25') },
    { name: 'West Coast IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'west coast ipa', abv: 7.0, volume: 33, averagePrice: 28, currentStock: 48, createdAt: new Date('2025-07-26'), updatedAt: new Date('2025-12-26') },
    { name: 'Wheat Beer', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'wheat beer', abv: 5.0, volume: 50, averagePrice: 22, currentStock: 57, createdAt: new Date('2025-07-27'), updatedAt: new Date('2025-12-27') },
    { name: 'White IPA', primaryCategory: PrimaryCategories.BEER, secondaryCategory: 'white ipa', abv: 6.0, volume: 33, averagePrice: 26, currentStock: 43, createdAt: new Date('2025-07-28'), updatedAt: new Date('2025-12-28') },

    // Additional Cider Types
    { name: 'Berry Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'berry cider', abv: 4.0, volume: 33, averagePrice: 23, currentStock: 74, createdAt: new Date('2025-08-01'), updatedAt: new Date('2025-12-29') },
    { name: 'Hard Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'hard cider', abv: 6.5, volume: 33, averagePrice: 24, currentStock: 68, createdAt: new Date('2025-08-02'), updatedAt: new Date('2025-12-30') },
    { name: 'Hopped Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'hopped cider', abv: 5.5, volume: 33, averagePrice: 26, currentStock: 52, createdAt: new Date('2025-08-03'), updatedAt: new Date('2025-12-31') },
    { name: 'Ice Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'ice cider', abv: 9.0, volume: 33, averagePrice: 35, currentStock: 28, createdAt: new Date('2025-08-04'), updatedAt: new Date('2026-01-01') },
    { name: 'Rosé Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'rosé cider', abv: 4.5, volume: 33, averagePrice: 25, currentStock: 61, createdAt: new Date('2025-08-05'), updatedAt: new Date('2026-01-02') },
    { name: 'Scrumpy', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'scrumpy', abv: 7.5, volume: 33, averagePrice: 21, currentStock: 48, createdAt: new Date('2025-08-06'), updatedAt: new Date('2025-12-23') },
    { name: 'Semi-Dry Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'semi-dry cider', abv: 5.0, volume: 33, averagePrice: 22, currentStock: 70, createdAt: new Date('2025-08-07'), updatedAt: new Date('2025-12-24') },
    { name: 'Semi-Sweet Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'semi-sweet cider', abv: 4.5, volume: 33, averagePrice: 23, currentStock: 65, createdAt: new Date('2025-08-08'), updatedAt: new Date('2025-12-25') },
    { name: 'Sweet Cider', primaryCategory: PrimaryCategories.CIDER, secondaryCategory: 'sweet cider', abv: 4.0, volume: 33, averagePrice: 24, currentStock: 72, createdAt: new Date('2025-08-09'), updatedAt: new Date('2025-12-26') },

    // Additional Wine Types
    { name: 'Champagne Brut', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'champagne', abv: 12.0, volume: 75, averagePrice: 85, currentStock: 22, createdAt: new Date('2025-08-10'), updatedAt: new Date('2025-12-27') },
    { name: 'Orange Wine', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'orange', abv: 13.5, volume: 75, averagePrice: 52, currentStock: 18, createdAt: new Date('2025-08-11'), updatedAt: new Date('2025-12-28') },
    { name: 'Port Wine', primaryCategory: PrimaryCategories.WINE, secondaryCategory: 'portwine', abv: 19.5, volume: 75, averagePrice: 68, currentStock: 26, createdAt: new Date('2025-08-12'), updatedAt: new Date('2025-12-29') },

    // Additional Spirit Types
    { name: 'Absinthe', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'absinthe', abv: 68.0, volume: 70, averagePrice: 75, currentStock: 12, createdAt: new Date('2025-08-13'), updatedAt: new Date('2025-12-30') },
    { name: 'Bourbon Whiskey', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'bourbon', abv: 45.0, volume: 70, averagePrice: 70, currentStock: 20, createdAt: new Date('2025-08-14'), updatedAt: new Date('2025-12-31') },
    { name: 'Brandy', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'brandy', abv: 40.0, volume: 70, averagePrice: 58, currentStock: 25, createdAt: new Date('2025-08-15'), updatedAt: new Date('2026-01-01') },
    { name: 'Cognac', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'cognac', abv: 40.0, volume: 70, averagePrice: 95, currentStock: 15, createdAt: new Date('2025-08-16'), updatedAt: new Date('2026-01-02') },
    { name: 'Irish Whiskey Premium', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'irish whiskey', abv: 43.0, volume: 70, averagePrice: 72, currentStock: 18, createdAt: new Date('2025-08-17'), updatedAt: new Date('2025-12-23') },
    { name: 'Liqueur', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'liqueur', abv: 20.0, volume: 70, averagePrice: 42, currentStock: 34, createdAt: new Date('2025-08-18'), updatedAt: new Date('2025-12-24') },
    { name: 'Mezcal', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'mezcal', abv: 45.0, volume: 70, averagePrice: 68, currentStock: 16, createdAt: new Date('2025-08-19'), updatedAt: new Date('2025-12-25') },
    { name: 'Rye Whiskey', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'rye whiskey', abv: 45.0, volume: 70, averagePrice: 66, currentStock: 21, createdAt: new Date('2025-08-20'), updatedAt: new Date('2025-12-26') },
    { name: 'Schnapps', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'schnapps', abv: 20.0, volume: 70, averagePrice: 38, currentStock: 42, createdAt: new Date('2025-08-21'), updatedAt: new Date('2025-12-27') },
    { name: 'Scotch Whisky', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'scotch', abv: 43.0, volume: 70, averagePrice: 78, currentStock: 19, createdAt: new Date('2025-08-22'), updatedAt: new Date('2025-12-28') },
    { name: 'Tequila Reposado', primaryCategory: PrimaryCategories.SPIRIT, secondaryCategory: 'tequila', abv: 40.0, volume: 70, averagePrice: 62, currentStock: 27, createdAt: new Date('2025-08-23'), updatedAt: new Date('2025-12-29') },

    // Additional Soda Types
    { name: 'Coca-Cola Zero', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'coca cola zero', abv: 0, volume: 33, averagePrice: 12, currentStock: 190, createdAt: new Date('2025-09-01'), updatedAt: new Date('2025-12-30') },
    { name: 'Faxe Kondi', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'faxe kondi', abv: 0, volume: 33, averagePrice: 13, currentStock: 140, createdAt: new Date('2025-09-02'), updatedAt: new Date('2025-12-31') },
    { name: 'Pepsi', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'pepsi', abv: 0, volume: 33, averagePrice: 12, currentStock: 185, createdAt: new Date('2025-09-03'), updatedAt: new Date('2026-01-01') },
    { name: 'Pepsi Max', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'pepsi max', abv: 0, volume: 33, averagePrice: 12, currentStock: 175, createdAt: new Date('2025-09-04'), updatedAt: new Date('2026-01-02') },
    { name: 'Schweppes Lemon', primaryCategory: PrimaryCategories.SODA, secondaryCategory: 'sweppes lemon', abv: 0, volume: 33, averagePrice: 13, currentStock: 125, createdAt: new Date('2025-09-05'), updatedAt: new Date('2025-12-23') },
];
