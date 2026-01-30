import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

const UserManagementCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Consultamos los perfiles y traemos sus roles asociados
      const { data, error } = await supabase.from("user_profiles").select(`
          id,
          full_name,
          email,
          status,
          created_at,
          user_roles (
            roles ( name )
          )
        `);

      if (error) throw error;
      setUsers(data);
      console.log("Fetched users:", data);
      console.log("Length of users:", data?.length);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  /* const usersMock = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@dentalcare.com",
      role: "Administrator",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1757e492a-1763293666438.png",
      avatarAlt: "Professional headshot of woman with blonde hair in white medical coat smiling warmly",
      status: "Active",
      lastActive: "2 hours ago",
      permissions: ["Full Access", "User Management", "System Settings"],
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@dentalcare.com",
      role: "Dentist",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1270011a8-1763300934713.png",
      avatarAlt: "Professional headshot of Asian male dentist with short black hair in navy scrubs",
      status: "Active",
      lastActive: "30 minutes ago",
      permissions: ["Patient Records", "Treatment Planning", "Clinical Notes"],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@dentalcare.com",
      role: "Office Manager",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dd7eb8c-1763293980389.png",
      avatarAlt: "Professional headshot of Hispanic woman with brown hair in business attire",
      status: "Active",
      lastActive: "1 hour ago",
      permissions: ["Scheduling", "Billing", "Reports"],
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@dentalcare.com",
      role: "Dental Hygienist",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15b6cb58e-1763301798091.png",
      avatarAlt: "Professional headshot of male dental hygienist with brown hair in teal scrubs",
      status: "Inactive",
      lastActive: "2 days ago",
      permissions: ["Patient Records", "Clinical Notes"],
    },
  ]; */

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "administrator", label: "Administrator" },
    { value: "dentist", label: "Dentist" },
    { value: "office-manager", label: "Office Manager" },
    { value: "hygienist", label: "Dental Hygienist" },
  ];

  /* const filteredUsers = usersMock?.filter((user) => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = selectedRole === "all" || user?.role?.toLowerCase()?.replace(" ", "-") === selectedRole;
    return matchesSearch && matchesRole;
  }); */

  // FILTRADO DINÁMICO
  const filteredUsers = users?.filter((user) => {
    const primaryRole = user?.user_roles?.[0]?.roles?.name?.toLowerCase() || "";
    const matchesSearch =
      user?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = selectedRole === "all" || primaryRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input
            type="search"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role"
            className="w-full sm:w-48"
          />
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => setShowAddUser(!showAddUser)}
            className="w-full sm:w-auto"
          >
            Add User
          </Button>
        </div>
      </div>

      {showAddUser && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">Add New User</h4>
            <Button variant="ghost" size="icon" iconName="X" onClick={() => setShowAddUser(false)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" type="text" placeholder="Enter full name" required />
            <Input label="Email Address" type="email" placeholder="Enter email" required />
            <Select label="Role" options={roleOptions?.filter((opt) => opt?.value !== "all")} placeholder="Select role" required />
            <Input label="Phone Number" type="tel" placeholder="Enter phone number" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button variant="default">Create User</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredUsers?.map((user) => {
          // Lógica para normalizar datos del mock vs base de datos
          const userRole = t(`roles.${user?.user_roles?.[0]?.roles?.name || "user"}`) || t("roles.user");
          const isActive = user?.status === "active";

          return (
            <div
              key={user?.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar Hardcoded hasta que tengas storage de imágenes */}
                  <Image
                    src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=b97beb&color=fff`}
                    alt={user?.full_name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm md:text-base text-foreground truncate">{user?.full_name}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`} />
                        {user?.status || "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium capitalize">
                        <Icon name="Shield" size={12} />
                        {userRole}
                      </span>
                      {/* Hardcoded: Last active y Permissions (puedes calcularlo de created_at si quieres) */}
                      <span className="text-xs text-muted-foreground">Joined: {new Date(user?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button variant="outline" size="sm" iconName="Edit" className="flex-1 lg:flex-none">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" iconName="Key" className="flex-1 lg:flex-none">
                    Permissions
                  </Button>
                  <Button variant="ghost" size="icon" iconName="MoreVertical" />
                </div>
              </div>

              {/* Permissions Hardcoded */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Permissions:</span>
                  {["View Patients", "Standard Access"].map((permission, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-muted rounded text-xs text-foreground">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManagementCard;
