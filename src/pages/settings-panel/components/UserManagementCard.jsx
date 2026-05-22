import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { useUserRegistration } from "@/hooks/UserHooks";

const UserManagementCard = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { formData, setFormData, formError, handleRegisterUser } = useUserRegistration();

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleOptions = [
    { value: "all", label: t("users.roles.all") },
    { value: "administrator", label: t("users.roles.administrator") },
    { value: "dentist", label: t("users.roles.dentist") },
  ];

  const filteredUsers = users?.filter((user) => {
    const primaryRole = user?.user_roles?.[0]?.roles?.name?.toLowerCase() || "";
    const matchesSearch =
      user?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = selectedRole === "all" || primaryRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  const onSubmit = async (e) => {
    const result = await handleRegisterUser(e);
    if (result?.success) {
      setShowAddUser(false);
      await fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input
            type="search"
            placeholder={t("users.search_placeholder")}
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
            placeholder={t("users.filter_role")}
            className="w-full sm:w-48"
          />
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => setShowAddUser(!showAddUser)}
            className="w-full sm:w-auto"
          >
            {t("users.add_user_btn")}
          </Button>
        </div>
      </div>

      {/* Formulario de Nuevo Usuario */}
      {showAddUser && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">{t("users.form_title")}</h4>
            <Button variant="ghost" size="icon" iconName="X" onClick={() => setShowAddUser(false)} />
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("users.labels.full_name")}
                type="text"
                placeholder={t("users.placeholders.full_name")}
                required
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <Input
                label={t("users.labels.email")}
                type="email"
                placeholder={t("users.placeholders.email")}
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Select
                label={t("users.labels.role")}
                options={roleOptions?.filter((opt) => opt?.value !== "all")}
                placeholder={t("users.placeholders.role")}
                required
                value={formData.roleId || ""}
                onChange={(e) => {
                  const val = e?.target ? e.target.value : e;
                  setFormData({ ...formData, roleId: val });
                }}
              />
              <Input
                label={t("users.labels.phone")}
                type="tel"
                placeholder={t("users.placeholders.phone")}
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {formError && <p className="text-red-500 text-xs col-span-1 md:col-span-2">{formError}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                {t("common.cancel")}
              </Button>
              <Button variant="default" type="submit">
                {t("users.create_btn")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Usuarios */}
      <div className="space-y-3">
        {filteredUsers?.map((user) => {
          const userRole = t(`roles.${user?.user_roles?.[0]?.roles?.name || "user"}`);
          const isActive = user?.status === "active";

          return (
            <div
              key={user?.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "")}&background=b97beb&color=fff`}
                    alt={user?.full_name || "User avatar"}
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`}
                        />
                        {user?.status || t("users.status.inactive")}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium capitalize">
                        <Icon name="Shield" size={12} />
                        {userRole}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("users.joined")}: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button variant="outline" size="sm" iconName="Edit" className="flex-1 lg:flex-none">
                    {t("common.edit")}
                  </Button>
                  <Button variant="outline" size="sm" iconName="Key" className="flex-1 lg:flex-none">
                    {t("users.permissions_btn")}
                  </Button>
                  <Button variant="ghost" size="icon" iconName="MoreVertical" />
                </div>
              </div>

              {/* Permisos */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{t("users.permissions_label")}</span>
                  {[t("permissions.view_patients"), t("permissions.standard_access")].map((permission, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 bg-muted rounded text-xs text-foreground"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vacío */}
      {filteredUsers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("users.no_results")}</p>
        </div>
      )}
    </div>
  );
};

export default UserManagementCard;
