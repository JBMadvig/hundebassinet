// Base properties shared by all items
interface BaseItem {
    id: string;
    name: string;
    averagePrice: number;
    currentStock: number;
    totalStockValue: number;
    abv: number,
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
}

export type ItemSortValues = 'id' | 'name' | 'averagePrice' | 'curentStock' | 'totalStockValue' | 'createdAt' | 'updatedAt' | 'abv';

export type SortDirection = 'ascending' | 'descending';

export interface InventoryRequest {
    searchQuery?: string,
    sortBy: ItemSortValues,
    sortDirection: SortDirection,
    page: number,
    entriesPrPage: number,
}
export interface InventoryResponse {
    items: Item[],
    itemsInSearch: number,
    totalItems: number,
    searchParams: {
        searchQuery: string,
        sortBy: ItemSortValues,
        sortDirection: SortDirection,
        page: number,
        entriesPrPage: number,
        totalPagesWithCurrentLimit: number,
    }
}

// Types for primary and secondary categories
// Beer Categories
type BeerTypes =
    | 'amber ale'
    | 'american ipa'
    | 'barleywine'
    | 'belgian ale'
    | 'belgian ipa'
    | 'black ipa'
    | 'bock'
    | 'brown ale'
    | 'cream ale'
    | 'double ipa'
    | 'east coast ipa'
    | 'english ipa'
    | 'hazy ipa'
    | 'hefeweizen'
    | 'imperial ipa'
    | 'ipa'
    | 'kolsch'
    | 'lager'
    | 'milkshake ipa'
    | 'new england ipa'
    | 'pale ale'
    | 'pilsner'
    | 'porter'
    | 'red ale'
    | 'saison'
    | 'session ipa'
    | 'sour'
    | 'stout'
    | 'triple ipa'
    | 'west coast ipa'
    | 'wheat beer'
    | 'white ipa';

// Discriminated union for each primary category with its specific secondary categories
interface BeerItem extends BaseItem {
    primaryItemCategory: 'beer';
    secondaryItemCategory: BeerTypes | 'other';
}

// Cider Categories
type CiderTypes =
    'apple cider'
    | 'berry cider'
    | 'dry cider'
    | 'fruit cider'
    | 'hard cider'
    | 'hopped cider'
    | 'ice cider'
    | 'perry'
    | 'rosé cider'
    | 'scrumpy'
    | 'semi-dry cider'
    | 'semi-sweet cider'
    | 'sweet cider';

interface CiderItem extends BaseItem {
    primaryItemCategory: 'cider';
    secondaryItemCategory: CiderTypes | 'other';
}

type SodaTypes =
    | 'coca cola'
    | 'coca cola zero'
    | 'fanta orange'
    | 'faxe kondi'
    | 'pepsi'
    | 'pepsi max'
    | 'sweppes lemon';

interface SodaItem extends BaseItem {
    primaryItemCategory: 'soda';
    secondaryItemCategory: SodaTypes | 'other';
}

//Wine Gategories
type WineTypes =
    'champagne'
    | 'orange'
    | 'portwine'
    | 'red'
    | 'rosé'
    | 'sparkling'
    | 'white';

interface WineItem extends BaseItem {
    primaryItemCategory: 'wine';
    secondaryItemCategory: WineTypes | 'other';
}

// Spirit Categories
type SpiritTypes =
  | 'absinthe'
  | 'bourbon'
  | 'brandy'
  | 'cognac'
  | 'gin'
  | 'irish whiskey'
  | 'liqueur'
  | 'mezcal'
  | 'rum'
  | 'rye whiskey'
  | 'schnapps'
  | 'scotch'
  | 'tequila'
  | 'vodka'
  | 'whiskey';

interface SpiritItem extends BaseItem {
    primaryItemCategory: 'spirit';
    secondaryItemCategory: SpiritTypes | 'other';
}

interface OtherItem extends BaseItem {
    primaryItemCategory: 'other';
    secondaryItemCategory: string;
}

// Union type that TypeScript can discriminate on primaryItemCategory
export type Item = BeerItem | CiderItem | SodaItem | WineItem | SpiritItem | OtherItem;

export type PrimaryItemCategoriesType = Item['primaryItemCategory'];
export type SecondaryItemCategoriesType =
    | BeerTypes
    | CiderTypes
    | SodaTypes
    | WineTypes
    | SpiritTypes
    | 'other';

export type ItemWithQuantity = Item & { quantity: number };
