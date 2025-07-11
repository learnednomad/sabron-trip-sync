'use client';

import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Label } from './label';
import { Badge } from './badge';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Star, 
  Camera, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  AlertTriangle,
  Heart,
  Tag,
  Globe
} from 'lucide-react';

export interface TravelLogData {
  id?: string;
  title: string;
  description?: string;
  visitDate: Date;
  rating?: number;
  photos?: string[];
  memories?: string;
  highlights?: string[];
  recommendations?: string;
  wouldReturn?: boolean;
  publiclyVisible?: boolean;
  tags?: string[];
  weather?: {
    temperature: number;
    condition: string;
    humidity?: number;
  };
  companions?: string[];
  expenses?: {
    total: number;
    currency: string;
    breakdown?: { category: string; amount: number }[];
  };
  tips?: string;
  warningsAdvice?: string;
  bestTimeToVisit?: {
    season: string;
    months: string[];
    reasons: string;
  };
  accessibility?: {
    wheelchairAccessible: boolean;
    notes?: string;
  };
  culturalNotes?: string;
  transportation?: {
    method: string;
    duration?: string;
    cost?: number;
    notes?: string;
  };
}

export interface TravelLogFormProps {
  value?: Partial<TravelLogData>;
  onChange: (data: Partial<TravelLogData>) => void;
  onSubmit: (data: TravelLogData) => void;
  onCancel?: () => void;
  locationName?: string;
  disabled?: boolean;
  className?: string;
}

export function TravelLogForm({
  value = {},
  onChange,
  onSubmit,
  onCancel,
  locationName,
  disabled = false,
  className
}: TravelLogFormProps) {
  const [formData, setFormData] = useState<Partial<TravelLogData>>({
    title: '',
    description: '',
    visitDate: new Date(),
    rating: undefined,
    memories: '',
    recommendations: '',
    wouldReturn: undefined,
    publiclyVisible: true,
    tips: '',
    warningsAdvice: '',
    culturalNotes: '',
    highlights: [],
    tags: [],
    companions: [],
    ...value
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newCompanion, setNewCompanion] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFormData = (updates: Partial<TravelLogData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onChange(newData);
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      const highlights = [...(formData.highlights || []), newHighlight.trim()];
      updateFormData({ highlights });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    const highlights = formData.highlights?.filter((_, i) => i !== index) || [];
    updateFormData({ highlights });
  };

  const addTag = () => {
    if (newTag.trim()) {
      const tags = [...(formData.tags || []), newTag.trim()];
      updateFormData({ tags });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const tags = formData.tags?.filter((_, i) => i !== index) || [];
    updateFormData({ tags });
  };

  const addCompanion = () => {
    if (newCompanion.trim()) {
      const companions = [...(formData.companions || []), newCompanion.trim()];
      updateFormData({ companions });
      setNewCompanion('');
    }
  };

  const removeCompanion = (index: number) => {
    const companions = formData.companions?.filter((_, i) => i !== index) || [];
    updateFormData({ companions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.visitDate) {
      onSubmit(formData as TravelLogData);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateFormData({ rating: star })}
            disabled={disabled}
            className={cn(
              "h-6 w-6 transition-colors",
              formData.rating && star <= formData.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            )}
          >
            <Star className="h-full w-full" />
          </button>
        ))}
        {formData.rating && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => updateFormData({ rating: undefined })}
            disabled={disabled}
            className="ml-2 h-6 px-2 text-xs"
          >
            Clear
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Travel Log Entry
          {locationName && (
            <Badge variant="secondary" className="ml-2">
              <MapPin className="h-3 w-3 mr-1" />
              {locationName}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Share your travel experience and memories
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="Give your experience a memorable title"
                disabled={disabled}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe your overall experience..."
                disabled={disabled}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visit Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.visitDate && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.visitDate ? (
                        format(formData.visitDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.visitDate}
                      onSelect={(date) => updateFormData({ visitDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Overall Rating</Label>
                {renderStarRating()}
              </div>
            </div>
          </div>

          {/* Memories and Highlights */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memories">Memories & Experiences</Label>
              <Textarea
                id="memories"
                value={formData.memories}
                onChange={(e) => updateFormData({ memories: e.target.value })}
                placeholder="Share your favorite memories and experiences from this visit..."
                disabled={disabled}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Highlights</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight..."
                  disabled={disabled}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                />
                <Button
                  type="button"
                  onClick={addHighlight}
                  disabled={disabled || !newHighlight.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              {formData.highlights && formData.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        disabled={disabled}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                value={formData.recommendations}
                onChange={(e) => updateFormData({ recommendations: e.target.value })}
                placeholder="What would you recommend to other travelers?"
                disabled={disabled}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Would you return?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.wouldReturn === true ? "default" : "outline"}
                  onClick={() => updateFormData({ wouldReturn: true })}
                  disabled={disabled}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Yes, definitely!
                </Button>
                <Button
                  type="button"
                  variant={formData.wouldReturn === false ? "default" : "outline"}
                  onClick={() => updateFormData({ wouldReturn: false })}
                  disabled={disabled}
                >
                  No, once was enough
                </Button>
              </div>
            </div>
          </div>

          {/* Tags and Companions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags..."
                  disabled={disabled}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={disabled || !newTag.trim()}
                  size="sm"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        disabled={disabled}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Travel Companions</Label>
              <div className="flex gap-2">
                <Input
                  value={newCompanion}
                  onChange={(e) => setNewCompanion(e.target.value)}
                  placeholder="Who did you travel with?"
                  disabled={disabled}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompanion())}
                />
                <Button
                  type="button"
                  onClick={addCompanion}
                  disabled={disabled || !newCompanion.trim()}
                  size="sm"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              {formData.companions && formData.companions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.companions.map((companion, index) => (
                    <Badge key={index} variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {companion}
                      <button
                        type="button"
                        onClick={() => removeCompanion(index)}
                        disabled={disabled}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Advanced Sections */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Information
            </Button>

            {showAdvanced && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="tips">Tips for Other Travelers</Label>
                  <Textarea
                    id="tips"
                    value={formData.tips}
                    onChange={(e) => updateFormData({ tips: e.target.value })}
                    placeholder="Share practical tips and advice..."
                    disabled={disabled}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warnings">Warnings & Advice</Label>
                  <Textarea
                    id="warnings"
                    value={formData.warningsAdvice}
                    onChange={(e) => updateFormData({ warningsAdvice: e.target.value })}
                    placeholder="Any warnings or important advice for other travelers?"
                    disabled={disabled}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cultural">Cultural Notes</Label>
                  <Textarea
                    id="cultural"
                    value={formData.culturalNotes}
                    onChange={(e) => updateFormData({ culturalNotes: e.target.value })}
                    placeholder="Share cultural insights, customs, or etiquette tips..."
                    disabled={disabled}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="space-y-2">
            <Label>Privacy</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={formData.publiclyVisible ? "default" : "outline"}
                onClick={() => updateFormData({ publiclyVisible: true })}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Public
              </Button>
              <Button
                type="button"
                variant={!formData.publiclyVisible ? "default" : "outline"}
                onClick={() => updateFormData({ publiclyVisible: false })}
                disabled={disabled}
              >
                Private
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={disabled || !formData.title || !formData.visitDate}
              className="flex-1"
            >
              Save Travel Log
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}