import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/ui/MainLayout";

import Button from "../../components/ui/Button";
/* import StatCard from "./components/StatCard"; */
import AppointmentCard from "./components/AppointmentCard";
import PatientAlertCard from "./components/PatientAlertCard";
import QuickActionButton from "./components/QuickActionButton";
import RecentActivityItem from "./components/RecentActivityItem";
import TreatmentProgressChart from "./components/TreatmentProgressChart";
import UpcomingTaskCard from "./components/UpcomingTaskCard";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const userName = import.meta.env.VITE_TEST_NAME_USER || "Dr. User";
  const { t } = useTranslation();

  /* const stats = [
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
 */
  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Sarah+Johnson",
      patientImageAlt: "Retrato profesional de mujer caucásica con cabello rubio, con bata médica blanca, sonriendo cordialmente",
      treatment: "Tratamiento de conducto",
      time: "09:00 AM",
      date: "Hoy",
      duration: "60 min",
      status: "confirmed",
      priority: "high",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Michael+Chen",
      patientImageAlt: "Retrato profesional de hombre asiático con cabello corto negro, con camisa azul y expresión confiada",
      treatment: "Limpieza dental",
      time: "10:30 AM",
      date: "Hoy",
      duration: "30 min",
      status: "cancelled",
      priority: "normal",
    },
    {
      id: 3,
      patientName: "Emily Rodriguez",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Emily+Rodriguez",
      patientImageAlt: "Retrato profesional de mujer hispana con cabello largo castaño, con blusa verde y sonrisa amigable",
      treatment: "Colocación de corona",
      time: "02:00 PM",
      date: "Hoy",
      duration: "90 min",
      status: "pending",
      priority: "urgent",
    },
    {
      id: 4,
      patientName: "Santino Billordo",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Santino+Billordo",
      patientImageAlt: "Retrato profesional de hombre hispano con cabello corto negro, con camisa azul y expresión confiada",
      treatment: "Colocación de corona",
      time: "06:00 PM",
      date: "Hoy",
      duration: "60 min",
      status: "pending",
      priority: "normal",
    },
    /* {
      id: 5,
      patientName: "Laura Martínez",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Laura+Martinez",
      patientImageAlt: "Retrato profesional de mujer hispana con cabello castaño y sonrisa amable",
      treatment: "Relleno",
      time: "08:00 AM",
      date: "Hoy",
      duration: "45 min",
      status: "confirmed",
      priority: "normal",
    },
    {
      id: 6,
      patientName: "Carlos Fernández",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Carlos+Fernandez",
      patientImageAlt: "Retrato profesional de hombre hispano con cabello corto negro y expresión seria",
      treatment: "Limpieza dental",
      time: "09:30 AM",
      date: "Hoy",
      duration: "30 min",
      status: "pending",
      priority: "high",
    },
    {
      id: 7,
      patientName: "Ana Gómez",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Ana+Gomez",
      patientImageAlt: "Retrato profesional de mujer latina con cabello negro largo y sonrisa amable",
      treatment: "Extracción dental",
      time: "10:15 AM",
      date: "Hoy",
      duration: "60 min",
      status: "confirmed",
      priority: "urgent",
    },
    {
      id: 8,
      patientName: "José López",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Jose+Lopez",
      patientImageAlt: "Retrato profesional de hombre latino con cabello corto castaño y sonrisa",
      treatment: "Tratamiento de conducto radicular",
      time: "11:00 AM",
      date: "Hoy",
      duration: "75 min",
      status: "confirmed",
      priority: "high",
    },
    {
      id: 9,
      patientName: "Valeria Torres",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Valeria+Torres",
      patientImageAlt: "Retrato profesional de mujer hispana con cabello rubio y sonrisa amable",
      treatment: "Colocación de corona",
      time: "12:00 PM",
      date: "Hoy",
      duration: "90 min",
      status: "pending",
      priority: "urgent",
    },
    {
      id: 10,
      patientName: "Miguel Sánchez",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Miguel+Sanchez",
      patientImageAlt: "Retrato profesional de hombre latino con cabello negro y expresión confiada",
      treatment: "Limpieza dental",
      time: "01:00 PM",
      date: "Hoy",
      duration: "30 min",
      status: "cancelled",
      priority: "normal",
    },
    {
      id: 11,
      patientName: "Sofía Ruiz",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Sofia+Ruiz",
      patientImageAlt: "Retrato profesional de mujer hispana con cabello castaño y sonrisa amable",
      treatment: "Relleno",
      time: "02:30 PM",
      date: "Hoy",
      duration: "45 min",
      status: "confirmed",
      priority: "high",
    },
    {
      id: 12,
      patientName: "Diego Morales",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Diego+Morales",
      patientImageAlt: "Retrato profesional de hombre latino con cabello castaño y expresión seria",
      treatment: "Ortodoncia",
      time: "03:30 PM",
      date: "Hoy",
      duration: "60 min",
      status: "pending",
      priority: "urgent",
    },
    {
      id: 13,
      patientName: "Isabella Cruz",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Isabella+Cruz",
      patientImageAlt: "Retrato profesional de mujer hispana con cabello largo y sonrisa amable",
      treatment: "Ajustes de aparato ortodóntico",
      time: "04:30 PM",
      date: "Hoy",
      duration: "90 min",
      status: "confirmed",
      priority: "normal",
    },
    {
      id: 14,
      patientName: "Fernando Díaz",
      patientImage: "https://ui-avatars.com/api/?background=b97beb&color=fff&name=Fernando+Diaz",
      patientImageAlt: "Retrato profesional de hombre latino con cabello corto y expresión confiada",
      treatment: "Limpieza dental",
      time: "05:30 PM",
      date: "Hoy",
      duration: "75 min",
      status: "cancelled",
      priority: "high",
    }, */
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
    { icon: "UserPlus", label: "newPatient", color: "var(--color-primary)" },
    { icon: "Calendar", label: "scheduleAppointment", color: "var(--color-success)" },
    { icon: "FileText", label: "addNote", color: "var(--color-warning)" },
    { icon: "PieChart", label: "viewReports", color: "var(--color-brand-accent)" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "treatment",
      userName: "Dr. Sarah Johnson",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b73223d7-1763296809581.png",
      userImageAlt: "Retrato profesional de dentista mujer con cabello castaño y bata blanca con estetoscopio",
      description: "Tratamiento de conducto completado para el paciente Michael Chen",
      time: "hace 10 min",
    },
    {
      id: 2,
      type: "appointment",
      userName: "Recepción",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1ccaed995-1763294687911.png",
      userImageAlt: "Retrato profesional de recepcionista con cabello rubio y uniforme azul con sonrisa amable",
      description: "Nuevo turno programado para Emily Rodriguez - Colocación de corona",
      time: "hace 25 min",
    },
    {
      id: 3,
      type: "payment",
      userName: "Departamento de Facturación",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b686b60e-1763292151580.png",
      userImageAlt: "Retrato profesional de especialista en facturación hombre con gafas y camisa blanca con expresión concentrada",
      description: "Pago recibido de Robert Williams - $450,00",
      time: "hace 1 hora",
    },
    {
      id: 4,
      type: "note",
      userName: "Dr. James Wilson",
      userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13747ffaf-1763301803218.png",
      userImageAlt: "Retrato profesional de dentista hombre con cabello gris y bata blanca con actitud experimentada",
      description: "Notas clínicas agregadas para el seguimiento de Lisa Anderson",
      time: "hace 2 horas",
    },
  ];

  const treatmentData = [
    { month: "Jan", completed: 45, inProgress: 12, scheduled: 23 },
    { month: "Feb", completed: 52, inProgress: 15, scheduled: 28 },
    { month: "Mar", completed: 48, inProgress: 18, scheduled: 25 },
    { month: "Apr", completed: 61, inProgress: 14, scheduled: 30 },
    { month: "May", completed: 55, inProgress: 20, scheduled: 27 },
    { month: "Jun", completed: 67, inProgress: 16, scheduled: 32 },
    { month: "Jul", completed: 45, inProgress: 12, scheduled: 23 },
    { month: "Ago", completed: 52, inProgress: 15, scheduled: 28 },
    { month: "Sep", completed: 48, inProgress: 18, scheduled: 25 },
    { month: "Oct", completed: 61, inProgress: 14, scheduled: 30 },
    { month: "Nov", completed: 55, inProgress: 20, scheduled: 27 },
    { month: "Dec", completed: 67, inProgress: 16, scheduled: 32 },
  ];

  /* const upcomingTasks = [
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
  ]; */

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
    if (action === "newPatient") {
      navigate("/patient-directory");
    } else if (action === "scheduleAppointment") {
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">{t("home.welcome", { name: userName })}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("home.overview")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={selectedTimeframe === "today" ? "default" : "tertiary"} size="sm" onClick={() => setSelectedTimeframe("today")}>
              {t("timeFrame.today")}
            </Button>
            <Button variant={selectedTimeframe === "week" ? "default" : "tertiary"} size="sm" onClick={() => setSelectedTimeframe("week")}>
              {t("timeFrame.thisWeek")}
            </Button>
            <Button variant={selectedTimeframe === "month" ? "default" : "tertiary"} size="sm" onClick={() => setSelectedTimeframe("month")}>
              {t("timeFrame.thisMonth")}
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
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{t("appointment.titlePanel")}</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/treatment-planning")} iconName="Calendar" iconPosition="left">
                  {t("appointment.viewAll")}
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
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{t("dashboard.treatmentProgress.title")}</h2>
                <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
                  {t("dashboard.treatmentProgress.export")}
                </Button>
              </div>
              <TreatmentProgressChart data={treatmentData} t={t} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="clinical-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground mb-4">{t("dashboard.quickActions.title")}</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions?.map((action, index) => (
                  <QuickActionButton key={index} icon={action?.icon} label={t(`dashboard.quickActions.${action?.label}`)} color={action?.color} onClick={() => handleQuickAction(action?.label)} />
                ))}
              </div>
            </div>
            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{t("dashboard.recentActivity.title")}</h2>
                <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
                  {t("dashboard.recentActivity.refresh")}
                </Button>
              </div>
              <div className="space-y-2">
                {recentActivities?.map((activity) => (
                  <RecentActivityItem key={activity?.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* <div className="clinical-card p-4 md:p-6">
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
            </div> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
