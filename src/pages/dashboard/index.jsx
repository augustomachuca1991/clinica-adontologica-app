import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/ui/MainLayout";

import Button from "../../components/ui/Button";
import StatCard from "./components/StatCard";
import AppointmentCard from "./components/AppointmentCard";
import PatientAlertCard from "./components/PatientAlertCard";
import QuickActionButton from "./components/QuickActionButton";
import RecentActivityItem from "./components/RecentActivityItem";
import TreatmentProgressChart from "./components/TreatmentProgressChart";
import UpcomingTaskCard from "./components/UpcomingTaskCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      change: "+15%",
      changeType: "positive",
      trend: "up",
      icon: "Calendar",
      iconColor: "var(--color-primary)",
    },
    {
      title: "Active Patients",
      value: "248",
      change: "+8%",
      changeType: "positive",
      trend: "up",
      icon: "Users",
      iconColor: "var(--color-success)",
    },
    {
      title: "Pending Treatments",
      value: "34",
      change: "-5%",
      changeType: "negative",
      trend: "down",
      icon: "Activity",
      iconColor: "var(--color-warning)",
    },
    {
      title: "Revenue (MTD)",
      value: "$45.2K",
      change: "+12%",
      changeType: "positive",
      trend: "up",
      icon: "DollarSign",
      iconColor: "var(--color-brand-accent)",
    },
  ];

  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1757e492a-1763293666438.png",
      patientImageAlt: "Professional headshot of Caucasian woman with blonde hair in white medical coat smiling warmly",
      treatment: "Root Canal Treatment",
      time: "09:00 AM",
      date: "Today",
      duration: "60 min",
      status: "confirmed",
      priority: "high",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_17e3e8a83-1763296144451.png",
      patientImageAlt: "Professional headshot of Asian man with short black hair in blue shirt with confident expression",
      treatment: "Dental Cleaning",
      time: "10:30 AM",
      date: "Today",
      duration: "30 min",
      status: "confirmed",
      priority: "normal",
    },
    {
      id: 3,
      patientName: "Emily Rodriguez",
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_119848aeb-1763295351165.png",
      patientImageAlt: "Professional headshot of Hispanic woman with long brown hair in green blouse with friendly smile",
      treatment: "Crown Placement",
      time: "02:00 PM",
      date: "Today",
      duration: "90 min",
      status: "pending",
      priority: "urgent",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "critical",
      patientName: "Robert Williams",
      patientId: 1,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f23d9c3d-1763295425663.png",
      patientImageAlt: "Professional headshot of African American man with short hair in gray suit with serious expression",
      message: "Post-operative follow-up required - Extraction site showing signs of infection",
      time: "15 min ago",
    },
    {
      id: 2,
      type: "warning",
      patientName: "Lisa Anderson",
      patientId: 2,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_179d264c2-1763294988724.png",
      patientImageAlt: "Professional headshot of Caucasian woman with red hair in yellow top with warm smile",
      message: "Lab results ready for review - Crown preparation measurements",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      patientName: "David Martinez",
      patientId: 3,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
      patientImageAlt: "Professional headshot of Hispanic man with beard in blue shirt with professional demeanor",
      message: "Insurance pre-authorization approved for orthodontic treatment",
      time: "2 hours ago",
    },
  ];

  const quickActions = [
    { icon: "UserPlus", label: "New Patient", color: "var(--color-primary)" },
    { icon: "Calendar", label: "Schedule", color: "var(--color-success)" },
    { icon: "FileText", label: "Add Note", color: "var(--color-warning)" },
    { icon: "DollarSign", label: "Payment", color: "var(--color-brand-accent)" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "treatment",
      userName: "Dr. Sarah Johnson",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b73223d7-1763296809581.png",
      userImageAlt: "Professional headshot of female dentist with brown hair in white coat with stethoscope",
      description: "Completed root canal treatment for patient Michael Chen",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "appointment",
      userName: "Reception Desk",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1ccaed995-1763294687911.png",
      userImageAlt: "Professional headshot of receptionist with blonde hair in blue uniform with welcoming smile",
      description: "New appointment scheduled for Emily Rodriguez - Crown placement",
      time: "25 min ago",
    },
    {
      id: 3,
      type: "payment",
      userName: "Billing Department",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b686b60e-1763292151580.png",
      userImageAlt: "Professional headshot of male billing specialist with glasses in white shirt with focused expression",
      description: "Payment received from Robert Williams - $450.00",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "note",
      userName: "Dr. James Wilson",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13747ffaf-1763301803218.png",
      userImageAlt: "Professional headshot of male dentist with gray hair in white coat with experienced demeanor",
      description: "Added clinical notes for Lisa Anderson's follow-up examination",
      time: "2 hours ago",
    },
  ];

  const treatmentData = [
    { month: "Jan", completed: 45, inProgress: 12, scheduled: 23 },
    { month: "Feb", completed: 52, inProgress: 15, scheduled: 28 },
    { month: "Mar", completed: 48, inProgress: 18, scheduled: 25 },
    { month: "Apr", completed: 61, inProgress: 14, scheduled: 30 },
    { month: "May", completed: 55, inProgress: 20, scheduled: 27 },
    { month: "Jun", completed: 67, inProgress: 16, scheduled: 32 },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Review lab results for crown preparation",
      description: "Check measurements and color matching for Lisa Anderson's crown",
      dueTime: "11:00 AM",
      priority: "urgent",
      patientName: "Lisa Anderson",
      completed: false,
    },
    {
      id: 2,
      title: "Follow-up call with insurance company",
      description: "Verify coverage for orthodontic treatment plan",
      dueTime: "02:30 PM",
      priority: "high",
      patientName: "David Martinez",
      completed: false,
    },
    {
      id: 3,
      title: "Update treatment plan documentation",
      description: "Complete clinical notes and treatment progress updates",
      dueTime: "04:00 PM",
      priority: "medium",
      patientName: null,
      completed: false,
    },
    {
      id: 4,
      title: "Order dental supplies",
      description: "Restock composite materials and anesthetic supplies",
      dueTime: "05:00 PM",
      priority: "low",
      patientName: null,
      completed: true,
    },
  ];

  const handleViewAppointmentDetails = (appointmentId) => {
    console.log("Viewing appointment:", appointmentId);
    navigate("/treatment-planning");
  };

  const handleRescheduleAppointment = (appointmentId) => {
    console.log("Rescheduling appointment:", appointmentId);
  };

  const handleDismissAlert = (alertId) => {
    console.log("Dismissing alert:", alertId);
  };

  const handleViewPatient = (patientId) => {
    console.log("Viewing patient:", patientId);
    navigate("/patient-profile");
  };

  const handleQuickAction = (action) => {
    console.log("Quick action:", action);
    if (action === "New Patient") {
      navigate("/patient-directory");
    } else if (action === "Schedule") {
      navigate("/treatment-planning");
    }
  };

  const handleToggleTaskComplete = (taskId, completed) => {
    console.log("Task completion toggled:", taskId, completed);
  };

  const handleViewTaskDetails = (taskId) => {
    console.log("Viewing task:", taskId);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">Welcome back, Dr. Sarah Johnson</h1>
            <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your practice today</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={selectedTimeframe === "today" ? "default" : "outline"} size="sm" onClick={() => setSelectedTimeframe("today")}>
              Today
            </Button>
            <Button variant={selectedTimeframe === "week" ? "default" : "outline"} size="sm" onClick={() => setSelectedTimeframe("week")}>
              This Week
            </Button>
            <Button variant={selectedTimeframe === "month" ? "default" : "outline"} size="sm" onClick={() => setSelectedTimeframe("month")}>
              This Month
            </Button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats?.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Today's Appointments</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/treatment-planning")} iconName="Calendar" iconPosition="left">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {appointments?.map((appointment) => (
                  <AppointmentCard key={appointment?.id} appointment={appointment} onViewDetails={handleViewAppointmentDetails} onReschedule={handleRescheduleAppointment} />
                ))}
              </div>
            </div>

            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Treatment Progress</h2>
                <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
                  Export
                </Button>
              </div>
              <TreatmentProgressChart data={treatmentData} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="clinical-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions?.map((action, index) => (
                  <QuickActionButton key={index} icon={action?.icon} label={action?.label} color={action?.color} onClick={() => handleQuickAction(action?.label)} />
                ))}
              </div>
            </div>

            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Patient Alerts</h2>
                <span className="status-indicator bg-error/10 text-error text-xs px-2 py-1">{alerts?.filter((a) => a?.type === "critical")?.length} Critical</span>
              </div>
              <div className="space-y-3">
                {alerts?.map((alert) => (
                  <PatientAlertCard key={alert?.id} alert={alert} onDismiss={handleDismissAlert} onViewPatient={handleViewPatient} />
                ))}
              </div>
            </div>

            <div className="clinical-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground mb-4">Upcoming Tasks</h2>
              <div className="space-y-2">
                {upcomingTasks?.map((task) => (
                  <UpcomingTaskCard key={task?.id} task={task} onToggleComplete={handleToggleTaskComplete} onViewDetails={handleViewTaskDetails} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="clinical-card p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
              Refresh
            </Button>
          </div>
          <div className="space-y-2">
            {recentActivities?.map((activity) => (
              <RecentActivityItem key={activity?.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
