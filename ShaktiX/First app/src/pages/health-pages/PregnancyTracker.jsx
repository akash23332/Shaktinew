import React, { useState, useEffect } from "react";
import { Button } from "@/components/health-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/health-ui/card";
import { Input } from "@/components/health-ui/input";
import { Label } from "@/components/health-ui/label";
import { Progress } from "@/components/health-ui/progress";
import { Textarea } from "@/components/health-ui/textarea";
import { useToast } from "@/hooks/health-hooks/use-toast";
import { cn } from "@/lib/health-lib/utils";
import {
  Baby,
  Calendar,
  Droplets,
  Apple,
  Activity,
  Plus,
  Clock,
  Heart
} from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";

const PregnancyTracker = () => {
  const { toast } = useToast();
  const [dueDate, setDueDate] = useState("");
  const [lastPeriod, setLastPeriod] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [currentSeverity, setCurrentSeverity] = useState(1);
  const [reminders, setReminders] = useState([
    { id: '1', type: 'hydration', time: '8:00 AM', completed: false },
    { id: '2', type: 'hydration', time: '12:00 PM', completed: true },
    { id: '3', type: 'hydration', time: '4:00 PM', completed: false },
    { id: '4', type: 'nutrition', time: '7:00 AM', completed: true },
    { id: '5', type: 'nutrition', time: '1:00 PM', completed: false },
    { id: '6', type: 'nutrition', time: '7:00 PM', completed: false },
  ]);

  const calculatePregnancyInfo = () => {
    if (!lastPeriod) return null;
    
    const lastPeriodDate = new Date(lastPeriod);
    const today = new Date();
    const calculatedDueDate = addDays(lastPeriodDate, 280); // 40 weeks
    const daysPregnant = differenceInDays(today, lastPeriodDate);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysInWeek = daysPregnant % 7;
    
    let trimester = 1;
    if (daysPregnant >= 168) trimester = 3; // 24 weeks
    else if (daysPregnant >= 84) trimester = 2; // 12 weeks
    
    const progressPercentage = Math.min((daysPregnant / 280) * 100, 100);
    
    return {
      dueDate: calculatedDueDate,
      weeksPregnant,
      daysInWeek,
      trimester,
      progressPercentage,
      daysRemaining: Math.max(280 - daysPregnant, 0)
    };
  };

  // Use local storage to persist data
  useEffect(() => {
    const savedSymptoms = localStorage.getItem('pregnancy-symptoms');
    const savedReminders = localStorage.getItem('pregnancy-reminders');
    const savedLastPeriod = localStorage.getItem('pregnancy-last-period');
    const savedDueDate = localStorage.getItem('pregnancy-due-date');
    
    if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedLastPeriod) setLastPeriod(savedLastPeriod);
    if (savedDueDate) setDueDate(savedDueDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('pregnancy-symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem('pregnancy-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (lastPeriod) localStorage.setItem('pregnancy-last-period', lastPeriod);
  }, [lastPeriod]);

  useEffect(() => {
    if (dueDate) localStorage.setItem('pregnancy-due-date', dueDate);
  }, [dueDate]);

  const pregnancyInfo = calculatePregnancyInfo();

  const addSymptom = () => {
    if (!currentSymptom.trim()) return;
    
    const newSymptom = {
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      symptom: currentSymptom,
      severity: currentSeverity
    };
    
    setSymptoms([newSymptom, ...symptoms]);
    setCurrentSymptom("");
    setCurrentSeverity(1);
    toast({ title: "Symptom added", description: `Logged: ${newSymptom.symptom}` });
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
    toast({ title: "Reminder updated", description: "Reminder completion toggled." });
  };

  const deleteSymptom = (id) => {
    setSymptoms(symptoms.filter(symptom => symptom.id !== id));
    toast({ title: "Symptom removed", description: "The symptom entry was deleted." });
  };

  const getWeeklyGrowthInfo = (week) => {
    const growthInfo = {
      1: { size: "poppy seed", length: "0.1 inches", weight: "< 1 gram", development: "Implantation occurs, cells rapidly dividing" },
      2: { size: "sesame seed", length: "0.1 inches", weight: "< 1 gram", development: "Amniotic sac and placenta begin forming" },
      3: { size: "sesame seed", length: "0.1 inches", weight: "< 1 gram", development: "Neural tube begins forming" },
      4: { size: "poppy seed", length: "0.2 inches", weight: "< 1 gram", development: "Heart begins to form and beat" },
      5: { size: "sesame seed", length: "0.3 inches", weight: "< 1 gram", development: "Brain, spinal cord, and heart developing" },
      6: { size: "lentil", length: "0.4 inches", weight: "< 1 gram", development: "Facial features and limb buds forming" },
      7: { size: "blueberry", length: "0.5 inches", weight: "< 1 gram", development: "Brain rapidly growing, arms and legs developing" },
      8: { size: "raspberry", length: "0.6 inches", weight: "1 gram", development: "Fingers and toes forming, tail disappearing" },
      9: { size: "grape", length: "0.9 inches", weight: "2 grams", development: "Basic facial features present, heart has 4 chambers" },
      10: { size: "strawberry", length: "1.2 inches", weight: "4 grams", development: "Vital organs functioning, fingernails developing" },
      11: { size: "lime", length: "1.6 inches", weight: "7 grams", development: "Baby can swallow and produce urine" },
      12: { size: "plum", length: "2.1 inches", weight: "14 grams", development: "Reflexes developing, kidneys producing urine" },
      13: { size: "peach", length: "2.9 inches", weight: "23 grams", development: "Vocal cords forming, baby can make facial expressions" },
      14: { size: "lemon", length: "3.4 inches", weight: "43 grams", development: "Baby can suck thumb, liver producing bile" },
      15: { size: "apple", length: "4 inches", weight: "70 grams", development: "Bones hardening, baby can sense light" },
      16: { size: "avocado", length: "4.6 inches", weight: "100 grams", development: "You might feel first movements, nervous system functioning" },
      17: { size: "turnip", length: "5.1 inches", weight: "140 grams", development: "Baby can hear sounds, fat begins forming" },
      18: { size: "bell pepper", length: "5.6 inches", weight: "190 grams", development: "Yawning and hiccupping, digestive system working" },
      19: { size: "tomato", length: "6 inches", weight: "240 grams", development: "Protective coating (vernix) covering skin" },
      20: { size: "banana", length: "6.5 inches", weight: "300 grams", development: "Baby can swallow and taste, hair growing" },
      21: { size: "carrot", length: "10.5 inches", weight: "360 grams", development: "Rapid brain development, movements coordinated" },
      22: { size: "spaghetti squash", length: "11 inches", weight: "430 grams", development: "Lips and eyebrows formed, pancreas developing" },
      23: { size: "grapefruit", length: "11.4 inches", weight: "500 grams", development: "Blood vessels in lungs developing, can hear heartbeat" },
      24: { size: "cantaloupe", length: "12 inches", weight: "600 grams", development: "Inner ear fully developed, skin becoming less transparent" },
      25: { size: "cauliflower", length: "13.6 inches", weight: "660 grams", development: "Nostrils opening, baby responding to familiar sounds" },
      26: { size: "lettuce", length: "14 inches", weight: "760 grams", development: "Eyes beginning to open, lung development continuing" },
      27: { size: "eggplant", length: "14.4 inches", weight: "875 grams", development: "Sleep and wake cycles established, brain tissue developing" },
      28: { size: "large eggplant", length: "14.8 inches", weight: "1 kg", development: "Eyes can blink, adding fat layers for temperature control" },
      29: { size: "butternut squash", length: "15.2 inches", weight: "1.15 kg", development: "Brain controlling breathing and temperature" },
      30: { size: "cabbage", length: "15.7 inches", weight: "1.3 kg", development: "Bone marrow producing red blood cells" },
      31: { size: "coconut", length: "16.2 inches", weight: "1.5 kg", development: "Major development complete, weight gain accelerating" },
      32: { size: "jicama", length: "16.7 inches", weight: "1.7 kg", development: "Skeleton hardening, fingernails and toenails grown" },
      33: { size: "pineapple", length: "17.2 inches", weight: "1.9 kg", development: "Immune system developing, bones hardening except skull" },
      34: { size: "cantaloupe", length: "17.7 inches", weight: "2.1 kg", development: "Central nervous system maturing, fat layers increasing" },
      35: { size: "honeydew melon", length: "18.2 inches", weight: "2.4 kg", development: "Kidneys fully developed, liver processing waste" },
      36: { size: "romaine lettuce", length: "18.7 inches", weight: "2.6 kg", development: "Skull bones flexible for delivery, gaining weight" },
      37: { size: "Swiss chard", length: "19.1 inches", weight: "2.9 kg", development: "Practicing breathing movements, grip getting stronger" },
      38: { size: "leek", length: "19.6 inches", weight: "3.1 kg", development: "Organs mature enough for life outside womb" },
      39: { size: "mini watermelon", length: "20 inches", weight: "3.3 kg", development: "Brain and nervous system still developing" },
      40: { size: "small pumpkin", length: "20.2 inches", weight: "3.4 kg", development: "Fully developed and ready for birth!" }
    };
    
    const closestWeek = Object.keys(growthInfo)
      .map(Number)
      .reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
    
    return growthInfo[closestWeek];
  };

  const startTracking = () => {
    setIsTracking(true);
    // Scroll to tracking section
    document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (no image) */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-r from-background/90 to-background/50">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl animate-fade-in">
              <h1 className={cn("text-4xl md:text-5xl font-bold mb-4 text-foreground")}>
                Pregnancy Journey
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Track your pregnancy with personalized insights, growth updates, and daily symptom monitoring.
              </p>
              <Button variant="gradient" size="lg" className="animate-scale-in" onClick={startTracking}>
                <Baby className="mr-2 h-5 w-5" />
                Start Tracking
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8" id="tracking-section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Due Date Calculator */}
          <Card className="health-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Due Date Calculator
              </CardTitle>
              <CardDescription>
                Calculate your estimated due date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="last-period">Last Menstrual Period</Label>
                <Input
                  id="last-period"
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="due-date">Custom Due Date (Optional)</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pregnancy Progress */}
          {pregnancyInfo && (
            <Card className="health-card animate-slide-up lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Pregnancy Progress
                </CardTitle>
                <CardDescription>
                  Week {pregnancyInfo.weeksPregnant}, Day {pregnancyInfo.daysInWeek} • Trimester {pregnancyInfo.trimester}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(pregnancyInfo.progressPercentage)}% Complete</span>
                  </div>
                  <Progress 
                    value={pregnancyInfo.progressPercentage} 
                    className="h-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {format(pregnancyInfo.dueDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Due Date</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {pregnancyInfo.daysRemaining}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Growth */}
          {pregnancyInfo && (
            <Card className="health-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Baby className="mr-2 h-5 w-5 text-primary" />
                  Weekly Growth
                </CardTitle>
                <CardDescription>
                  Week {pregnancyInfo.weeksPregnant} Update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-wellness/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {getWeeklyGrowthInfo(pregnancyInfo.weeksPregnant).size}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Your baby is the size of a {getWeeklyGrowthInfo(pregnancyInfo.weeksPregnant).size}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="font-semibold text-primary">Length</div>
                      <div>{getWeeklyGrowthInfo(pregnancyInfo.weeksPregnant).length}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="font-semibold text-primary">Weight</div>
                      <div>{getWeeklyGrowthInfo(pregnancyInfo.weeksPregnant).weight}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="font-semibold text-primary mb-1">Development</div>
                    <div className="text-sm text-muted-foreground">
                      {getWeeklyGrowthInfo(pregnancyInfo.weeksPregnant).development}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Symptom Logger */}
          <Card className="health-card animate-slide-up lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Daily Symptom Log
              </CardTitle>
              <CardDescription>
                Track symptoms and their severity (1-10 scale)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter symptom (e.g., morning sickness, fatigue)"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={currentSeverity}
                  onChange={(e) => setCurrentSeverity(Number(e.target.value))}
                  className="w-20"
                />
                <Button onClick={addSymptom} variant="gradient">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {symptoms.map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg group">
                    <div>
                      <div className="font-medium">{entry.symptom}</div>
                      <div className="text-sm text-muted-foreground">{entry.date}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-primary">{entry.severity}/10</div>
                        <div className="text-xs text-muted-foreground">Severity</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSymptom(entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                {symptoms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No symptoms logged yet. Start tracking your daily symptoms above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Reminders */}
          <Card className="health-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Daily Reminders
              </CardTitle>
              <CardDescription>
                Stay on top of your health routine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:opacity-80 ${
                    reminder.completed ? 'bg-success/10 text-success' : 'bg-muted/50'
                  }`}
                  onClick={() => toggleReminder(reminder.id)}
                >
                  <div className="flex items-center space-x-3">
                    {reminder.type === 'hydration' ? (
                      <Droplets className="h-4 w-4" />
                    ) : (
                      <Apple className="h-4 w-4" />
                    )}
                    <div>
                      <div className="font-medium capitalize">
                        {reminder.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reminder.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {reminder.completed ? '✓ Done' : 'Click to complete'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PregnancyTracker;