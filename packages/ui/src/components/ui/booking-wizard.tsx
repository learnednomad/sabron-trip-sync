import * as React from 'react';
import { useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const bookingWizardVariants = cva(
  'w-full max-w-4xl mx-auto',
  {
    variants: {
      preset: {
        default: 'bg-background border rounded-lg',
        travel: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl',
        minimal: 'bg-transparent',
        elevated: 'bg-background shadow-xl rounded-xl border',
      },
      size: {
        small: 'p-4',
        default: 'p-6',
        large: 'p-8',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
    },
  }
);

export interface BookingStep {
  id: string;
  title: string;
  titleTx?: string;
  description?: string;
  descriptionTx?: string;
  icon?: React.ReactNode;
  component: React.ComponentType<BookingStepProps>;
  validation?: () => boolean | Promise<boolean>;
  optional?: boolean;
}

export interface BookingStepProps {
  data: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface BookingWizardProps
  extends VariantProps<typeof bookingWizardVariants> {
  // Steps configuration
  steps: BookingStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  
  // Data management
  data?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
  
  // Completion
  onComplete?: (data: Record<string, any>) => void | Promise<void>;
  
  // Labels
  nextButtonTx?: string;
  previousButtonTx?: string;
  completeButtonTx?: string;
  
  // Behavior
  allowStepSkipping?: boolean;
  showStepNumbers?: boolean;
  showProgressBar?: boolean;
  autoAdvance?: boolean;
  
  // Styling
  className?: string;
  stepperClassName?: string;
  contentClassName?: string;
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Validation
  errors?: Record<string, Record<string, string>>;
  
  // Custom renderers
  renderStep?: (step: BookingStep, index: number, isActive: boolean, isCompleted: boolean) => React.ReactNode;
  renderStepContent?: (step: BookingStep, props: BookingStepProps) => React.ReactNode;
}

export const BookingWizard = React.forwardRef<HTMLDivElement, BookingWizardProps>(
  ({
    preset,
    size,
    steps,
    currentStep = 0,
    onStepChange,
    data = {},
    onDataChange,
    onComplete,
    nextButtonTx = 'common.next',
    previousButtonTx = 'common.previous',
    completeButtonTx = 'common.complete',
    allowStepSkipping = false,
    showStepNumbers = true,
    showProgressBar = true,
    autoAdvance = false,
    className,
    stepperClassName,
    contentClassName,
    loading = false,
    disabled = false,
    errors = {},
    renderStep,
    renderStepContent,
  }, ref) => {
    const { t } = useTranslation();
    const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [stepLoading, setStepLoading] = useState(false);
    const [stepData, setStepData] = useState(data);
    
    const currentStepObj = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;
    
    useEffect(() => {
      onStepChange?.(currentStepIndex);
    }, [currentStepIndex, onStepChange]);
    
    useEffect(() => {
      setStepData(data);
    }, [data]);
    
    const handleDataChange = (newData: Record<string, any>) => {
      const updatedData = { ...stepData, ...newData };
      setStepData(updatedData);
      onDataChange?.(updatedData);
    };
    
    const validateCurrentStep = async () => {
      if (!currentStepObj.validation) return true;
      
      setStepLoading(true);
      try {
        const isValid = await currentStepObj.validation();
        return isValid;
      } catch (error) {
        console.error('Step validation error:', error);
        return false;
      } finally {
        setStepLoading(false);
      }
    };
    
    const handleNext = async () => {
      if (disabled || stepLoading) return;
      
      const isValid = await validateCurrentStep();
      if (!isValid) return;
      
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      
      if (isLastStep) {
        // Complete the wizard
        try {
          setStepLoading(true);
          await onComplete?.(stepData);
        } catch (error) {
          console.error('Completion error:', error);
        } finally {
          setStepLoading(false);
        }
      } else {
        // Move to next step
        setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
      }
    };
    
    const handlePrevious = () => {
      if (disabled || stepLoading || isFirstStep) return;
      setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    };
    
    const handleStepClick = (stepIndex: number) => {
      if (disabled || stepLoading) return;
      if (!allowStepSkipping && stepIndex > currentStepIndex) return;
      
      setCurrentStepIndex(stepIndex);
    };
    
    const renderProgressBar = () => {
      if (!showProgressBar) return null;
      
      const progress = ((currentStepIndex + 1) / steps.length) * 100;
      
      return (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    };
    
    const renderStepper = () => {
      return (
        <div className={cn('flex items-center justify-between mb-8', stepperClassName)}>
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = completedSteps.has(index);
            const isClickable = allowStepSkipping || index <= currentStepIndex;
            
            if (renderStep) {
              return renderStep(step, index, isActive, isCompleted);
            }
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable || disabled}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200',
                    isActive && 'bg-blue-600 text-white ring-4 ring-blue-200',
                    isCompleted && !isActive && 'bg-green-600 text-white',
                    !isActive && !isCompleted && 'bg-gray-200 text-gray-600 hover:bg-gray-300',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : showStepNumbers ? (
                    index + 1
                  ) : (
                    step.icon
                  )}
                </button>
                
                <div className="text-center mt-2">
                  <div className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  )}>
                    {step.titleTx ? t(step.titleTx) : step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.descriptionTx ? t(step.descriptionTx) : step.description}
                    </div>
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    'absolute h-0.5 bg-gray-200 transition-colors duration-200',
                    'top-5 left-1/2 transform -translate-y-1/2',
                    isCompleted && 'bg-green-600'
                  )} style={{ width: 'calc(100% - 2.5rem)' }} />
                )}
              </div>
            );
          })}
        </div>
      );
    };
    
    const renderStepComponent = () => {
      const stepProps: BookingStepProps = {
        data: stepData,
        onDataChange: handleDataChange,
        onNext: autoAdvance ? handleNext : undefined,
        onPrevious: autoAdvance ? handlePrevious : undefined,
        isLoading: stepLoading,
        errors: errors[currentStepObj.id] || {},
      };
      
      if (renderStepContent) {
        return renderStepContent(currentStepObj, stepProps);
      }
      
      const StepComponent = currentStepObj.component;
      return <StepComponent {...stepProps} />;
    };
    
    const renderNavigation = () => {
      if (autoAdvance) return null;
      
      return (
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep || disabled || stepLoading}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t(previousButtonTx)}</span>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={disabled || stepLoading}
            className="flex items-center space-x-2"
          >
            {stepLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLastStep ? (
              <span>{t(completeButtonTx)}</span>
            ) : (
              <>
                <span>{t(nextButtonTx)}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(bookingWizardVariants({ preset, size }), className)}
      >
        {renderProgressBar()}
        {renderStepper()}
        
        <div className={cn('min-h-[400px]', contentClassName)}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            renderStepComponent()
          )}
        </div>
        
        {renderNavigation()}
      </div>
    );
  }
);

BookingWizard.displayName = 'BookingWizard';

export { bookingWizardVariants };