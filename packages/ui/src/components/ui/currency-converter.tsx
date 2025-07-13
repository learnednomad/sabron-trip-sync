import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { 
  ArrowUpDown, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Calculator,
  Globe,
  History,
  Star,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const currencyConverterVariants = cva(
  'relative w-full bg-background border rounded-lg',
  {
    variants: {
      preset: {
        default: 'border-border',
        travel: 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200',
        minimal: 'border-0 shadow-none bg-transparent',
        compact: 'border-border p-3',
      },
      size: {
        small: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
      layout: {
        vertical: 'space-y-4',
        horizontal: 'flex space-x-4',
        compact: 'space-y-2',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
      layout: 'vertical',
    },
  }
);

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  rate?: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change24h: number;
  lastUpdated: Date;
}

export interface CurrencyConverterProps
  extends VariantProps<typeof currencyConverterVariants> {
  // Currencies
  fromCurrency?: Currency;
  toCurrency?: Currency;
  availableCurrencies?: Currency[];
  
  // Amounts
  fromAmount?: number;
  toAmount?: number;
  
  // Events
  onFromCurrencyChange?: (currency: Currency) => void;
  onToCurrencyChange?: (currency: Currency) => void;
  onFromAmountChange?: (amount: number) => void;
  onSwapCurrencies?: () => void;
  onConvert?: (from: Currency, to: Currency, amount: number) => void;
  
  // Exchange rate data
  exchangeRate?: ExchangeRate;
  historicalRates?: Array<{ date: Date; rate: number }>;
  
  // Features
  showChart?: boolean;
  showHistory?: boolean;
  showTrendIndicator?: boolean;
  showRateAlert?: boolean;
  enableFavorites?: boolean;
  
  // Travel features
  showTravelTips?: boolean;
  showOfflineRates?: boolean;
  destinationCountry?: string;
  
  // Labels
  fromLabelTx?: string;
  toLabelTx?: string;
  convertButtonTx?: string;
  
  // Styling
  className?: string;
  inputClassName?: string;
  
  // States
  loading?: boolean;
  error?: string;
  offline?: boolean;
  
  // Custom renderers
  renderCurrencyFlag?: (currency: Currency) => React.ReactNode;
  renderTravelTip?: (from: Currency, to: Currency) => React.ReactNode;
}

export const CurrencyConverter = React.forwardRef<HTMLDivElement, CurrencyConverterProps>(
  ({
    preset,
    size,
    layout,
    fromCurrency,
    toCurrency,
    availableCurrencies = [],
    fromAmount = 1,
    toAmount,
    onFromCurrencyChange,
    onToCurrencyChange,
    onFromAmountChange,
    onSwapCurrencies,
    onConvert,
    exchangeRate,
    historicalRates = [],
    showHistory = false,
    showTrendIndicator = true,
    enableFavorites = true,
    showTravelTips = true,
    fromLabelTx = 'currency.from',
    toLabelTx = 'currency.to',
    convertButtonTx = 'currency.convert',
    className,
    inputClassName,
    loading = false,
    error,
    offline = false,
    renderCurrencyFlag,
    renderTravelTip,
  }, ref) => {
    const { t } = useTranslation();
    const [calculating, setCalculating] = useState(false);
    const [favorites, setFavorites] = useState<Currency[]>([]);
    const [showCurrencyList, setShowCurrencyList] = useState<'from' | 'to' | null>(null);
    
    // Popular travel currencies
    const popularCurrencies = [
      { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
      { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
      { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    ];
    
    const currencies = availableCurrencies.length > 0 ? availableCurrencies : popularCurrencies;
    
    const formatAmount = (amount: number, currency: Currency) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(amount);
    };
    
    const calculateConversion = async () => {
      if (!fromCurrency || !toCurrency || !fromAmount) return;
      
      setCalculating(true);
      try {
        await onConvert?.(fromCurrency, toCurrency, fromAmount);
      } finally {
        setCalculating(false);
      }
    };
    
    const handleSwap = () => {
      if (!fromCurrency || !toCurrency) return;
      
      onSwapCurrencies?.();
      // Also swap the currencies in local state if not controlled
      if (!onFromCurrencyChange || !onToCurrencyChange) return;
      
      const tempFrom = fromCurrency;
      onFromCurrencyChange(toCurrency);
      onToCurrencyChange(tempFrom);
    };
    
    const toggleFavorite = (currency: Currency) => {
      if (!enableFavorites) return;
      
      setFavorites(prev => {
        const exists = prev.find(c => c.code === currency.code);
        if (exists) {
          return prev.filter(c => c.code !== currency.code);
        } else {
          return [...prev, currency];
        }
      });
    };
    
    const getTrendIcon = () => {
      if (!exchangeRate || !showTrendIndicator) return null;
      
      if (exchangeRate.change24h > 0) {
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      } else if (exchangeRate.change24h < 0) {
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      }
      return null;
    };
    
    const renderCurrencyInput = (
      type: 'from' | 'to',
      currency: Currency | undefined,
      amount: number | undefined,
      label: string,
      onAmountChange?: (amount: number) => void
    ) => (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t(label)}</label>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCurrencyList(type)}
            className="flex items-center space-x-2 px-3 py-2 border rounded-lg bg-background hover:bg-muted transition-colors min-w-0 flex-shrink-0"
          >
            {currency ? (
              <>
                {renderCurrencyFlag ? renderCurrencyFlag(currency) : (
                  <span className="text-lg">{currency.flag || '💱'}</span>
                )}
                <span className="font-medium">{currency.code}</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Select</span>
              </>
            )}
          </button>
          
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onAmountChange?.(value);
            }}
            placeholder="0.00"
            className={cn(
              'flex-1 px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500',
              type === 'to' && 'text-right font-semibold',
              inputClassName
            )}
            readOnly={type === 'to'}
          />
        </div>
        
        {currency && amount && (
          <div className="text-xs text-muted-foreground">
            {formatAmount(amount, currency)}
          </div>
        )}
      </div>
    );
    
    const renderCurrencySelector = () => {
      if (!showCurrencyList) return null;
      
      return (
        <div className="absolute inset-0 bg-background border rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Select Currency</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCurrencyList(null)}
            >
              ×
            </Button>
          </div>
          
          {enableFavorites && favorites.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Favorites</div>
              <div className="grid grid-cols-2 gap-2">
                {favorites.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      if (showCurrencyList === 'from') {
                        onFromCurrencyChange?.(currency);
                      } else {
                        onToCurrencyChange?.(currency);
                      }
                      setShowCurrencyList(null);
                    }}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-muted transition-colors"
                  >
                    <span>{currency.flag || '💱'}</span>
                    <span className="font-medium">{currency.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="max-h-64 overflow-y-auto space-y-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  if (showCurrencyList === 'from') {
                    onFromCurrencyChange?.(currency);
                  } else {
                    onToCurrencyChange?.(currency);
                  }
                  setShowCurrencyList(null);
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{currency.flag || '💱'}</span>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-sm text-muted-foreground">{currency.name}</div>
                  </div>
                </div>
                
                {enableFavorites && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(currency);
                    }}
                  >
                    <Star 
                      className={cn(
                        'w-4 h-4',
                        favorites.find(c => c.code === currency.code) 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-muted-foreground'
                      )} 
                    />
                  </Button>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    };
    
    const renderExchangeRateInfo = () => {
      if (!exchangeRate) return null;
      
      return (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              1 {exchangeRate.from} = {exchangeRate.rate.toFixed(4)} {exchangeRate.to}
            </span>
            {getTrendIcon()}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {offline ? 'Offline rates' : `Updated ${exchangeRate.lastUpdated.toLocaleTimeString()}`}
          </div>
        </div>
      );
    };
    
    const renderTravelTips = () => {
      if (!showTravelTips || !fromCurrency || !toCurrency) return null;
      
      if (renderTravelTip) {
        return renderTravelTip(fromCurrency, toCurrency);
      }
      
      return (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-1">Travel Tip</div>
              <div className="text-blue-700">
                Consider withdrawing cash from ATMs at your destination for better exchange rates.
                Notify your bank about your travel plans to avoid card blocks.
              </div>
            </div>
          </div>
        </div>
      );
    };

    if (loading) {
      return (
        <div className={cn(currencyConverterVariants({ preset, size, layout }), className)} ref={ref}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading rates...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(currencyConverterVariants({ preset, size, layout }), className)} ref={ref}>
        {showCurrencyList && renderCurrencySelector()}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-foreground">Currency Converter</h3>
          </div>
          
          {offline && (
            <div className="flex items-center space-x-1 text-xs text-orange-600">
              <Globe className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {/* Currency inputs */}
        <div className="space-y-4">
          {renderCurrencyInput(
            'from',
            fromCurrency,
            fromAmount,
            fromLabelTx,
            onFromAmountChange
          )}
          
          {/* Swap button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              disabled={!fromCurrency || !toCurrency}
              className="rounded-full"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
          
          {renderCurrencyInput(
            'to',
            toCurrency,
            toAmount,
            toLabelTx
          )}
        </div>
        
        {/* Convert button */}
        <Button
          onClick={calculateConversion}
          disabled={!fromCurrency || !toCurrency || !fromAmount || calculating}
          className="w-full mt-4"
        >
          {calculating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Calculator className="w-4 h-4 mr-2" />
          )}
          {t(convertButtonTx)}
        </Button>
        
        {/* Exchange rate info */}
        {renderExchangeRateInfo()}
        
        {/* Travel tips */}
        {renderTravelTips()}
        
        {/* History link */}
        {showHistory && historicalRates.length > 0 && (
          <Button variant="ghost" size="sm" className="w-full mt-2">
            <History className="w-4 h-4 mr-2" />
            View Rate History
          </Button>
        )}
      </div>
    );
  }
);

CurrencyConverter.displayName = 'CurrencyConverter';

export { currencyConverterVariants };