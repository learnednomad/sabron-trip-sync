import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Plane } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const travelDatePickerVariants = cva(
  'relative w-full',
  {
    variants: {
      preset: {
        default: '',
        travel: 'bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4',
        compact: 'p-2',
        fullwidth: 'w-full',
      },
      type: {
        single: '',
        range: '',
        multiCity: '',
        roundTrip: '',
      },
    },
    defaultVariants: {
      preset: 'travel',
      type: 'roundTrip',
    },
  }
);

export interface TravelDatePickerProps
  extends VariantProps<typeof travelDatePickerVariants> {
  // Date values
  departureDate?: Date;
  returnDate?: Date;
  dates?: Date[];
  
  // Events
  onDepartureDateChange?: (date: Date) => void;
  onReturnDateChange?: (date: Date) => void;
  onDatesChange?: (dates: Date[]) => void;
  
  // Labels
  departureLabelTx?: string;
  returnLabelTx?: string;
  
  // Validation
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  
  // Travel specific
  showFlightTimes?: boolean;
  departureTime?: string;
  returnTime?: string;
  onDepartureTimeChange?: (time: string) => void;
  onReturnTimeChange?: (time: string) => void;
  
  // Destinations (for multi-city)
  origins?: string[];
  destinations?: string[];
  
  // Styling
  className?: string;
  
  // States
  disabled?: boolean;
  loading?: boolean;
}

export const TravelDatePicker = React.forwardRef<HTMLDivElement, TravelDatePickerProps>(
  ({
    preset,
    type,
    departureDate,
    returnDate,
    dates,
    onDatesChange,
    departureLabelTx = 'common.departure',
    returnLabelTx = 'common.return',
    showFlightTimes = false,
    departureTime,
    returnTime,
    origins,
    destinations,
    className,
    disabled = false,
    loading = false,
  }, ref) => {
    const { t } = useTranslation();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    };
    
    const renderSingleDatePicker = () => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{t(departureLabelTx)}</span>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled || loading}
        >
          {departureDate ? formatDate(departureDate) : t('common.selectDate')}
        </Button>
        {showFlightTimes && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <input
              type="time"
              value={departureTime}
              className="border rounded px-2 py-1 text-sm"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    );
    
    const renderRoundTripPicker = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-blue-500 rotate-45" />
            <span className="font-medium">{t(departureLabelTx)}</span>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled || loading}
          >
            {departureDate ? formatDate(departureDate) : t('common.selectDate')}
          </Button>
          {showFlightTimes && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <input
                type="time"
                value={departureTime}
                className="border rounded px-2 py-1 text-sm"
                disabled={disabled}
              />
            </div>
          )}
        </div>
        
        {/* Return */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-green-500 -rotate-45" />
            <span className="font-medium">{t(returnLabelTx)}</span>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled || loading || !departureDate}
          >
            {returnDate ? formatDate(returnDate) : t('common.selectDate')}
          </Button>
          {showFlightTimes && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <input
                type="time"
                value={returnTime}
                className="border rounded px-2 py-1 text-sm"
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
    );
    
    const renderMultiCityPicker = () => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-purple-500" />
          <span className="font-medium">Multi-City Trip</span>
        </div>
        {dates?.map((date, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {origins?.[index]} → {destinations?.[index]}
              </div>
              <div className="font-medium">{formatDate(date)}</div>
            </div>
            {showFlightTimes && (
              <input
                type="time"
                className="border rounded px-2 py-1 text-sm"
                disabled={disabled}
              />
            )}
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const newDate = new Date();
            onDatesChange?.([...(dates || []), newDate]);
          }}
        >
          Add Flight
        </Button>
      </div>
    );
    
    const renderContent = () => {
      switch (type) {
        case 'single':
          return renderSingleDatePicker();
        case 'range':
          return renderRoundTripPicker();
        case 'multiCity':
          return renderMultiCityPicker();
        case 'roundTrip':
        default:
          return renderRoundTripPicker();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(travelDatePickerVariants({ preset, type }), className)}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    );
  }
);

TravelDatePicker.displayName = 'TravelDatePicker';

export { travelDatePickerVariants };