import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/health-hooks/use-toast";
import { cn } from "@/lib/health-lib/utils";
import {
  FileHeart,
  Plus,
  Search,
  Upload,
  Calendar,
  Pill,
  Shield,
  Stethoscope,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import { format } from "date-fns";
const MedicalHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecord, setNewRecord] = useState({
    type: 'appointment',
    title: '',
    date: new Date(),
    notes: '',
    status: 'completed'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [records, setRecords] = useState([
    {
      id: '1',
      type: 'appointment',
      title: 'Annual Gynecological Checkup',
      date: new Date('2024-01-15'),
      doctor: 'Dr. Sarah Johnson',
      facility: 'Women\'s Health Center',
      notes: 'Routine checkup, all normal results. Discussed birth control options.',
      status: 'completed'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Birth Control Pills',
      date: new Date('2024-01-15'),
      doctor: 'Dr. Sarah Johnson',
      notes: 'Prescribed Yaz, take daily at same time. No major side effects expected.',
      status: 'completed'
    },
    {
      id: '3',
      type: 'test',
      title: 'Blood Test - Hormone Panel',
      date: new Date('2024-02-10'),
      doctor: 'Dr. Sarah Johnson',
      facility: 'LabCorp',
      notes: 'Comprehensive hormone panel including thyroid function. All levels normal.',
      status: 'completed'
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Follow-up Consultation',
      date: new Date('2024-07-15'),
      doctor: 'Dr. Sarah Johnson',
      facility: 'Women\'s Health Center',
      notes: 'Scheduled follow-up to discuss test results and any concerns.',
      status: 'upcoming'
    }
  ]);

  // Use local storage to persist data
  useEffect(() => {
    const savedRecords = localStorage.getItem('medical-records');
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords).map((record) => ({
        ...record,
        date: new Date(record.date)
      }));
      setRecords(parsedRecords);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('medical-records', JSON.stringify(records));
  }, [records]);

  const [vaccinations] = useState([
    {
      id: '1',
      name: 'HPV Vaccine (Gardasil)',
      date: new Date('2023-03-15'),
      nextDue: new Date('2028-03-15'),
      facility: 'Community Health Center',
      notes: 'Series completed. Next booster due in 5 years.'
    },
    {
      id: '2',
      name: 'Flu Shot',
      date: new Date('2023-10-01'),
      nextDue: new Date('2024-10-01'),
      facility: 'Local Pharmacy',
      notes: 'Annual flu vaccination. Next due October 2024.'
    },
    {
      id: '3',
      name: 'COVID-19 Booster',
      date: new Date('2023-09-20'),
      facility: 'Vaccination Center',
      notes: 'Updated booster shot. Monitor for updated recommendations.'
    }
  ]);

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.doctor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecordIcon = (type) => {
    switch (type) {
      case 'appointment': return <Stethoscope className="h-4 w-4" />;
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'vaccination': return <Shield className="h-4 w-4" />;
      case 'test': return <FileHeart className="h-4 w-4" />;
      default: return <FileHeart className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'upcoming': return 'bg-warning/10 text-warning';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addRecord = () => {
    if (!newRecord.title || !newRecord.date) return;
    
    const recordToAdd = {
      id: Date.now().toString(),
      type: newRecord.type || 'appointment',
      title: newRecord.title,
      date: newRecord.date,
      doctor: newRecord.doctor,
      facility: newRecord.facility,
      notes: newRecord.notes || '',
      status: newRecord.status || 'completed'
    };
    
    setRecords([recordToAdd, ...records]);
    setNewRecord({
      type: 'appointment',
      title: '',
      date: new Date(),
      notes: '',
      status: 'completed'
    });
    setIsDialogOpen(false);
    toast({ title: "Record added", description: "Medical record saved successfully." });
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
    toast({ title: "Record deleted", description: "The medical record was removed." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (no image) */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-r from-background/90 to-background/50">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl animate-fade-in">
              <h1 className={cn("text-4xl md:text-5xl font-bold mb-4 text-foreground")}>
                Medical History
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Organize and manage your medical records, prescriptions, and vaccination history in one secure place.
              </p>
              <Button variant="gradient" size="lg" className="animate-scale-in">
                <FileHeart className="mr-2 h-5 w-5" />
                Manage Records
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Add Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medical records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
                <DialogDescription>
                  Add a new medical record to your history
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="record-type">Record Type</Label>
                  <select
                    id="record-type"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                  >
                    <option value="appointment">Appointment</option>
                    <option value="prescription">Prescription</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="test">Test/Lab Result</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="record-title">Title</Label>
                  <Input
                    id="record-title"
                    placeholder="e.g., Annual Checkup"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="record-date">Date</Label>
                  <Input
                    id="record-date"
                    type="date"
                    value={newRecord.date ? format(newRecord.date, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setNewRecord({...newRecord, date: new Date(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="record-doctor">Doctor/Provider</Label>
                  <Input
                    id="record-doctor"
                    placeholder="e.g., Dr. Jane Smith"
                    value={newRecord.doctor || ''}
                    onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="record-notes">Notes</Label>
                  <Textarea
                    id="record-notes"
                    placeholder="Additional notes..."
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  />
                </div>
                <Button onClick={addRecord} variant="gradient" className="w-full">
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          </TabsList>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <div className="grid gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="health-card animate-slide-up">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getRecordIcon(record.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{record.title}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>{format(record.date, 'MMMM dd, yyyy')}</span>
                            </div>
                            {record.doctor && (
                              <div>{record.doctor}</div>
                            )}
                            {record.facility && (
                              <div>{record.facility}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-4">
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">
                        {record.type}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-3 w-3" />
                          Upload Files
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            <div className="grid gap-4">
              {records.filter(r => r.type === 'prescription').map((prescription) => (
                <Card key={prescription.id} className="health-card animate-slide-up">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Pill className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{prescription.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            <div>Prescribed by: {prescription.doctor}</div>
                            <div>Date: {format(prescription.date, 'MMMM dd, yyyy')}</div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-success/10 text-success">Active</Badge>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{prescription.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {records.filter(r => r.type === 'prescription').length === 0 && (
                <Card className="health-card">
                  <CardContent className="text-center py-12">
                    <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Prescriptions</h3>
                    <p className="text-muted-foreground">Add your prescription history to keep track of medications.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Vaccinations Tab */}
          <TabsContent value="vaccinations" className="space-y-4">
            <div className="grid gap-4">
              {vaccinations.map((vaccination) => (
                <Card key={vaccination.id} className="health-card animate-slide-up">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <Shield className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{vaccination.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <div>Administered: {format(vaccination.date, 'MMMM dd, yyyy')}</div>
                            <div>Facility: {vaccination.facility}</div>
                            {vaccination.nextDue && (
                              <div>Next Due: {format(vaccination.nextDue, 'MMMM dd, yyyy')}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      {vaccination.nextDue && (
                        <Badge 
                          className={
                            vaccination.nextDue > new Date() 
                              ? "bg-success/10 text-success" 
                              : "bg-warning/10 text-warning"
                          }
                        >
                          {vaccination.nextDue > new Date() ? "Up to Date" : "Due"}
                        </Badge>
                      )}
                    </div>
                    
                    {vaccination.notes && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{vaccination.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalHistory;