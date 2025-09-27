import React, { useState, useEffect } from "react";
import { Button } from "@/components/health-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/health-ui/card";
import { Input } from "@/components/health-ui/input";
import { Label } from "@/components/health-ui/label";
import { Textarea } from "@/components/health-ui/textarea";
import { Calendar } from "@/components/health-ui/calendar";
import { Badge } from "@/components/health-ui/badge";
import { useToast } from "@/hooks/health-hooks/use-toast";
import { cn } from "@/lib/health-lib/utils";
import {
  Calendar as CalendarIcon,
  Heart,
  Droplets,
  Activity,
  TrendingUp,
  Plus
} from "lucide-react";
import { format, addDays, subDays, differenceInDays, parseISO, isValid } from "date-fns";

const MenstrualTracker = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPeriodDate, setCurrentPeriodDate] = useState("");
  const [avgPeriodDuration, setAvgPeriodDuration] = useState(5);
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [cycles, setCycles] = useState([
    {
      id: '1',
      startDate: new Date(2025, 8, 21), // September 21, 2025
      flow: 'medium',
      symptoms: [],
      mood: 'normal',
      notes: 'Current cycle'
    },
    {
      id: '2',
      startDate: new Date(2025, 7, 24), // August 24, 2025
      endDate: new Date(2025, 7, 29), // August 29, 2025
      flow: 'medium',
      symptoms: ['cramps'],
      mood: 'irritable',
      notes: 'Normal cycle'
    }
  ]);

  const [currentMood, setCurrentMood] = useState("");
  const [currentSymptoms, setCurrentSymptoms] = useState([]);
  const [currentFlow, setCurrentFlow] = useState('medium');
  const [currentNotes, setCurrentNotes] = useState("");

  const calculateCycleInfo = () => {
    // Use parseISO for yyyy-MM-dd strings from the date input to avoid timezone issues
    const inputDate = currentPeriodDate ? parseISO(currentPeriodDate) : null;
    const baseDate = inputDate && isValid(inputDate)
      ? inputDate 
      : (cycles.length > 0 ? cycles[cycles.length - 1].startDate : new Date());

    const nextPeriod = addDays(baseDate, avgCycleLength);
    const ovulationDate = addDays(baseDate, Math.floor(avgCycleLength / 2));
    const fertileStart = subDays(ovulationDate, 5);
    const fertileEnd = addDays(ovulationDate, 1);

    const today = new Date();
    const daysUntilPeriod = differenceInDays(nextPeriod, today);

    return {
      nextPeriod,
      ovulationDate,
      fertileStart,
      fertileEnd,
      avgCycleLength,
      avgPeriodDuration,
      daysUntilPeriod: daysUntilPeriod >= 0 ? daysUntilPeriod : 0
    };
  };

  // Use local storage to persist data
  useEffect(() => {
    const savedCycles = localStorage.getItem('menstrual-cycles');
    if (savedCycles) {
      const parsedCycles = JSON.parse(savedCycles).map((cycle) => ({
        ...cycle,
        startDate: new Date(cycle.startDate),
        endDate: cycle.endDate ? new Date(cycle.endDate) : undefined
      }));
      setCycles(parsedCycles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('menstrual-cycles', JSON.stringify(cycles));
  }, [cycles]);

  const cycleInfo = calculateCycleInfo();

  const getDayInfo = (date) => {
    const dayEntry = {
      date,
      isPeriod: false,
      isOvulation: false,
      isFertile: false,
      symptoms: []
    };

    // Check if this date falls within any period
    for (const cycle of cycles) {
      if (date >= cycle.startDate &&
          (cycle.endDate ? date <= cycle.endDate : differenceInDays(date, cycle.startDate) < avgPeriodDuration)) {
        dayEntry.isPeriod = true;
        dayEntry.flow = cycle.flow;
        break;
      }
    }

    // Check if this is ovulation or fertile window
    if (cycleInfo) {
      const daysDiff = differenceInDays(date, cycleInfo.ovulationDate);
      if (daysDiff === 0) {
        dayEntry.isOvulation = true;
      } else if (date >= cycleInfo.fertileStart && date <= cycleInfo.fertileEnd) {
        dayEntry.isFertile = true;
      }
    }

    return dayEntry;
  };

  const logPeriodDay = () => {
    if (!selectedDate) return;
    
    // Check if a cycle already exists for this date
    const existingCycleIndex = cycles.findIndex(cycle =>
      selectedDate >= cycle.startDate &&
      (cycle.endDate ? selectedDate <= cycle.endDate : differenceInDays(selectedDate, cycle.startDate) < avgPeriodDuration)
    );
    
    if (existingCycleIndex >= 0) {
      // Update existing cycle
      const updatedCycles = [...cycles];
      updatedCycles[existingCycleIndex] = {
        ...updatedCycles[existingCycleIndex],
        flow: currentFlow,
        symptoms: [...new Set([...updatedCycles[existingCycleIndex].symptoms, ...currentSymptoms])],
        mood: currentMood || updatedCycles[existingCycleIndex].mood,
        notes: currentNotes || updatedCycles[existingCycleIndex].notes
      };
      setCycles(updatedCycles);
      toast({ title: "Entry updated", description: "Period day details updated." });
    } else {
      // Create new cycle
      const newCycle = {
        id: Date.now().toString(),
        startDate: selectedDate,
        flow: currentFlow,
        symptoms: currentSymptoms,
        mood: currentMood,
        notes: currentNotes
      };
      setCycles([...cycles, newCycle]);
      toast({ title: "Entry added", description: "Period day logged successfully." });
    }
    
    setCurrentMood("");
    setCurrentSymptoms([]);
    setCurrentFlow('medium');
    setCurrentNotes("");
  };

  const deleteCycle = (id) => {
    setCycles(cycles.filter(cycle => cycle.id !== id));
    toast({ title: "Entry deleted", description: "The cycle entry was removed." });
  };

  const moodEmojis = {
    happy: "😊",
    normal: "😐", 
    sad: "😢",
    irritable: "😤",
    anxious: "😰",
    energetic: "⚡"
  };

  // Precompute selected day info to simplify JSX
  const selectedDayInfo = selectedDate ? getDayInfo(selectedDate) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-4 text-foreground")}
          >
            Menstrual Cycle Tracker
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Track your cycle, predict ovulation, and monitor symptoms with intelligent insights.
          </p>
          <Button variant="gradient" size="lg" className="animate-scale-in" onClick={() => {
            document.getElementById('cycle-tracking-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Heart className="mr-2 h-5 w-5" />
            Track My Cycle
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8" id="cycle-tracking-section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cycle Setup */}
          <Card className="health-card animate-slide-up lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                Cycle Setup
              </CardTitle>
              <CardDescription>
                Set up your cycle information for accurate tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="period-date">Current Period Start Date</Label>
                  <Input
                    id="period-date"
                    type="date"
                    value={currentPeriodDate}
                    onChange={(e) => setCurrentPeriodDate(e.target.value)}
                    className="mt-1"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <Label htmlFor="period-duration">Average Period Duration (days)</Label>
                  <Input
                    id="period-duration"
                    type="number"
                    min="3"
                    max="10"
                    value={avgPeriodDuration}
                    onChange={(e) => setAvgPeriodDuration(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
                  <Input
                    id="cycle-length"
                    type="number"
                    min="21"
                    max="35"
                    value={avgCycleLength}
                    onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Cycle Overview */}
          {cycleInfo && (
            <Card className="health-card animate-slide-up lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Cycle Overview
                </CardTitle>
                <CardDescription>
                  Current cycle insights and predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {cycleInfo.daysUntilPeriod}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Until Period</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {cycleInfo.avgCycleLength}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Cycle Length</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="text-sm font-bold text-success">
                      {format(cycleInfo.ovulationDate, 'MMM dd')}
                    </div>
                    <div className="text-sm text-muted-foreground">Ovulation</div>
                  </div>
                  <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="text-sm font-bold text-warning">
                      {format(cycleInfo.nextPeriod, 'MMM dd')}
                    </div>
                    <div className="text-sm text-muted-foreground">Next Period</div>
                  </div>
                </div>
                
                {/* Fertile Window */}
                <div className="mt-6 p-4 bg-gradient-wellness/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Fertile Window</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(cycleInfo.fertileStart, 'MMM dd')} - {format(cycleInfo.fertileEnd, 'MMM dd')}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Peak fertility around {format(cycleInfo.ovulationDate, 'MMM dd')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Period Logging */}
          <Card className="health-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-primary" />
                Log Period Day
              </CardTitle>
              <CardDescription>
                Record symptoms and mood
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flow">Flow Intensity</Label>
                <select
                  id="flow"
                  value={currentFlow}
                  onChange={(e) => setCurrentFlow(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="light">Light Flow</option>
                  <option value="medium">Medium Flow</option>
                  <option value="heavy">Heavy Flow</option>
                </select>
              </div>
              <div>
                <Label htmlFor="mood">Mood</Label>
                <select
                  id="mood"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select mood</option>
                  <option value="happy">Happy 😊</option>
                  <option value="normal">Normal 😐</option>
                  <option value="sad">Sad 😢</option>
                  <option value="irritable">Irritable 😤</option>
                  <option value="anxious">Anxious 😰</option>
                  <option value="energetic">Energetic ⚡</option>
                </select>
              </div>
              <div>
                <Label>Symptoms</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['cramps', 'stomach ache', 'fatigue', 'back pain', 'headache', 'bloating', 'mood swings', 'nausea'].map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={currentSymptoms.includes(symptom)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCurrentSymptoms([...currentSymptoms, symptom]);
                          } else {
                            setCurrentSymptoms(currentSymptoms.filter(s => s !== symptom));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={logPeriodDay} variant="gradient" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Log Entry
              </Button>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="health-card animate-slide-up lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                Cycle Calendar
              </CardTitle>
              <CardDescription>
                Track your cycle visually with predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto"
                    modifiers={{
                      period: (date) => getDayInfo(date).isPeriod,
                      ovulation: (date) => getDayInfo(date).isOvulation,
                      fertile: (date) => getDayInfo(date).isFertile,
                    }}
                    modifiersStyles={{
                      period: { 
                        backgroundColor: 'hsl(var(--destructive))',
                        color: 'hsl(var(--destructive-foreground))',
                        fontWeight: 'bold'
                      },
                      ovulation: { 
                        backgroundColor: 'hsl(var(--success))',
                        color: 'hsl(var(--success-foreground))',
                        fontWeight: 'bold'
                      },
                      fertile: { 
                        backgroundColor: 'hsl(var(--warning))',
                        color: 'hsl(var(--warning-foreground))'
                      },
                    }}
                  />
                </div>
                
                <div className="lg:w-80 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Legend</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-destructive rounded"></div>
                      <span className="text-sm">Period Days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-success rounded"></div>
                      <span className="text-sm">Ovulation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-warning rounded"></div>
                      <span className="text-sm">Fertile Window</span>
                    </div>
                  </div>
                  
                  {selectedDate && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        {format(selectedDate, 'MMMM dd, yyyy')}
                      </h4>
                      {selectedDayInfo?.isPeriod ? (
                        <Badge variant="destructive">Period Day</Badge>
                      ) : selectedDayInfo?.isOvulation ? (
                        <Badge className="bg-success text-success-foreground">Ovulation</Badge>
                      ) : selectedDayInfo?.isFertile ? (
                        <Badge className="bg-warning text-warning-foreground">Fertile Window</Badge>
                      ) : (
                        <Badge variant="secondary">Regular Day</Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Cycles */}
          <Card className="health-card animate-slide-up lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Recent Cycles & Mood Tracking
              </CardTitle>
              <CardDescription>
                Your cycle history and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cycles.slice(-5).reverse().map((cycle) => (
                  <div key={cycle.id} className="p-4 bg-muted/50 rounded-lg group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">
                          {format(cycle.startDate, 'MMM dd, yyyy')}
                          {cycle.endDate && ` - ${format(cycle.endDate, 'MMM dd')}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Flow: <span className="capitalize">{cycle.flow}</span>
                          {cycle.mood && (
                            <>
                              {' • '}Mood: {cycle.mood} {moodEmojis[cycle.mood]}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {cycle.endDate ? 
                            `${differenceInDays(cycle.endDate, cycle.startDate) + 1} days` : 
                            'Current'
                          }
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCycle(cycle.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    {cycle.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cycle.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {cycle.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        "{cycle.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenstrualTracker;